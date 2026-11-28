import argparse
from collections import defaultdict
from datetime import date
import gzip
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1] / "reports" / "rasad"
ORIGIN = "DEMO-SHORT-TERM-1"
ACCOUNT = "تعهدات کوتاه‌مدت"
LEGACY_ACCOUNT = "مزایای نقدی"
COST = "مصرف"
UNASSIGNED = 0
SOURCE = 51
METHOD = "ثبت پرداخت کوتاه‌مدت نمونه"


def read_gzip(path):
    return json.loads(gzip.decompress(path.read_bytes()))


def encode(payload):
    return gzip.compress(json.dumps(payload, ensure_ascii=False, separators=(",", ":"), sort_keys=True).encode(), mtime=0)


def load_base(root=ROOT):
    return tuple(read_gzip(root / f"{name}.json.gz") for name in ("meta", "profiles", "governance"))


def period_for(day, periods):
    return next((period["PeriodKey"] for period in periods if period["StartDate"] <= day <= period["EndDate"]), None)


def verify_export(export, meta, profiles):
    taxonomy = sorted(export["taxonomy"], key=lambda item: (item["SortOrder"], item["BenefitTypeCode"]))
    titles = {item["BenefitTypeCode"]: item["BenefitTypeName"] for item in taxonomy}
    if not titles or len(titles) != len(taxonomy):
        raise ValueError("Short-term taxonomy must be non-empty and unique.")
    periods = [period for period in meta["dims"]["Period"] if period["IsActual"]]
    regions = {row["RegionKey"] for row in meta["dims"]["Region"]} | {UNASSIGNED}
    plans = {row["PlanKey"] for row in meta["dims"]["Plan"]}
    parties = {row["PartyKey"] for row in meta["dims"]["Party"]}
    ids, source_ids, legacy_ids = set(), set(), set()
    clean = []
    for entry in export["shortTermBenefits"]:
        person_key = entry["PersonKey"]
        profile = profiles.get(str(person_key), {})
        person = (profile.get("person") or [{}])[0]
        if person.get("CaseCode") != f"DEMO-{person_key:04d}" or entry["Origin"] != ORIGIN:
            raise ValueError("Only verified fixture cases are allowed.")
        key = entry["ShortTermBenefitKey"]
        legacy_key = entry.get("LegacyBenefitKey")
        regional_key = entry["RegionKey"]
        plan_key = entry.get("PlanKey")
        party_key = entry.get("PartyKey")
        membership_key = entry.get("MembershipKey")
        source_key = entry["SourceKey"]
        source_id = source_key, entry["SourceRef"]
        claim = date.fromisoformat(entry["ClaimDate"]).isoformat()
        payment = date.fromisoformat(entry["PaymentDate"]).isoformat() if entry.get("PaymentDate") else None
        paid_amount = entry["PaidAmount"]
        status = entry["Status"]
        if (type(key) is not int or key <= 0 or key in ids or source_id in source_ids or regional_key not in regions
                or plan_key not in (plans | {None}) or party_key not in (parties | {None})):
            raise ValueError(f"Invalid identity or dimension on {key}")
        if membership_key is not None and not any(row["MembershipKey"] == membership_key for row in profile["membership"]):
            raise ValueError(f"Invalid policy reference on {key}")
        benefit_type = entry["BenefitTypeCode"]
        if entry["BenefitTypeName"] != titles.get(benefit_type) or period_for(claim, periods) is None:
            raise ValueError(f"Invalid taxonomy or claim date on {key}")
        if status not in {"Paid", "Pending", "Rejected"} or type(paid_amount) is not int:
            raise ValueError(f"Invalid status or amount on {key}")
        expected_period = period_for(payment, periods) if payment else None
        if status == "Paid":
            if not payment or payment < claim or paid_amount <= 0 or not expected_period or entry["PeriodKey"] != expected_period:
                raise ValueError(f"Invalid paid row {key}")
        elif paid_amount or payment or entry["PeriodKey"] is not None:
            raise ValueError(f"Unpaid row has cash or a payment period: {key}")
        if legacy_key is not None:
            previous = next((row for row in profile["benefit"] if row["BenefitKey"] == legacy_key), None)
            if (legacy_key in legacy_ids or not previous or previous["Kind"] != LEGACY_ACCOUNT or previous["Service"] != "بیمه بیکاری"
                    or benefit_type != "UNEMPLOYMENT" or status != "Paid" or previous["Fund"] != paid_amount
                    or previous["Paid"] != payment or previous["EventDate"] != claim or previous["RegionKey"] != regional_key
                    or previous["PlanKey"] != plan_key or previous["SourceKey"] != source_key
                    or previous["SourceRef"] != entry["SourceRef"]):
                raise ValueError(f"Legacy linkage does not match the original paid unemployment event: {key}")
            legacy_ids.add(legacy_key)
        elif source_key != SOURCE or not entry["SourceRef"].startswith("ST-"):
            raise ValueError(f"Invalid fixture source: {key}")
        ids.add(key)
        source_ids.add(source_id)
        expected_additional = paid_amount if status == "Paid" and legacy_key is None else 0
        if entry.get("AdditionalPaidAmount", expected_additional) != expected_additional:
            raise ValueError(f"Invalid additional amount on {key}")
        clean.append({
            **{name: entry[name] for name in (
                "ShortTermBenefitKey", "PersonKey", "RegionKey", "BenefitTypeCode", "BenefitTypeName",
                "PeriodKey", "Status", "PaidAmount", "Origin", "SourceKey", "SourceRef"
            )},
            "ClaimDate": claim, "PaymentDate": payment, "LegacyBenefitKey": legacy_key,
            "PlanKey": plan_key, "PartyKey": party_key, "MembershipKey": membership_key,
            "AdditionalPaidAmount": expected_additional,
        })
    if not clean or not {row["BenefitTypeCode"] for row in clean if row["Status"] == "Paid"} == titles.keys():
        raise ValueError("Every taxonomy member must have at least one paid demo event.")
    clean.sort(key=lambda row: (row["PersonKey"], row["ClaimDate"], str(row["ShortTermBenefitKey"])))
    return taxonomy, clean


