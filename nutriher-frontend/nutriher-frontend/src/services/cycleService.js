import { apiRequest } from "./api";

export function calculateDynamicTarget(profile = {}, cycle = {}) {
  const rawAge = profile.age;
  let userAge = 23;
  if (rawAge !== undefined && rawAge !== null && String(rawAge).trim() !== "") {
    const parsed = parseInt(rawAge, 10);
    if (!isNaN(parsed) && parsed > 0) userAge = parsed;
  }

  const phase = cycle.phase || "Luteal";
  const diet = String(profile.diet || "Vegetarian").trim().toLowerCase();
  const intensity = String(profile.intensity || "Moderate").trim().toLowerCase();
  const lifecycleStatus = String(
    profile.lifecycle_status || profile.lifecycleStatus || "Regular Cycle"
  ).trim().toLowerCase();

  const isPregnant = lifecycleStatus.includes("pregnant");
  const isLactating = lifecycleStatus.includes("lactat");
  const isPostMenopausal =
    lifecycleStatus.includes("post") || lifecycleStatus.includes("meno") || userAge >= 60;

  // 1. Age & Lifecycle Evaluation (ICMR-NIN 2020 RDA Framework)
  // [Category 1: DIRECTLY SUPPORTED BY AUTHORITATIVE LITERATURE]
  let ageCategory = "Adult Reproductive-Age Women (18–59 years)";
  let officialBaselineRda = 29.0;
  let earValue = 15.0;
  let ageEvaluationNote =
    `User age (${userAge}) evaluated: Adult Reproductive category (18–59 yrs). ` +
    `Official ICMR-NIN 2020 guideline specifies 29.0 mg/day baseline RDA (covering 97.5% of women at 8% absorption). ` +
    `The older ICMR 2010 recommendation was 21.0 mg/day.`;

  if (isPregnant) {
    ageCategory = "Pregnant Women";
    officialBaselineRda = 27.0; // Official ICMR-NIN 2020 Table 4.1 dietary RDA
    earValue = 21.0;
    ageEvaluationNote =
      `Lifecycle evaluated: Pregnant. Official ICMR-NIN 2020 dietary RDA is 27.0 mg/day ` +
      `(assuming 12% enhanced physiological absorption during pregnancy). ` +
      `Note: Prophylactic Iron-Folic Acid (IFA) clinical supplementation is standard public health protocol (MoHFW).`;
  } else if (isLactating) {
    ageCategory = "Lactating Women (0–12 months)";
    officialBaselineRda = 23.0; // Official ICMR-NIN 2020 Table 4.1 dietary RDA
    earValue = 16.0;
    ageEvaluationNote =
      `Lifecycle evaluated: Lactating (0–12 months). Official ICMR-NIN 2020 dietary RDA is 23.0 mg/day ` +
      `(reverts to baseline 8% dietary absorption assumption).`;
  } else if (isPostMenopausal) {
    ageCategory = "Post-Menopausal / Older Women (60+ years)";
    officialBaselineRda = 15.0; // Official ICMR-NIN 2020 Table 4.1 dietary RDA
    earValue = 11.0;
    ageEvaluationNote =
      `User profile evaluated: Post-Menopausal (age ${userAge}). ` +
      `Official ICMR-NIN 2020 RDA recommendation is 15.0 mg/day (reflects absence of menstrual blood loss).`;
  } else if (userAge < 13) {
    ageCategory = "Adolescent Girls (10–12 years)";
    officialBaselineRda = 16.0;
    earValue = 11.0;
    ageEvaluationNote =
      `User age (${userAge}) evaluated: Adolescent bracket (10–12 yrs). ` +
      `Official ICMR-NIN 2020 RDA recommendation is 16.0 mg/day.`;
  } else if (userAge <= 15) {
    ageCategory = "Adolescent Girls (13–15 years)";
    officialBaselineRda = 29.0;
    earValue = 16.5;
    ageEvaluationNote =
      `User age (${userAge}) evaluated: Adolescent bracket (13–15 yrs). ` +
      `Official ICMR-NIN 2020 RDA is 29.0 mg/day (peak growth velocity & menarche).`;
  } else if (userAge <= 17) {
    ageCategory = "Adolescent Girls (16–17 years)";
    officialBaselineRda = 26.0;
    earValue = 15.0;
    ageEvaluationNote =
      `User age (${userAge}) evaluated: Adolescent bracket (16–17 yrs). ` +
      `Official ICMR-NIN 2020 RDA recommendation is 26.0 mg/day.`;
  }

  // 2. Basal Obligatory Iron Loss
  // [Category 2: DERIVED MATHEMATICALLY FROM PUBLISHED PHYSIOLOGICAL DATA]
  const basalAbsorbedNeed = 0.80; // 0.014 mg/kg * 55 kg = 0.77 mg/day ≈ 0.80 mg/day
  const basalLossSource =
    "Standardized population reference value (0.80 mg/day) derived from published basal excretion rates " +
    "for a 55 kg reference woman (14 µg/kg/day × 55 kg = 0.77 mg/day ≈ 0.80 mg/day; Green et al., 1968; FAO/WHO, 2004). " +
    "This is a standardized reference benchmark, not an individualized measurement scaled by user body weight.";

  // 3. Menstrual Phase Need Increment
  // [Category 3: NUTRIHER PROJECT-LEVEL MODELLING ASSUMPTION]
  let flowMult = 1.00;
  let flowLabel = "Moderate flow (1.00x loss assumption)";
  let lossIncrement = 0.60;
  let phaseLabel = "Luteal (Pre-menstrual maintenance)";
  let totalModelledAbsorbedNeed = 1.40;
  let phaseIncrementSource =
    "Evidence supports the underlying biological relationship, " +
    "but the exact numerical value used by NutriHer is a project-level modelling assumption.";

  if (isPregnant || isLactating || isPostMenopausal) {
    lossIncrement = 0.0;
    if (isPregnant) {
      flowLabel = "Inactive (Amenorrhea during pregnancy)";
      phaseLabel = "Pregnancy (Maternal-fetal demand)";
      totalModelledAbsorbedNeed = 3.24; // 27.0 mg RDA * 12%
    } else if (isLactating) {
      flowLabel = "Inactive (Lactational amenorrhea/maintenance)";
      phaseLabel = "Lactation (Breast milk iron transfer)";
      totalModelledAbsorbedNeed = 1.84; // 23.0 mg RDA * 8%
    } else {
      flowLabel = "Inactive (Post-menopausal cessation of menses)";
      phaseLabel = "Post-Menopausal (Basal maintenance)";
      totalModelledAbsorbedNeed = 1.20; // 15.0 mg RDA * 8%
    }
    phaseIncrementSource =
      "Not applicable — menstrual loss replaced by lifecycle-specific physiological benchmark";
  } else {
    if (intensity.includes("heavy")) {
      flowMult = 1.35;
      flowLabel = "Heavy flow (1.35x loss assumption)";
    } else if (intensity.includes("light")) {
      flowMult = 0.75;
      flowLabel = "Light flow (0.75x loss assumption)";
    }

    if (phase === "Menstruation") {
      lossIncrement = 1.90 * flowMult;
      phaseLabel = "Active Menstruation (Elevated blood loss demand)";
    } else if (phase === "Follicular") {
      lossIncrement = 0.90 * flowMult;
      phaseLabel = "Follicular (Ferritin store recovery window)";
    } else if (phase === "Ovulation") {
      lossIncrement = 0.40;
      phaseLabel = "Ovulation (Mid-cycle maintenance)";
    }
    totalModelledAbsorbedNeed = +(basalAbsorbedNeed + lossIncrement).toFixed(2);
  }

  // 4. Dietary Bioavailability Efficiency
  // [Categories 1, 2, 3: Published Standard, Derived Tier & Model Heuristic]
  let bioavailabilityFactor = 0.08;
  let dietLabel = "Vegetarian (8.0% ICMR-NIN 2020 baseline assumption)";
  let bioavailabilitySource =
    "8% reference bioavailability assumption used by the ICMR-NIN framework for habitual Indian cereal-pulse diets (not an individual measurement of meal absorption).";

  if (isPregnant) {
    bioavailabilityFactor = 0.12; // ICMR-NIN 2020 explicitly assumes 12% in pregnancy
    dietLabel = "Pregnancy Adjusted (12.0% ICMR-NIN 2020 physiological absorption standard)";
    bioavailabilitySource =
      "Directly supported by ICMR-NIN 2020 pregnancy absorption standard (12%)";
  } else if (diet.includes("vegan")) {
    bioavailabilityFactor = 0.08;
    dietLabel = "Vegan (~8% non-heme bioavailability assumption)";
    bioavailabilitySource =
      "Evidence supports low plant bioavailability (5%–10%); the exact 8.0% value is a NutriHer modelling assumption.";
  } else if (diet.includes("non") || diet.includes("meat") || diet.includes("omnivore")) {
    bioavailabilityFactor = 0.14;
    dietLabel = "Non-Vegetarian (~14% mixed bioavailability reference tier)";
    bioavailabilitySource =
      "Evidence-informed reference bioavailability tier (14.0%) derived from the FAO/WHO (2004) Chapter 13 framework (12%–15% tier for diets containing meat/fish/poultry; not an individual biological measurement).";
  } else if (diet.includes("egg")) {
    bioavailabilityFactor = 0.10;
    dietLabel = "Eggetarian (~10% bioavailability assumption)";
    bioavailabilitySource = "NutriHer modelling assumption for egg-supplemented plant diet";
  }

  // 5. Final Modelled Daily Dietary Iron Target (mg/day)
  // [Category 2: DERIVED MATHEMATICALLY FROM PUBLISHED DATA]
  const modelledDietaryTarget = +(totalModelledAbsorbedNeed / bioavailabilityFactor).toFixed(1);

  return {
    userAge,
    ageCategory,
    lifecycleStatus: lifecycleStatus.replace(/\b\w/g, (c) => c.toUpperCase()),
    officialBaselineRda,
    official_baseline_rda_mg: officialBaselineRda,
    officialEarMg: earValue,
    icmr_2010_historical_rda_mg: 21.0,
    icmr_2020_current_rda_mg: officialBaselineRda,
    ageEvaluationNote,
    basalAbsorbedNeed,
    basalLossSource,
    phaseLossIncrement: +lossIncrement.toFixed(2),
    phaseIncrementSource,
    phaseLabel,
    flowIntensity: flowLabel,
    totalModelledAbsorbedNeed,
    dietLabel,
    bioavailabilityPct: +(bioavailabilityFactor * 100).toFixed(0),
    bioavailabilitySource,
    modelledDietaryTarget,
    dietaryTargetMg: modelledDietaryTarget,
    target: modelledDietaryTarget,
    dietary_target_mg: modelledDietaryTarget,
    absorbedTargetMg: totalModelledAbsorbedNeed,
    absorbed_target_mg: totalModelledAbsorbedNeed,
    baselineRdaMg: officialBaselineRda,
    formula: `Modelled Target (${modelledDietaryTarget} mg/day) = Modelled Absorbed Need (${totalModelledAbsorbedNeed} mg) ÷ Assumed Bioavailability (${(bioavailabilityFactor * 100).toFixed(0)}%)`,
    metricName: "Context-Aware Modelled Reference Target (Modelled Daily Dietary Target)",
    cycleModelNote:
      "The 28-day model averages ~21.2 mg/day for a typical woman with moderate flow " +
      "(between the 15 mg EAR and 29 mg RDA) and scales dynamically with flow intensity. " +
      "The 29.0 mg/day RDA represents the 97.5th percentile population coverage benchmark.",
    disclaimer:
      "NutriHer's personalized target is an educational reference model based on published population recommendations (ICMR-NIN 2020) and project-level modelling assumptions. It is not a clinical measurement or individualized medical prescription.",
  };
}

