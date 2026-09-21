"""
NutriHer Menstrual Cycle Tracker & Dynamic Iron Reference Target Module
========================================================================
Calculates menstrual cycle metrics, current cycle phase, and provides
a dynamic, context-aware daily dietary iron target based on:
1. User age & published ICMR-NIN 2020 Reference Lifecycle Category
2. Menstrual cycle phase & active blood loss vs recovery replenishment
3. Special lifecycle modes: Pregnancy, Lactation, Post-Menopausal
4. Dietary pattern bioavailability efficiency (Vegetarian vs Mixed)

FIVE-CATEGORY SCIENTIFIC CLASSIFICATION AUDIT:
----------------------------------------------
1. DIRECTLY SUPPORTED BY AUTHORITATIVE LITERATURE:
   * ICMR-NIN 2020 Adult Female RDA: 29.0 mg/day (19–59 yrs, 55 kg, non-pregnant non-lactating).
     [Source: ICMR-NIN 2020 Report, Table 4.1; EAR = 15.0 mg/day]
     Note: 21.0 mg/day was the historical ICMR 2010 RDA.
   * ICMR-NIN 2020 Adolescent RDAs: 10–12 yrs (16.0 mg/day), 13–15 yrs (29.0 mg/day), 16–17 yrs (26.0 mg/day).
   * ICMR-NIN 2020 Pregnancy Dietary RDA: 27.0 mg/day (assumed 12% bioavailability; prophylactic IFA advised).
   * ICMR-NIN 2020 Lactation Dietary RDA: 23.0 mg/day (0–12 months).
   * ICMR-NIN 2020 Post-Menopausal RDA (60+ yrs): 15.0 mg/day (cessation of menses).
   * 8.0% Bioavailability Baseline: Standard ICMR-NIN 2020 assumption for Indian cereal-pulse diets.
   * Basal Iron Excretion Rate: ~14 µg/kg/day (Green et al., 1968; FAO/WHO, 2004).

2. MATHEMATICALLY DERIVED FROM PUBLISHED DATA:
   * Basal Obligatory Iron Loss (0.80 mg/day):
     0.014 mg/kg/day × 55 kg reference woman = 0.77 mg/day ≈ 0.80 mg/day.
   * Menstrual Blood Loss Iron Mass:
     30–40 mL survey blood loss (Hallberg et al., 1966) converted via hemoglobin iron stoichiometry
     (~0.45–0.50 mg Fe/mL blood) = ~13.5–20.0 mg elemental iron.
   * Dietary Conversion Formula: Dietary Target = Absorbed Need ÷ Bioavailability Efficiency.
   * 14.0% Mixed Diet Bioavailability: Sourced to FAO/WHO (2004) Chapter 13 tier for diets with meat factor.
   * Heme Baseline (25%): Median of published biological range (20%–30%; Hallberg & Hurrell 2002).

3. NUTRIHER PROJECT-LEVEL MODELLING ASSUMPTION:
   * Phase-Specific Need Increments: Menstruation (+1.90 mg/day), Follicular (+0.90 mg/day),
     Ovulation (+0.40 mg/day), Luteal (+0.60 mg/day). Evidence supports the underlying biological
     relationship, but the exact numerical value used by NutriHer is a project-level modelling assumption.
   * Flow Multipliers: Heavy (1.35x), Moderate (1.00x), Light (0.75x).
   * Vegan Bioavailability Point: 8.0% point selection within WHO 5%–10% range.
   * 28-Day Cycle Integration: NutriHer's cycle model averages ~21.2 mg/day for typical moderate flow
     (between the 15 mg EAR and 29 mg RDA), scaling dynamically with flow intensity. The 29.0 mg RDA
     serves as the 97.5th percentile population coverage benchmark.

4. EVIDENCE LIMITED / UNCERTAIN — FURTHER RESEARCH NEEDED:
   * Vitamin C (+2%/+5%) and Calcium (-2%) Absorption Modulators:
     Evidence is limited or mixed regarding exact percentage shifts in composite meals, and further
     research is needed; NutriHer uses +2% / +5% and -2% as educational heuristics.

5. UI / ENGINEERING CHOICE:
   * Calendar-based phase estimation, interactive flow toggles, Top-5 candidate exposure, portion sliders.
"""

