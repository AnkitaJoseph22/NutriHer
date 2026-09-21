"""
NutriHer Iron Bioavailability & Absorption Engine
==================================================
Implements a transparent, evidence-informed iron bioavailability estimation model
inspired by established nutritional literature (Hallberg & Hurrell 2002; Lynch 1997;
ICMR-NIN 2020 RDA guidelines).

SCIENTIFIC METHODOLOGY & ASSUMPTION DISCLOSURE:
-----------------------------------------------
1. Iron in food != Iron absorbed by the human body.
2. Non-Heme Iron (Plant/Dairy): Baseline ~8% (ICMR-NIN 2020 standard assumption for Indian diets),
   ranging from 3% to 18% based on dietary enhancers (Ascorbic Acid / Vitamin C)
   and inhibitors (Phytates, Polyphenols, high Calcium).
3. Heme Iron (Meat/Fish): Baseline ~25% (Published range ~20–30%, Hallberg & Hurrell 2002).
4. Modulating adjustments (+2%/+5% for Vitamin C; -2% for Calcium) are NutriHer project-level
   modelling heuristics designed to demonstrate meal composition effects.
5. This is an educational nutritional model for demonstration, NOT a clinical diagnostic measurement.
"""

from typing import Dict, Any, List, Optional
from .nutrition import get_nutrition_data
from .cycle import calculate_dynamic_iron_target


