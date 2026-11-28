from collections import Counter, defaultdict
from importlib.util import module_from_spec, spec_from_file_location
from pathlib import Path
import unittest


REPO = Path(__file__).resolve().parents[1]
spec = spec_from_file_location("short_term_package", REPO / "scripts" / "build-rasad-short-term.py")
packager = module_from_spec(spec)
spec.loader.exec_module(packager)


class ShortTermReconciliation(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.meta, cls.profiles, cls.base = packager.load_base()
        cls.added = packager.read_gzip(packager.ROOT / "short-term.json.gz")
        cls.rows = [row for profile in cls.added["profiles"].values() for row in profile]
        cls.paid = [row for row in cls.rows if row["Status"] == "Paid"]
        cls.new = [row for row in cls.paid if row["LegacyBenefitKey"] is None]
        cls.legacy = [row for row in cls.paid if row["LegacyBenefitKey"] is not None]

    def test_paid_dates_source_and_legacy_matching(self):
        export = {"taxonomy": self.added["taxonomy"], "shortTermBenefits": self.rows}
        rebuilt = packager.make_bundle(export, self.meta, self.profiles, self.base)
        self.assertEqual(self.added, rebuilt)
        self.assertEqual(Counter(row["Status"] for row in self.rows), {"Paid": 562, "Pending": 9, "Rejected": 9})
        self.assertEqual(len(self.legacy), 85)
        self.assertEqual(len(self.new), 477)
        self.assertEqual(len({row["BenefitTypeCode"] for row in self.paid}), 9)
        self.assertEqual(len({row["PeriodKey"] for row in self.paid}), 43)
        with self.assertRaises(ValueError):
            packager.verify_export({**export, "shortTermBenefits": self.rows + [self.rows[0]]}, self.meta, self.profiles)
        same_payment = {**self.new[0], "ShortTermBenefitKey": max(row["ShortTermBenefitKey"] for row in self.rows) + 1}
        with self.assertRaises(ValueError):
            packager.verify_export({**export, "shortTermBenefits": self.rows + [same_payment]}, self.meta, self.profiles)

    def test_groups_and_cash_paid_are_reconciled(self):
        total = sum(row["PaidAmount"] for row in self.paid)
        additional = sum(row["PaidAmount"] for row in self.new)
        self.assertEqual((total, additional), (8_884_120_000, 7_006_570_000))
        self.assertEqual(total - additional, sum(row["PaidAmount"] for row in self.legacy))
        public_groups = self.added["shortTermBenefit"]
        self.assertEqual(sum(row["PaymentCount"] for row in public_groups), len(self.paid))
        self.assertEqual(sum(row["PaidAmount"] for row in public_groups), total)
        self.assertEqual(sum(row["AdditionalPaidAmount"] for row in public_groups), additional)
        self.assertFalse(any("PersonKey" in row or "SourceRef" in row for row in public_groups))
        for basis, amount in (("تعهدی", "BookValue"), ("نقدی", "CashValue")):
            finance = [row for row in self.added["finance"] if row["Basis"] == basis]
            self.assertEqual(sum(row[amount] for row in finance), additional)
            self.assertEqual(sum(row["Events"] for row in finance), len(self.new))
            self.assertTrue(all(row["Account"] == "تعهدات کوتاه‌مدت" and row["ControlValue"] == 0 for row in finance))
        for version in {row["Version"] for row in self.base["budget"]}:
            budget = [row for row in self.added["budget"] if row["Version"] == version]
            self.assertEqual(sum(row["Actual"] for row in budget), additional)
            self.assertTrue(all(row["Approved"] is None and row["Forecast"] is None for row in budget))

    def test_bank_continuity_and_forecast_bridge(self):
        baseline = {(row["PeriodKey"], row["Bank"]): row for row in self.base["cash"]}
        patched = self.added["cash"]
        increments = defaultdict(int)
        for row in self.new:
            increments[(row["PeriodKey"], packager.bank_for(row["RegionKey"]))] += row["PaidAmount"]
        last = {}
        for row in patched:
            bank = row["Bank"]
            key = row["PeriodKey"], bank
            previous = baseline[key]
            self.assertEqual(row["Outflow"] - previous["Outflow"], increments[key])
            self.assertEqual(row["Inflow"], previous["Inflow"])
            self.assertEqual(row["Closing"], row["Opening"] + row["Inflow"] - row["Outflow"])
            self.assertEqual(row["Opening"], last.get(bank, previous["Opening"]))
            last[bank] = row["Closing"]
        new_forecast = self.added["forecast"]
        scenarios = self.meta["dims"]["Scenario"]
        base_forecast = sorted(self.base["forecast"], key=lambda row: (row["PeriodKey"], row["ScenarioKey"], row["Bank"]))
        self.assertEqual(packager.patch_forecast(base_forecast, self.base["cash"], scenarios), base_forecast)
        for row in new_forecast:
            self.assertLessEqual(row["Low"], row["Closing"])
            self.assertLessEqual(row["Closing"], row["High"])
        cash_position = {(row["ScenarioKey"], row["Bank"]): last[row["Bank"]] for row in new_forecast}
        for row in new_forecast:
            key = row["ScenarioKey"], row["Bank"]
            self.assertEqual(row["Closing"], cash_position[key] + row["Inflow"] - row["Outflow"])
            cash_position[key] = row["Closing"]


if __name__ == "__main__":
    unittest.main()