from datetime import datetime, date
from typing import Dict, Any, Optional


def calculate_cycle_phase(
    last_period_date: str,
    cycle_length: int = 28,
    period_length: int = 5,
    age: Optional[int] = 23,
) -> Dict[str, Any]:
    """Compute current cycle day, phase, and nutritional context."""
    cycle_length = max(20, min(cycle_length or 28, 45))
    period_length = max(2, min(period_length or 5, 10))

    try:
        if isinstance(last_period_date, str):
            clean_date = last_period_date.split("T")[0]
            last_date = datetime.strptime(clean_date, "%Y-%m-%d").date()
        else:
            last_date = date.today()
    except Exception:
        last_date = date.today()

    today = date.today()
    diff_days = (today - last_date).days
    if diff_days < 0:
        diff_days = 0

    current_day = (diff_days % cycle_length) + 1
    days_until_next = cycle_length - current_day + 1

    if current_day <= period_length:
        phase = "Menstruation"
        phase_desc = "Active menstrual bleeding phase."
        iron_relevance = (
            "Daily physiological iron loss is elevated due to menstrual bleeding "
            "(~15–35 mg elemental iron total per cycle). Pairing iron-rich meals with ascorbic acid (Vitamin C) is beneficial."
        )
        is_menstruating = True
    elif current_day <= 13:
        phase = "Follicular"
        phase_desc = "Follicular phase — estrogen rises as ovarian follicles mature."
        iron_relevance = (
            "Post-menstrual recovery window: replenishing ferritin iron reserves drawn down during menstruation."
        )
        is_menstruating = False
    elif current_day <= 16:
        phase = "Ovulation"
        phase_desc = "Mid-cycle ovulation phase — peak LH and estrogen."
        iron_relevance = (
            "Baseline maintenance phase with steady micronutrient requirements."
        )
        is_menstruating = False
    else:
        phase = "Luteal"
        phase_desc = "Luteal phase — progesterone dominates; preparing for the next cycle."
        iron_relevance = (
            "Pre-menstrual maintenance phase: sustaining steady dietary iron intake supports energy stability."
        )
        is_menstruating = False

    return {
        "day": current_day,
        "phase": phase,
        "daysUntilNext": days_until_next,
        "days_until_next": days_until_next,
        "cycleLength": cycle_length,
        "cycle_length": cycle_length,
        "period_length": period_length,
        "phase_description": phase_desc,
        "iron_relevance": iron_relevance,
        "is_menstruating": is_menstruating,
        "disclaimer": "Informational tracking based on calendar arithmetic; not a clinical diagnostic tool.",
    }


