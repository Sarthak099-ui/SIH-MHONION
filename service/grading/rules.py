"""
AGMARK / FSSAI Aligned Onion Grading Rule Engine
Threshold Table:
---------------------------------------------------------
Grade       Rotten       Sprouted     Damaged      Undersized
A           <= 2.0%      <= 3.0%      <= 5.0%      <= 10.0%
B           <= 5.0%      <= 7.0%      <= 10.0%     <= 20.0%
URS/Reject  anything above B's thresholds
---------------------------------------------------------
"""

from typing import Dict, Any, Tuple

GRADE_THRESHOLDS = {
    "A": {
        "max_rotten": 2.0,
        "max_sprouted": 3.0,
        "max_damaged": 5.0,
        "max_undersized": 10.0,
    },
    "B": {
        "max_rotten": 5.0,
        "max_sprouted": 7.0,
        "max_damaged": 10.0,
        "max_undersized": 20.0,
    }
}

def calculate_defect_percentages(counts: Dict[str, int]) -> Dict[str, float]:
    """
    Computes percentages for 5 classes: healthy, damaged, rotten, sprouted, undersized.
    """
    total = sum(counts.values())
    if total == 0:
        return {
            "pct_healthy": 100.0,
            "pct_damaged": 0.0,
            "pct_rotten": 0.0,
            "pct_sprouted": 0.0,
            "pct_undersized": 0.0,
            "total_count": 0
        }
    
    return {
        "pct_healthy": round((counts.get("healthy", 0) / total) * 100, 2),
        "pct_damaged": round((counts.get("damaged", 0) / total) * 100, 2),
        "pct_rotten": round((counts.get("rotten", 0) / total) * 100, 2),
        "pct_sprouted": round((counts.get("sprouted", 0) / total) * 100, 2),
        "pct_undersized": round((counts.get("undersized", 0) / total) * 100, 2),
        "total_count": total
    }

def evaluate_grade(pcts: Dict[str, float]) -> Tuple[str, str]:
    """
    Evaluates grade ('A', 'B', 'URS') based on defect percentages and provides human-readable reasons.
    """
    pct_rotten = pcts.get("pct_rotten", 0.0)
    pct_sprouted = pcts.get("pct_sprouted", 0.0)
    pct_damaged = pcts.get("pct_damaged", 0.0)
    pct_undersized = pcts.get("pct_undersized", 0.0)

    # Check Grade A criteria
    if (
        pct_rotten <= GRADE_THRESHOLDS["A"]["max_rotten"] and
        pct_sprouted <= GRADE_THRESHOLDS["A"]["max_sprouted"] and
        pct_damaged <= GRADE_THRESHOLDS["A"]["max_damaged"] and
        pct_undersized <= GRADE_THRESHOLDS["A"]["max_undersized"]
    ):
        reasons = (
            f"Conforms to AGMARK Grade A: Rotten ({pct_rotten}%) <= 2%, "
            f"Sprouted ({pct_sprouted}%) <= 3%, Damaged ({pct_damaged}%) <= 5%, "
            f"Undersized ({pct_undersized}%) <= 10%."
        )
        return "A", reasons

    # Check Grade B criteria
    if (
        pct_rotten <= GRADE_THRESHOLDS["B"]["max_rotten"] and
        pct_sprouted <= GRADE_THRESHOLDS["B"]["max_sprouted"] and
        pct_damaged <= GRADE_THRESHOLDS["B"]["max_damaged"] and
        pct_undersized <= GRADE_THRESHOLDS["B"]["max_undersized"]
    ):
        violating_a = []
        if pct_rotten > GRADE_THRESHOLDS["A"]["max_rotten"]:
            violating_a.append(f"rotten ({pct_rotten}% > 2%)")
        if pct_sprouted > GRADE_THRESHOLDS["A"]["max_sprouted"]:
            violating_a.append(f"sprouted ({pct_sprouted}% > 3%)")
        if pct_damaged > GRADE_THRESHOLDS["A"]["max_damaged"]:
            violating_a.append(f"damaged ({pct_damaged}% > 5%)")
        if pct_undersized > GRADE_THRESHOLDS["A"]["max_undersized"]:
            violating_a.append(f"undersized ({pct_undersized}% > 10%)")

        reasons = (
            f"Conforms to AGMARK Grade B. Exceeded Grade A limits on: {', '.join(violating_a)}. "
            f"Remains within Grade B thresholds."
        )
        return "B", reasons

    # Otherwise URS (Under-Grade / Reject)
    violating_b = []
    if pct_rotten > GRADE_THRESHOLDS["B"]["max_rotten"]:
        violating_b.append(f"rotten ({pct_rotten}% > 5%)")
    if pct_sprouted > GRADE_THRESHOLDS["B"]["max_sprouted"]:
        violating_b.append(f"sprouted ({pct_sprouted}% > 7%)")
    if pct_damaged > GRADE_THRESHOLDS["B"]["max_damaged"]:
        violating_b.append(f"damaged ({pct_damaged}% > 10%)")
    if pct_undersized > GRADE_THRESHOLDS["B"]["max_undersized"]:
        violating_b.append(f"undersized ({pct_undersized}% > 20%)")

    reasons = (
        f"Designated URS (Under-Grade / Reject): Exceeded Grade B tolerance on {', '.join(violating_b)}."
    )
    return "URS", reasons