def calculate_absorption(
    food_name: str = "pongal",
    portion_grams: float = 150.0,
    iron_mg: Optional[float] = None,
    vitamin_c_mg: Optional[float] = None,
    calcium_mg: Optional[float] = None,
    iron_type: Optional[str] = None,
    age: Optional[int] = 23,
    height: Optional[float] = 160.0,
    weight: Optional[float] = 55.0,
    diet: Optional[str] = "Vegetarian",
    menstrual_cycle_phase: Optional[str] = "Follicular",
    intensity: Optional[str] = "Moderate",
    lifecycle_status: Optional[str] = "Regular Cycle",
    symptoms: Optional[List[str]] = None,
    daily_target_mg: Optional[float] = None,
) -> Dict[str, Any]:
    """
    Calculate dietary iron intake, estimated absorbed iron, and bioavailability factors.
    """
    portion_grams = max(0.0, float(portion_grams or 0.0))
    nutrients = get_nutrition_data(food_name, portion_grams)

    actual_iron = max(0.0, float(iron_mg)) if iron_mg is not None else max(0.0, float(nutrients["iron"]))
    actual_vit_c = max(0.0, float(vitamin_c_mg)) if vitamin_c_mg is not None else max(0.0, float(nutrients["vitaminC"]))
    actual_ca = max(0.0, float(calcium_mg)) if calcium_mg is not None else max(0.0, float(nutrients["calcium"]))
    actual_type = iron_type if iron_type is not None else nutrients["iron_type"]

    enhancers: List[str] = []
    inhibitors: List[str] = []

    if actual_type == "heme":
        # Evidence-informed representative midpoint (25%) derived from published biological range (20%–30%; Hallberg & Hurrell 2002)
        base_rate = 0.25
        enhancers.append("Heme iron source (high biological value, ~25% evidence-informed midpoint)")
    else:
        base_rate = 0.08
        enhancers.append("8% reference bioavailability assumption used by the ICMR-NIN framework")

    # Modulating factors: Vitamin C
    # Evidence is limited or mixed regarding exact percentage shifts in composite meals, and further research is needed;
    # NutriHer uses +2% / +5% as educational heuristics demonstrating chemical reduction principles.
    if actual_vit_c > 20.0:
        base_rate += 0.05
        enhancers.append(f"High Vitamin C ({actual_vit_c:.1f} mg) promotes reduction to ferrous Fe²⁺ (+5.0% educational heuristic)")
    elif actual_vit_c > 5.0:
        base_rate += 0.02
        enhancers.append(f"Moderate Vitamin C ({actual_vit_c:.1f} mg) promotes reduction (+2.0% educational heuristic)")

    # Modulating factors: Calcium
    # Evidence is limited or mixed regarding exact percentage shifts in composite meals, and further research is needed;
    # NutriHer uses -2% as an educational heuristic demonstrating competitive DMT1 inhibition principles.
    if actual_ca > 150.0:
        base_rate -= 0.02
        inhibitors.append(f"Elevated Calcium ({actual_ca:.0f} mg) competes for DMT1 mucosal uptake (-2.0% educational heuristic)")

    # Document standard non-heme inhibitors
    if actual_type != "heme":
        inhibitors.append("Tea / coffee polyphenols & phytates (if consumed within 1 hr of meal)")

    # Lifecycle & cycle context note
    status_lower = (lifecycle_status or "").lower()
    phase_lower = (menstrual_cycle_phase or "").lower()
    if "pregnant" in status_lower:
        enhancers.append("Pregnancy physiological upregulation context")
    elif "lactat" in status_lower:
        enhancers.append("Lactation physiological maintenance context")
    elif "menstrua" in phase_lower and "post" not in status_lower:
        enhancers.append("Elevated physiological demand context during active menstruation")

    # Clamp rate to biological boundaries (3% to 18% for non-heme; 15% to 35% for heme)
    if actual_type == "heme":
        rate = max(0.15, min(base_rate, 0.35))
    else:
        rate = max(0.03, min(base_rate, 0.18))

    estimated_absorbed = round(actual_iron * rate, 2)
    rate_percent = round(rate * 100.0, 1)

    # Dynamic target calculation
    if daily_target_mg is None:
        dynamic_info = calculate_dynamic_iron_target(
            profile={
                "age": age,
                "height": height,
                "weight": weight,
                "diet": diet,
                "intensity": intensity,
                "lifecycle_status": lifecycle_status,
            },
            cycle={"phase": menstrual_cycle_phase or "Follicular"}
        )
        effective_target = dynamic_info["modelled_dietary_target_mg"]
        absorbed_target_mg = dynamic_info["absorbed_target_mg"]
    else:
        effective_target = daily_target_mg
        absorbed_target_mg = round(effective_target * 0.08, 2)

    target_coverage_percent = round((actual_iron / effective_target) * 100.0, 1) if effective_target > 0 else 0
    absorbed_coverage_percent = round((estimated_absorbed / absorbed_target_mg) * 100.0, 1) if absorbed_target_mg > 0 else 0

    return {
        "food": nutrients["food_name"],
        "label": nutrients["food_name"],
        "portion_g": round(portion_grams, 1),
        "portion": round(portion_grams, 1),
        "iron_consumed_mg": round(actual_iron, 2),
        "iron": round(actual_iron, 2),
        "estimated_absorbed_iron_mg": estimated_absorbed,
        "absorbed": estimated_absorbed,
        "absorption_rate_percent": rate_percent,
        "rate": rate_percent,
        "daily_target_mg": effective_target,
        "target": effective_target,
        "absorbed_target_mg": absorbed_target_mg,
        "target_coverage_percent": target_coverage_percent,
        "absorbed_coverage_percent": absorbed_coverage_percent,
        "iron_type": actual_type,
        "enhancers": enhancers,
        "inhibitors": inhibitors,
        "vitamin_c_mg": round(actual_vit_c, 1),
        "calcium_mg": round(actual_ca, 1),
        "protein_g": nutrients["protein"],
        "energy_kcal": nutrients["energy"],
        "assumptions": (
            "Evidence-informed bioavailability model based on the 8% reference bioavailability assumption "
            "used by the ICMR-NIN framework and Hallberg-Hurrell principles. Evidence is limited or mixed "
            "regarding exact percentage shifts in composite meals, and further research is needed; "
            "modifiers are educational heuristics."
        ),
    }