def bank_for(region):
    return "حساب تجمیع وصول" if region % 2 else "حساب مرکزی"


def patch_cash(baseline, additions):
    ordered = sorted(baseline, key=lambda row: (row["PeriodKey"], row["Bank"]))
    offsets = defaultdict(int)
    patched = []
    for row in ordered:
        key = row["PeriodKey"], row["Bank"]
        incremental = additions.pop(key, 0)
        offset = offsets[row["Bank"]]
        outflow = row["Outflow"] + incremental
        patched.append({
            **row, "Opening": row["Opening"] - offset, "Outflow": outflow,
            "Closing": row["Closing"] - offset - incremental,
            "DueOutflow": row["DueOutflow"] + max(outflow, outflow * 109 // 100) - max(row["Outflow"], row["Outflow"] * 109 // 100),
        })
        offsets[row["Bank"]] += incremental
    if additions:
        raise ValueError(f"Missing cash periods: {sorted(additions)}")
    return patched


def patch_forecast(baseline, cash, scenarios):
    histories = defaultdict(list)
    for row in cash:
        histories[row["Bank"]].append(row)
    models = {row["ScenarioKey"]: row for row in scenarios}
    openings, horizons = {}, defaultdict(int)
    patched = []
    for row in sorted(baseline, key=lambda row: (row["PeriodKey"], row["ScenarioKey"], row["Bank"])):
        bank = row["Bank"]
        scenario = models[row["ScenarioKey"]]
        model_key = (row["ScenarioKey"], bank)
        recent = histories[bank][-6:]
        horizons[model_key] += 1
        horizon = horizons[model_key]
        inflow = round(sum(period["Inflow"] for period in recent) / 6 * (1 + scenario["PremiumRate"]) * (1 + horizon * 0.009))
        outflow = round(sum(period["Outflow"] for period in recent) / 6 * (1 + scenario["PensionRate"] * 0.55 + scenario["HealthRate"] * 0.25) * (1 + horizon * 0.02))
        closing = openings.get(model_key, recent[-1]["Closing"]) + inflow - outflow
        spread = round(max(inflow, outflow) * 0.12 * horizon ** 0.5)
        patched.append({**row, "Inflow": inflow, "Outflow": outflow, "Closing": closing, "Low": closing - spread, "High": closing + spread})
        openings[model_key] = closing
    return patched


def make_bundle(export, meta, profiles, governance):
    if "shortTermBenefit" in governance:
        raise ValueError("Start with the original finance snapshot; a previously applied addition would double count.")
    taxonomy, detail = verify_export(export, meta, profiles)
    paid_groups = {}
    financial = {}
    bank_outflow = defaultdict(int)
    profile_index = defaultdict(list)
    for row in detail:
        profile_index[str(row["PersonKey"])].append(row)
        if row["Status"] != "Paid":
            continue
        period, plan, region = row["PeriodKey"], row["PlanKey"] or UNASSIGNED, row["RegionKey"]
        group = (period, plan, region, row["BenefitTypeCode"])
        report = paid_groups.setdefault(group, {
            "PeriodKey": period, "PlanKey": plan, "RegionKey": region, "BenefitTypeCode": row["BenefitTypeCode"],
            "BenefitTypeName": row["BenefitTypeName"], "PaymentCount": 0, "PaidAmount": 0, "AdditionalPaidAmount": 0,
        })
        report["PaymentCount"] += 1
        report["PaidAmount"] += row["PaidAmount"]
        report["AdditionalPaidAmount"] += row["AdditionalPaidAmount"]
        if row["AdditionalPaidAmount"]:
            journal = financial.setdefault((period, plan, region), {"Amount": 0, "Events": 0})
            journal["Amount"] += row["AdditionalPaidAmount"]
            journal["Events"] += 1
            bank_outflow[(period, bank_for(region))] += row["AdditionalPaidAmount"]
    finance = []
    for (period, plan, region), entry in sorted(financial.items()):
        amount = entry["Amount"]
        shared = {
            "PeriodKey": period, "PlanKey": plan, "RegionKey": region, "SourceKey": SOURCE,
            "Account": ACCOUNT, "Direction": COST, "Attribution": "مستقیم" if plan else "تخصیص‌نیافته",
            "Method": METHOD, "Events": entry["Events"],
        }
        finance.extend([
            {**shared, "BookValue": amount, "CashValue": 0, "ControlValue": 0, "Basis": "تعهدی"},
            {**shared, "BookValue": 0, "CashValue": amount, "ControlValue": 0, "Basis": "نقدی"},
        ])

    def budget_key(row):
        return (row["PeriodKey"], row["PlanKey"], row["RegionKey"]), row["Version"]

    versions = {row["Version"]: row["SourceKey"] for row in governance["budget"]}
    seen_budget_keys = set()
    budget = []
    for row in governance["budget"]:
        if row["Account"] != ACCOUNT or row["Direction"] != COST:
            continue
        group, version = budget_key(row)
        if group not in financial:
            continue
        seen_budget_keys.add((group, version))
        budget.append({**row, "Actual": row["Actual"] + financial[group]["Amount"]})
    for group, entry in sorted(financial.items()):
        period, plan, region = group
        for version, source in sorted(versions.items()):
            if (group, version) in seen_budget_keys:
                continue
            budget.append({
                "PeriodKey": period, "PlanKey": plan, "RegionKey": region, "Account": ACCOUNT, "Direction": COST,
                "Version": version, "Approved": None, "Revised": None, "Actual": entry["Amount"], "Forecast": None,
                "ForecastAsOf": None, "SourceKey": source,
            })
    cash = patch_cash(governance["cash"], bank_outflow)
    forecast = patch_forecast(governance["forecast"], cash, meta["dims"]["Scenario"])
    return {
        "origin": ORIGIN, "taxonomy": taxonomy, "profiles": profile_index,
        "source": {
            "SourceKey": SOURCE, "SystemName": "رخدادهای آزمایشی تعهدات کوتاه‌مدت", "OwnerName": "آموزش رصد",
            "Updated": max(row["EndDate"] for row in meta["dims"]["Period"] if row["IsActual"]),
            "Coverage": "منحصراً دادهٔ ساختگی، مبلغ بدون فرمول قانونی",
        },
        "shortTermBenefit": [paid_groups[key] for key in sorted(paid_groups)],
        "finance": finance, "budget": budget, "cash": cash, "forecast": forecast,
    }


def main():
    parser = argparse.ArgumentParser(description="Package a verified synthetic SQL short-term benefits export.")
    parser.add_argument("--sql-export", type=Path, required=True)
    parser.add_argument("--output", type=Path, default=ROOT / "short-term.json.gz")
    args = parser.parse_args()
    original = load_base()
    bundle = make_bundle(json.loads(args.sql_export.read_text(encoding="utf-8-sig")), *original)
    args.output.write_bytes(encode(bundle))
    print(f"{sum(map(len, bundle['profiles'].values()))} synthetic short-term rows; {len(bundle['shortTermBenefit'])} reporting groups.")


if __name__ == "__main__":
    main()
