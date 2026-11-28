import argparse
import json
import os
from concurrent.futures import ThreadPoolExecutor
from http.cookiejar import CookieJar
from pathlib import Path
from urllib.error import HTTPError
from urllib.parse import parse_qs, urlencode, urlsplit
from urllib.request import HTTPCookieProcessor, HTTPRedirectHandler, Request, build_opener
from uuid import UUID, uuid4


class NoRedirect(HTTPRedirectHandler):
    def redirect_request(self, *args, **kwargs):
        return None


class Browser:
    def __init__(self, origin):
        self.origin = origin
        self.jar = CookieJar()
        self.opener = build_opener(NoRedirect(), HTTPCookieProcessor(self.jar))

    def request(self, path, expected, *, form=None, payload=None, origin=None):
        headers = {}
        body = None
        if form is not None:
            body = urlencode(form).encode()
            headers["Content-Type"] = "application/x-www-form-urlencoded"
        elif payload is not None:
            body = json.dumps(payload).encode()
            headers["Content-Type"] = "application/json"
        if body is not None:
            headers["Origin"] = origin or self.origin
        request = Request(self.origin + path, data=body, headers=headers)
        try:
            response = self.opener.open(request, timeout=45)
        except HTTPError as error:
            response = error
        with response:
            assert response.code == expected, f"{path}: expected {expected}, got {response.code}"
            return response.read(), response.headers

    def cookie(self, name):
        return next((cookie.value for cookie in self.jar if cookie.name == name), None)


def event_ref(headers):
    return str(UUID(headers["X-Rasad-Event"]))


def verify(origin, administrator, viewer):
    first, second, visitor, observer, site_a, site_b = (Browser(origin) for _ in range(6))
    log = "/dashboard_2/access-log"
    login = "/dashboard_2/session"
    report = "/dashboard_2/report"
    site_login = "/api/admin/auth"
    viewer_form = {"username": viewer["username"], "password": viewer["password"]}
    admin_form = {"username": "admin", "password": administrator}
    wrong = "invalid-" + uuid4().hex
    visitor.request(log, 404)
    observer.request(login, 303, form=viewer_form)
    observer.request(log, 404)
    _, blocked = visitor.request(login, 403, form=admin_form, origin="https://denied.test")
    _, malformed = visitor.request(login, 415, payload=admin_form)
    _, unknown = visitor.request(login, 303, form={"username": "unknown-" + uuid4().hex, "password": wrong})
    _, wrong_dashboard = visitor.request(login, 303, form={**admin_form, "password": wrong})
    failure = parse_qs(urlsplit(wrong_dashboard["Location"]).query)
    assert failure["status"] == ["invalid"] and failure["ref"] == [event_ref(wrong_dashboard)]
    assert visitor.cookie("rasad_admin") is None
    _, wrong_site = visitor.request(site_login, 401, payload={"password": wrong})
    _, blocked_site = visitor.request(site_login, 403, payload={"password": wrong}, origin="https://denied.test")

    with ThreadPoolExecutor(max_workers=4) as pool:
        login_requests = [
            pool.submit(browser.request, login, 303, form=admin_form) for browser in (first, second)
        ] + [
            pool.submit(browser.request, site_login, 200, payload={"password": administrator}) for browser in (site_a, site_b)
        ]
        successes = [job.result()[1] for job in login_requests]
    first_token, second_token = first.cookie("rasad_admin"), second.cookie("rasad_admin")
    assert first_token and second_token and first_token != second_token
    assert first.cookie("admin_session") is None and second.cookie("admin_session") is None
    assert site_a.cookie("admin_session") and site_b.cookie("admin_session")
    for browser in (first, second, site_a, site_b):
        browser.request(log, 200)
    _, loaded_first = first.request(report, 200)
    _, loaded_second = second.request(report, 200)
    first.request(login, 303, form={"action": "logout"})
    first.request(report, 401)
    first.request(log, 404)
    second.request(report, 200)
    site_a.request(login, 303, form={"action": "logout"})
    site_a.request(log, 404)
    site_b.request(log, 200)

    cases = [(blocked, "blocked"), (malformed, "blocked"), (unknown, "rejected"), (wrong_dashboard, "rejected"),
             (wrong_site, "rejected"), (blocked_site, "blocked"), (loaded_first, "report_open"),
             (loaded_second, "report_open"), *((item, "accepted") for item in successes)]
    for sample, result in cases:
        ref = event_ref(sample)
        page, headers = second.request(log + "?" + urlencode({"ref": ref, "result": result}), 200)
        assert b'data-outcome="' + result.encode() + b'"' in page and ref.encode() in page
        assert b"<time " in page and "no-store" in headers["Cache-Control"]
        assert wrong.encode() not in page and first_token.encode() not in page and second_token.encode() not in page
        assert administrator.encode() not in page and viewer_form["password"].encode() not in page
    unmatched, _ = second.request(log + "?" + urlencode({"ref": event_ref(wrong_dashboard), "result": "accepted"}), 200)
    assert b"data-outcome=" not in unmatched
    print("Concurrent dashboard and site admin sessions, logout isolation, private audit, failure tracing and report opens passed.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("origin")
    parser.add_argument("viewer_file", type=Path)
    parser.add_argument("--admin-file", type=Path)
    args = parser.parse_args()
    admin = json.loads(args.admin_file.read_text(encoding="utf-8-sig"))["password"] if args.admin_file else os.environ["ADMIN_PASSWORD"]
    verify(args.origin.rstrip("/"), admin, json.loads(args.viewer_file.read_text(encoding="utf-8-sig")))