def calculate_dynamic_iron_target(
    profile: Optional[Dict[str, Any]] = None,
    cycle: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    """
    Dynamically compute the Context-Aware Modelled Reference Iron Target through a 5-step pipeline:
    1. Lifecycle Status & Age Evaluation -> Official Published Baseline RDA (ICMR-NIN 2020)
       [Category 1: Directly Supported by Authoritative Literature]
    2. Obligatory Basal Iron Loss (0.80 mg/day, derived from Green et al. 14 µg/kg/day * 55 kg)
       [Category 2: Derived Mathematically from Published Physiological Data]
    3. Contextual Need Increment (NutriHer Modelling Assumption based on blood-loss literature)
       [Category 3: NutriHer Project-Level Modelling Assumption]
    4. Dietary Bioavailability Efficiency (ICMR-NIN 2020 8% / Pregnancy 12% / WHO 14% mixed reference)
       [Category 1 / 2: Published Standard & Evidence-Informed Interpolation]
    5. Final Modelled Daily Dietary Iron Target = Absorbed Need ÷ Bioavailability
       [Category 2: Derived Mathematically from Mass-Balance Bioavailability Principles]
    """
    profile = profile or {}
    cycle = cycle or {}

    raw_age = profile.get("age", 23)
    try:
        user_age = int(raw_age) if raw_age is not None and str(raw_age).strip() != "" else 23
        user_age = max(10, min(user_age, 100))
    except (ValueError, TypeError):
        user_age = 23

    phase = cycle.get("phase", "Luteal")
    diet = str(profile.get("diet", "Vegetarian")).strip().lower()
    intensity = str(profile.get("intensity", "Moderate")).strip().lower()
    lifecycle_status = str(
        profile.get("lifecycle_status") or profile.get("lifecycleStatus") or "Regular Cycle"
    ).strip().lower()

    # -------------------------------------------------------------------------
    # STEP 1: Lifecycle Status & Age Evaluation (ICMR-NIN 2020 RDA Framework)
    # [Category 1: DIRECTLY SUPPORTED BY AUTHORITATIVE LITERATURE]
    # -------------------------------------------------------------------------
    is_pregnant = "pregnant" in lifecycle_status
    is_lactating = "lactat" in lifecycle_status
    is_post_menopausal = "post" in lifecycle_status or "meno" in lifecycle_status or user_age >= 60

    if is_pregnant:
        age_category = "Pregnant Women"
        official_baseline_rda = 27.0  # Official ICMR-NIN 2020 Table 4.1 dietary RDA
        ear_value = 21.0
        age_evaluation_note = (
            "Lifecycle evaluated: Pregnant. Official ICMR-NIN 2020 dietary RDA recommendation is 27.0 mg/day "
            "(assuming 12% enhanced physiological absorption during pregnancy). "
            "Note: Prophylactic Iron-Folic Acid (IFA) clinical supplementation is standard public health protocol (MoHFW)."
        )
    elif is_lactating:
        age_category = "Lactating Women (0–12 months)"
        official_baseline_rda = 23.0  # Official ICMR-NIN 2020 Table 4.1 dietary RDA
        ear_value = 16.0
        age_evaluation_note = (
            "Lifecycle evaluated: Lactating (0–12 months). Official ICMR-NIN 2020 dietary RDA is 23.0 mg/day "
            "(reverts to baseline 8% dietary absorption assumption)."
        )
    elif is_post_menopausal:
        age_category = "Post-Menopausal / Older Women (60+ years)"
        official_baseline_rda = 15.0  # Official ICMR-NIN 2020 Table 4.1 dietary RDA
        ear_value = 11.0
        age_evaluation_note = (
            f"User profile evaluated: Post-Menopausal (age {user_age}). "
            "Official ICMR-NIN 2020 RDA recommendation is 15.0 mg/day (reflects absence of menstrual blood loss)."
        )
    elif user_age < 13:
        age_category = "Adolescent Girls (10–12 years)"
        official_baseline_rda = 16.0  # Official ICMR-NIN 2020 Table 4.1
        ear_value = 11.0
        age_evaluation_note = (
            f"User age ({user_age}) evaluated: Adolescent bracket (10–12 yrs). "
            "Official ICMR-NIN 2020 RDA recommendation is 16.0 mg/day."
        )
    elif user_age <= 15:
        age_category = "Adolescent Girls (13–15 years)"
        official_baseline_rda = 29.0  # Official ICMR-NIN 2020 Table 4.1
        ear_value = 16.5
        age_evaluation_note = (
            f"User age ({user_age}) evaluated: Adolescent bracket (13–15 yrs). "
            "Official ICMR-NIN 2020 RDA recommendation is 29.0 mg/day (peak adolescent growth velocity & menarche)."
        )
    elif user_age <= 17:
        age_category = "Adolescent Girls (16–17 years)"
        official_baseline_rda = 26.0  # Official ICMR-NIN 2020 Table 4.1
        ear_value = 15.0
        age_evaluation_note = (
            f"User age ({user_age}) evaluated: Adolescent bracket (16–17 yrs). "
            "Official ICMR-NIN 2020 RDA recommendation is 26.0 mg/day."
        )
    else:
        age_category = "Adult Reproductive-Age Women (18–59 years)"
        official_baseline_rda = 29.0  # Official ICMR-NIN 2020 Table 4.1
        ear_value = 15.0
        age_evaluation_note = (
            f"User age ({user_age}) evaluated: Adult Reproductive category (18–59 yrs). "
            "Official ICMR-NIN 2020 guideline provides a published baseline RDA of 29.0 mg/day (covering 97.5% of women at 8% absorption). "
            "The older ICMR 2010 recommendation was 21.0 mg/day."
        )

    # -------------------------------------------------------------------------
    # STEP 2: Basal Obligatory Iron Loss
    # [Category 2: DERIVED MATHEMATICALLY FROM PUBLISHED PHYSIOLOGICAL DATA]
    # -------------------------------------------------------------------------
    # Green et al. 1968 & FAO/WHO 2004: 14 µg/kg/day * 55 kg reference woman = 0.77 mg/day ≈ 0.80 mg/day
    basal_absorbed_need = 0.80
    basal_loss_source = (
        "Standardized population reference value (0.80 mg/day) derived from published basal excretion rates "
        "for a 55 kg reference woman (14 µg/kg/day × 55 kg = 0.77 mg/day ≈ 0.80 mg/day; Green et al., 1968; FAO/WHO, 2004). "
        "This is a standardized reference benchmark, not an individualized measurement scaled by user body weight."
    )

    # -------------------------------------------------------------------------
    # STEP 3: Menstrual Phase Need Increment
    # [Category 3: NUTRIHER PROJECT-LEVEL MODELLING ASSUMPTION]
    # -------------------------------------------------------------------------
    if is_pregnant or is_lactating or is_post_menopausal:
        loss_increment = 0.0
        flow_mult = 1.00
        if is_pregnant:
            flow_label = "Inactive (Amenorrhea during pregnancy)"
            phase_label = "Pregnancy (Maternal-fetal demand)"
            # Maternal-fetal absorbed demand: 27.0 mg RDA * 12% = 3.24 mg/day absorbed
            total_modelled_absorbed_need = 3.24
        elif is_lactating:
            flow_label = "Inactive (Lactational amenorrhea/maintenance)"
            phase_label = "Lactation (Breast milk iron transfer)"
            # Lactation absorbed demand: 23.0 mg RDA * 8% = 1.84 mg/day absorbed
            total_modelled_absorbed_need = 1.84
        else:
            flow_label = "Inactive (Post-menopausal cessation of menses)"
            phase_label = "Post-Menopausal (Basal maintenance)"
            # Post-menopausal absorbed need: 15.0 mg RDA * 8% = 1.20 mg/day absorbed
            total_modelled_absorbed_need = 1.20
        phase_increment_source = "Not applicable — menstrual loss replaced by lifecycle-specific physiological benchmark"
    else:
        if "heavy" in intensity:
            flow_mult = 1.35
            flow_label = "Heavy flow (1.35x loss assumption)"
        elif "light" in intensity:
            flow_mult = 0.75
            flow_label = "Light flow (0.75x loss assumption)"
        else:
            flow_mult = 1.00
            flow_label = "Moderate flow (1.00x loss assumption)"

        if phase == "Menstruation":
            loss_increment = 1.90 * flow_mult
            phase_label = "Active Menstruation (Elevated blood loss demand)"
        elif phase == "Follicular":
            loss_increment = 0.90 * flow_mult
            phase_label = "Follicular (Ferritin store recovery window)"
        elif phase == "Ovulation":
            loss_increment = 0.40
            phase_label = "Ovulation (Mid-cycle maintenance)"
        else:  # Luteal
            loss_increment = 0.60
            phase_label = "Luteal (Pre-menstrual maintenance)"

        phase_increment_source = (
            "Evidence supports the underlying biological relationship, "
            "but the exact numerical value used by NutriHer is a project-level modelling assumption."
        )
        total_modelled_absorbed_need = round(basal_absorbed_need + loss_increment, 2)

    # -------------------------------------------------------------------------
    # STEP 4: Dietary Bioavailability Efficiency
    # [Categories 1, 2, 3: Published Standard, Derived Tier & Model Heuristic]
    # -------------------------------------------------------------------------
    if is_pregnant:
        bioavailability_factor = 0.12  # ICMR-NIN 2020 explicitly assumes 12% in pregnancy
        diet_label = "Pregnancy Adjusted (12.0% ICMR-NIN 2020 physiological absorption standard)"
        bioavailability_source = "Directly supported by ICMR-NIN 2020 pregnancy absorption standard (12%)"
    elif "vegan" in diet:
        bioavailability_factor = 0.08
        diet_label = "Vegan (~8% non-heme bioavailability assumption)"
        bioavailability_source = (
            "Evidence supports low plant bioavailability (5%–10%); "
            "the exact 8.0% value is a NutriHer modelling assumption."
        )
    elif "non" in diet or "meat" in diet or "omnivore" in diet:
        bioavailability_factor = 0.14
        diet_label = "Non-Vegetarian (~14% mixed bioavailability reference tier)"
        bioavailability_source = (
            "Evidence-informed reference bioavailability tier (14.0%) derived from the FAO/WHO (2004) "
            "Chapter 13 framework (12%–15% tier for diets containing meat/fish/poultry; "
            "not an individual biological measurement)."
        )
    elif "egg" in diet:
        bioavailability_factor = 0.10
        diet_label = "Eggetarian (~10% bioavailability assumption)"
        bioavailability_source = "NutriHer modelling assumption for egg-supplemented plant diet"
    else:  # vegetarian (standard Indian diet)
        bioavailability_factor = 0.08  # ICMR-NIN 2020 official baseline is 8%
        diet_label = "Vegetarian (8.0% ICMR-NIN 2020 baseline assumption)"
        bioavailability_source = (
            "8% reference bioavailability assumption used by the ICMR-NIN framework "
            "for habitual Indian cereal-pulse diets (not an individual measurement of meal absorption)."
        )

    # Optional custom bioavailability override (accepts either percentage like 8 or decimal like 0.08)
    custom_bio = profile.get("bioavailability_factor") or profile.get("bioavailability_pct") or profile.get("bioavailability")
    if custom_bio is not None and not is_pregnant:
        try:
            val = float(custom_bio)
            if val > 1.0:
                val = val / 100.0
            if 0.01 <= val <= 0.50:
                bioavailability_factor = val
                diet_label = f"Custom Bioavailability ({round(bioavailability_factor * 100, 1)}%)"
                bioavailability_source = f"User-specified reference bioavailability ({round(bioavailability_factor * 100, 1)}%)"
        except (ValueError, TypeError):
            pass

    # -------------------------------------------------------------------------
    # STEP 5: Final Modelled Dietary Iron Target (mg/day)
    # [Category 2: DERIVED MATHEMATICALLY FROM PUBLISHED DATA]
    # -------------------------------------------------------------------------
    modelled_dietary_target = round(total_modelled_absorbed_need / bioavailability_factor, 1)

    return {
        "user_age": user_age,
        "age_category": age_category,
        "lifecycle_status": lifecycle_status.title(),
        "official_baseline_rda_mg": official_baseline_rda,
        "official_ear_mg": ear_value,
        "icmr_2010_historical_rda_mg": 21.0,
        "icmr_2020_current_rda_mg": official_baseline_rda,
        "age_evaluation_note": age_evaluation_note,
        "basal_absorbed_need_mg": basal_absorbed_need,
        "basal_loss_source": basal_loss_source,
        "phase_loss_increment_mg": round(loss_increment, 2),
        "phase_increment_source": phase_increment_source,
        "phase_label": phase_label,
        "flow_intensity": flow_label,
        "total_modelled_absorbed_need_mg": total_modelled_absorbed_need,
        "diet_label": diet_label,
        "bioavailability_pct": round(bioavailability_factor * 100, 1),
        "bioavailability_source": bioavailability_source,
        "modelled_dietary_target_mg": modelled_dietary_target,
        "dietary_target_mg": modelled_dietary_target,
        "target": modelled_dietary_target,
        "dietaryTargetMg": modelled_dietary_target,
        "absorbed_target_mg": total_modelled_absorbed_need,
        "absorbedTargetMg": total_modelled_absorbed_need,
        "baseline_rda_mg": official_baseline_rda,
        "formula": (
            f"Modelled Target ({modelled_dietary_target} mg/day) = "
            f"Modelled Absorbed Need ({total_modelled_absorbed_need:.2f} mg) ÷ "
            f"Assumed Bioavailability ({bioavailability_factor * 100:.0f}%)"
        ),
        "metric_name": "Context-Aware Modelled Reference Target (Modelled Daily Dietary Target)",
        "cycle_model_note": (
            "The 28-day model averages ~21.2 mg/day for a typical woman with moderate flow "
            "(between the 15 mg EAR and 29 mg RDA) and scales dynamically with flow intensity. "
            "The 29.0 mg/day RDA represents the 97.5th percentile population coverage benchmark."
        ),
        "disclaimer": (
            "NutriHer's personalized target is an educational reference model based on published population "
            "recommendations (ICMR-NIN 2020) and project-level modelling assumptions. "
            "It is not a clinical measurement or individualized medical prescription."
        ),
    }
