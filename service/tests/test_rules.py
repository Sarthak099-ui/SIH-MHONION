from grading.rules import calculate_defect_percentages, evaluate_grade

def test_grade_a_lot():
    # 95 healthy, 1 rotten, 1 sprouted, 2 damaged, 1 undersized (Total 100)
    # Rotten: 1% (<=2), Sprouted: 1% (<=3), Damaged: 2% (<=5), Undersized: 1% (<=10)
    counts = {"healthy": 95, "rotten": 1, "sprouted": 1, "damaged": 2, "undersized": 1}
    pcts = calculate_defect_percentages(counts)
    grade, reasons = evaluate_grade(pcts)
    assert grade == "A"
    assert "Grade A" in reasons

def test_grade_b_lot():
    # 85 healthy, 3 rotten, 4 sprouted, 6 damaged, 2 undersized (Total 100)
    # Rotten: 3% (>2, <=5), Sprouted: 4% (>3, <=7), Damaged: 6% (>5, <=10), Undersized: 2% (<=20)
    counts = {"healthy": 85, "rotten": 3, "sprouted": 4, "damaged": 6, "undersized": 2}
    pcts = calculate_defect_percentages(counts)
    grade, reasons = evaluate_grade(pcts)
    assert grade == "B"
    assert "Grade B" in reasons

def test_grade_urs_lot():
    # 70 healthy, 8 rotten, 2 sprouted, 10 damaged, 10 undersized (Total 100)
    # Rotten: 8% (>5 -> URS)
    counts = {"healthy": 70, "rotten": 8, "sprouted": 2, "damaged": 10, "undersized": 10}
    pcts = calculate_defect_percentages(counts)
    grade, reasons = evaluate_grade(pcts)
    assert grade == "URS"
    assert "URS" in reasons
