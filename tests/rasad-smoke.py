import argparse
import gzip
import json
from http.cookiejar import CookieJar
from pathlib import Path
from urllib.error import HTTPError
from urllib.parse import parse_qs, urlencode, urlsplit
from urllib.request import HTTPCookieProcessor, HTTPRedirectHandler, Request, build_opener


class NoRedirect(HTTPRedirectHandler):
    def redirect_request(self, *args, **kwargs):
        return None


def smoke(origin, credentials):
    client = build_opener(NoRedirect(), HTTPCookieProcessor(CookieJar()))
    prefix = "/dashboard_2"

    def request(path, status, form=None, headers=None):
        values = headers or {}
        data = urlencode(form).encode() if form is not None else None
        query = Request(origin + prefix + path, data=data, headers=values)
        try:
            response = client.open(query, timeout=20)
        except HTTPError as error:
            response = error
        with response:
            assert response.code == status, f"{path}: expected {status}, got {response.code}"
            raw = response.read()
            return (gzip.decompress(raw) if response.headers.get("Content-Encoding") == "gzip" else raw), response.headers

    landing, headers = request("", 200)
    assert "ورود به داشبورد ۲" in landing.decode()
    assert b"app.powerbi.com" not in landing and "no-store" in headers["Cache-Control"]
    for path in ["/report", "/report/guide.html", "/report/help.js", "/report/help-reports.js", "/report/api/meta", "/report/api/gold", "/report/api/governance", "/report/api/profile?person=1"]:
        request(path, 401)
    login_headers = {"Origin": origin}
    request("/session", 403, credentials, {"Origin": "https://invalid.example"})
    _, headers = request("/session", 303, {**credentials, "password": "A" * 32}, login_headers)
    failure = parse_qs(urlsplit(headers["Location"]).query)
    assert failure["status"] == ["invalid"] and failure["ref"] == [headers["X-Rasad-Event"]] and not headers.get("Set-Cookie")
    _, headers = request("/session", 303, credentials, login_headers)
    cookie = headers["Set-Cookie"].lower()
    assert "httponly" in cookie and "samesite=strict" in cookie and "path=/dashboard_2" in cookie
    if origin.startswith("https:"):
        assert "secure" in cookie
    assert b'iframe' in request("", 200)[0]
    report, policy = request("/report", 200)
    assert b"help-dialog" in report and b"help-reports.js" in report
    assert "frame-ancestors 'self'" in policy["Content-Security-Policy"]
    assert b"rasadHelp" in request("/report/help.js", 200)[0]
    assert b"rasadReportHelp" in request("/report/help-reports.js", 200)[0]
    assert b"book-main" in request("/report/guide.html", 200)[0]
    assert b"rasadProfileMath" in request("/report/profile-math.js", 200)[0]
    assert b"G-12" in request("/report/pages.js", 200)[0]
    meta = json.loads(request("/report/api/meta", 200)[0])
    governance = json.loads(request("/report/api/governance", 200, headers={"Accept-Encoding": "gzip"})[0])
    provinces = json.loads(request("/report/iran-provinces.json", 200)[0])
    assert len(governance) == 13 and len({item["properties"]["shapeName"] for item in provinces["features"]}) == 31
    assert meta["roles"]["viewer"]["export"] is False
    gold = json.loads(request("/report/api/gold", 200)[0])
    assert gold["currency"] == "IRR" and gold["mode"] in {"latest-close", "archive"} and gold["reference"]["rials"] > 0
    assert all(str(period["PeriodKey"]) in gold["months"] for period in meta["dims"]["Period"] if period["IsActual"])
    for case in [1, 5, 160]:
        code = f"DEMO-{case:04d}"
        assert json.loads(request("/report/api/search?q=" + code, 200)[0])[0]["CaseCode"] == code
        profile = json.loads(request(f"/report/api/profile?person={case}", 200)[0])
        assert profile["person"][0]["CaseCode"] == code
        family = profile["household"]
        assert family["origin"] == "DEMO-HOUSEHOLD-1"
        dependent_ids = {row["DependentKey"] for row in family["dependents"]}
        assert len({row["DependentBenefitKey"] for row in family["dependentBenefits"]}) == len(family["dependentBenefits"])
        assert all(row["FamilyPaid"] > 0 and row["DependentKey"] in dependent_ids for row in family["dependentBenefits"])
        if case == 1:
            assert len(dependent_ids) == 10 and len(family["dependentBenefits"]) >= 10
            assert {row["HistoryTypeCode"] for row in profile["coverageHistory"]} == {"01", "08", "09"}
            first_membership = min(row["StartDate"] for row in profile["membership"])
            samples = [row for row in profile["coverageHistory"] if row["CoverageReference"].startswith("DEMO-COVERAGE-")]
            assert len(samples) == 2 and all(row["StartDate"] <= row["EndDate"] < first_membership for row in samples)
            assert {row["HistoryTypeCode"] for row in profile["membership"]} == {"01"}
    request("/report/profiles.json.gz", 404)
    request("/report/api/scenario", 405, {}, login_headers)
    request("/session", 303, {"action": "logout"}, login_headers)
    request("/report/api/governance", 401)
    print("Site login, cookie policy, report access, all 31 map features, synthetic profiles and logout passed.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("origin", choices=["http://127.0.0.1:3012", "http://127.0.0.1:3022", "https://tgsepma.com"])
    parser.add_argument("credentials", type=Path)
    args = parser.parse_args()
    smoke(args.origin, json.loads(args.credentials.read_text(encoding="utf-8-sig")))
