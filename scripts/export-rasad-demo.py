import argparse
import concurrent.futures
import gzip
import json
import re
from pathlib import Path
from urllib.request import urlopen


def fetch(path):
    with urlopen(f"http://127.0.0.1:8766{path}", timeout=40) as response:
        return json.load(response)


def profile(case_id):
    data = fetch(f"/api/profile?person={case_id}")
    (person,) = data["person"]
    if person["CaseCode"] != f"DEMO-{case_id:04d}" or person["DisplayName"] != f"پرونده آزمایشی {case_id:03d}":
        raise ValueError(f"Refusing to export non-fixture profile {case_id}")
    person_fields = ("PersonKey", "CaseCode", "DisplayName", "Status", "RegionKey", "Gender", "AgeBand", "EntryCohort")
    data["person"] = [{field: person[field] for field in person_fields}]
    data["tickets"] = []
    return str(case_id), data


def save(path, payload):
    path.write_bytes(gzip.compress(json.dumps(payload, ensure_ascii=False, separators=(",", ":")).encode(), mtime=0))


def main():
    parser = argparse.ArgumentParser(description="Export only the verified synthetic Rasad SQL fixture.")
    parser.add_argument("--fixture-sql", required=True, type=Path)
    parser.add_argument("--confirm-synthetic", action="store_true", required=True)
    args = parser.parse_args()
    fixture = args.fixture_sql.read_text(encoding="utf-8-sig")
    cases = [int(case) for case in re.findall(r"^\((\d+),N'پرونده آزمایشی \d+',N'DEMO-\d{4}',", fixture, re.M)]
    if not cases or len(set(cases)) != len(cases):
        raise ValueError("The synthetic profile fixtures were not found.")
    bundle = Path(__file__).resolve().parents[1] / "reports" / "rasad"
    meta = fetch("/api/meta")
    if meta["forecastVersion"] != "FC-DEMO-1" or not all("ساختگی" in source["Coverage"] for source in meta["dims"]["Source"]):
        raise ValueError("Refusing to export a data source not marked as synthetic.")
    governance = fetch("/api/governance")
    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as workers:
        profiles = dict(workers.map(profile, cases))
    save(bundle / "profiles.json.gz", profiles)
    save(bundle / "governance.json.gz", governance)
    save(bundle / "meta.json.gz", {key: meta[key] for key in ("dims", "asOf", "forecastVersion")})
    print(f"{len(profiles)} synthetic cases; {len(governance)} governance datasets.")


if __name__ == "__main__":
    main()
