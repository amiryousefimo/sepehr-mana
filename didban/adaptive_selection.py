"""Deterministic fixed-bank selector for pre-pilot multistage routing.
It does not estimate ability or implement calibrated CAT.
"""
from collections import Counter

VALID_PHASE = "initial"
ACTIVE_STATUSES = {"ACTIVE", "APPROVED", "PILOT"}

def _eligible(item, age_band, used, family_counts, max_per_family):
    return (item.get("active") is True and item.get("status") in ACTIVE_STATUSES
            and item.get("band") == age_band and item.get("id") not in used
            and family_counts[item.get("family")] < max_per_family)

def _valid_history(history):
    return [h for h in history if h.get("valid") is True
            and h.get("phase", VALID_PHASE) == VALID_PHASE
            and type(h.get("correct")) is bool]

def _routed_difficulty(dimension, history, rules, bank_version, age_band):
    rows = [h for h in history if h.get("dimension") == dimension]
    current = int(rows[-1].get("difficulty", 1)) if rows else 1
    stage_rows = [h for h in rows if int(h.get("difficulty", 1)) == current]
    n_valid = len(stage_rows)
    n_correct = sum(h["correct"] for h in stage_rows)
    matches = [r for r in rules if r.get("approved") is True
        and r.get("age_band") == age_band and r.get("bank_version") == bank_version
        and r.get("dimension") == dimension and r.get("from_difficulty") == current
        and n_valid >= r.get("min_valid", 0) and n_correct >= r.get("min_correct", 0)
        and n_correct <= r.get("max_correct", n_valid)]
    if not matches:
        return current, f"بدون قاعدهٔ مسیر مصوب؛ ادامهٔ سطح {current}"
    rule = sorted(matches, key=lambda r: (-r.get("priority", 0), r["id"]))[0]
    target = int(rule["to_difficulty"])
    if target not in (1, 2, 3) or abs(target-current) > 1:
        raise ValueError("قانون مسیر باید فقط یک سطح مجاور را انتخاب کند.")
    return target, f"قاعدهٔ مصوب {rule['id']}؛ {n_correct}/{n_valid} پاسخ معتبر در این سطح"

def select_next_question(items, history, *, age_band, dimension_order, routing_rules, bank_version, exposure_counts=None, max_per_family=2):
    """Return the next active bank item and an auditable reason, or item=None.

    History rows need item_id, dimension, difficulty, correct, valid and phase.
    Invalid, hinted, transfer and omitted responses must not be valid initial rows.
    Routing rules are supplied after expert review; this module invents none.
    """
    valid = _valid_history(history)
    used = {h.get("item_id") for h in history if h.get("item_id")}
    family_counts = Counter((exposure_counts or {}).get("family_counts", {}))
    family_counts.update(i.get("family") for i in items if i.get("id") in used)
    eligible = [i for i in items if _eligible(i, age_band, used, family_counts, max_per_family)]
    if not eligible:
        return {"item": None, "reason": "بانک فعال سؤال واجد شرایط ندارد؛ آزمون متوقف یا ارجاع شود.", "bank_version": bank_version}
    coverage = Counter(h["dimension"] for h in valid)
    dimensions = [d for d in dimension_order if any(i.get("dimension") == d for i in eligible)]
    if not dimensions:
        return {"item": None, "reason": "هیچ حوزهٔ فعالی در مشخصات مسیر تعریف نشده است.", "bank_version": bank_version}
    dimension = min(dimensions, key=lambda d: (coverage[d], dimension_order.index(d)))
    target, reason = _routed_difficulty(dimension, valid, routing_rules, bank_version, age_band)
    stage_items = [i for i in eligible if i.get("dimension") == dimension and int(i.get("difficulty", 1)) == target]
    if not stage_items:
        available = sorted({int(i.get("difficulty", 1)) for i in eligible if i.get("dimension") == dimension and abs(int(i.get("difficulty", 1))-target) <= 1}, key=lambda n: (abs(n-target), n))
        if not available:
            return {"item": None, "reason": "سؤال فعال در همین سطح یا سطح مجاور نیست؛ برای جلوگیری از پرش، مسیر متوقف شد.", "bank_version": bank_version}
        target = available[0]
        stage_items = [i for i in eligible if i.get("dimension") == dimension and int(i.get("difficulty", 1)) == target]
        reason += "; سطح هدف موجود نبود و نزدیک‌ترین سطح فعال انتخاب شد"
    stage_items.sort(key=lambda i: (i.get("family", ""), i.get("id", "")))
    item = stage_items[0]
    return {"item": item, "reason": f"کمترین پوشش فعلی در حوزهٔ {dimension}; {reason}; بانک {bank_version}", "bank_version": bank_version, "routing_dimension": dimension, "target_difficulty": target, "n_valid_for_dimension": coverage[dimension]}
