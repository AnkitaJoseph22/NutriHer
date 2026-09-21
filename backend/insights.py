"""
NutriHer Personalized Nutritional Insights Engine
=================================================
Generates context-aware, non-diagnostic nutritional suggestions combining:
- Food intake and estimated absorbed iron
- Menstrual cycle phase & cycle day
- User profile (age, diet, symptoms)
- Dynamic cycle-adjusted dietary target

Academic Transparency Note:
- Suggestions are purely educational and non-diagnostic.
- Avoids any diagnostic language (never states 'you have anemia').
"""

from typing import Dict, Any, List, Optional
from .cycle import calculate_dynamic_iron_target


def generate_personalized_insights(
    profile: Optional[Dict[str, Any]] = None,
    cycle: Optional[Dict[str, Any]] = None,
    food_name: Optional[str] = "Pongal",
    dietary_iron: float = 2.7,
    absorbed_iron: float = 0.27,
    target: Optional[float] = None,
    symptoms: Optional[List[str]] = None,
) -> Dict[str, str]:
    """
    Generate structured personalized nutritional insights.
    """
    profile = profile or {}
    cycle = cycle or {}

    name = profile.get("name", "there") or "there"
    age = profile.get("age", 23)
    diet = profile.get("diet", "Vegetarian")
    active_symptoms = symptoms or profile.get("symptoms", [])

    cycle_day = cycle.get("day", 18)
    cycle_phase = cycle.get("phase", "Luteal")

    if target is None:
        dynamic_info = calculate_dynamic_iron_target(profile, cycle)
        effective_target = dynamic_info["dietary_target_mg"]
    else:
        effective_target = target

    gap = round(effective_target - dietary_iron, 1)

    # 1. Iron sentence
    iron_text = f"Your logged meal provided {dietary_iron:.1f} mg of dietary iron today."

    # 2. Absorption sentence
    abs_text = (
        f"Based on meal composition, an estimated {absorbed_iron:.2f} mg may be absorbed "
        "— this is a nutritional estimate, not a clinical measurement."
    )

    # 3. Cycle sentence
    if cycle_phase == "Menstruation":
        phase_note = "Iron needs are highest during and right after your period due to active blood loss."
    elif cycle_phase == "Follicular":
        phase_note = "A prime window for rebuilding iron stores and sustaining daily energy levels."
    elif cycle_phase == "Ovulation":
        phase_note = "Your cycle carries moderate baseline maintenance iron requirements."
    else:  # Luteal
        phase_note = "In the luteal phase, fatigue can be more noticeable — maintaining steady iron intake supports metabolic stability."

    cycle_text = f"You're on day {cycle_day} of your cycle — {cycle_phase.lower()} phase. {phase_note}"

    # 4. Contextual suggestion
    suggestion_parts = []
    if gap > 0:
        suggestion_parts.append(
            f"You are about {gap:.1f} mg away from your personalized cycle-adjusted daily target ({effective_target:.1f} mg/day)."
        )
    else:
        suggestion_parts.append(f"You have reached your personalized daily iron target ({effective_target:.1f} mg/day) for today. Great work, {name}!")

    if diet.lower() == "vegetarian":
        suggestion_parts.append(
            "Since your diet is primarily plant-based, pairing non-heme iron sources with vitamin-C-rich foods "
            "(such as lemon juice, amla, tomatoes, or bell peppers) can substantially enhance bioavailability."
        )

    if active_symptoms:
        symptom_list_str = ", ".join(active_symptoms)
        suggestion_parts.append(
            f"You noted experiencing {symptom_list_str.lower()}. "
            "Staying well-hydrated and spacing tea or coffee at least one hour away from meals "
            "prevents polyphenols and tannins from inhibiting iron absorption."
        )
    else:
        suggestion_parts.append(
            "To maximize absorption efficiency, try avoiding caffeinated beverages directly with or immediately after meals."
        )

    suggestion_text = " ".join(suggestion_parts)

    return {
        "iron": iron_text,
        "absorption": abs_text,
        "cycle": cycle_text,
        "suggestion": suggestion_text,
        "disclaimer": (
            "NutriHer provides educational nutritional estimations. "
            "It is not intended to diagnose anemia or replace clinical advice."
        ),
    }