export function getCycleData(lastPeriodISO, cycleLength = 28) {
  const last = new Date(lastPeriodISO || new Date());
  const today = new Date();
  const diffDays = Math.max(0, Math.floor((today - last) / 86400000)) % (cycleLength || 28);
  const day = diffDays + 1;

  let phase = "Follicular";
  if (day <= 5) phase = "Menstruation";
  else if (day <= 13) phase = "Follicular";
  else if (day <= 16) phase = "Ovulation";
  else phase = "Luteal";

  const daysUntilNext = (cycleLength || 28) - day + 1;
  return { day, phase, daysUntilNext, cycleLength: cycleLength || 28 };
}

export async function fetchCycleData(lastPeriodISO, cycleLength = 28, periodLength = 5, profile = {}) {
  try {
    const lStatus = profile.lifecycle_status || profile.lifecycleStatus || "Regular Cycle";
    const data = await apiRequest(
      `/cycle?lastPeriod=${encodeURIComponent(lastPeriodISO)}&cycleLength=${cycleLength}&periodLength=${periodLength}&age=${profile.age || 23}&diet=${encodeURIComponent(profile.diet || "Vegetarian")}&intensity=${encodeURIComponent(profile.intensity || "Moderate")}&lifecycle_status=${encodeURIComponent(lStatus)}`
    );
    return data;
  } catch (err) {
    console.warn("[NutriHer] /cycle API fallback to local calculation:", err);
    const localCycle = getCycleData(lastPeriodISO, cycleLength);
    return {
      ...localCycle,
      dynamic_target: calculateDynamicTarget(profile, localCycle),
    };
  }
}
