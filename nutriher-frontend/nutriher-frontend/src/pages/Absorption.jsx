import React, { useState } from "react";
import { Info, ChevronRight, Calculator, BookOpen, ChevronDown, ChevronUp, UserCheck, ShieldCheck, Sparkles, Layers, BookMarked, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { C, FONT_HEAD } from "../styles/tokens";
import { Card, Eyebrow, H, Body } from "../components/ui";
import { PastelBadge, BotanicalBranch, CherryBlossomPetal } from "../components/Decorations";

const FlowStep = ({ label, value, sublabel, color, bg, badge }) => (
  <div
    className="w-full max-w-sm rounded-3xl p-5 text-center transition-all duration-300 hover:scale-[1.02] shadow-sm relative overflow-hidden"
    style={{ background: bg, border: `1.5px solid ${color}55` }}
  >
    {badge && (
      <div className="absolute top-3 right-3">
        <PastelBadge variant="butter">{badge}</PastelBadge>
      </div>
    )}
    <div className="text-xs font-semibold mb-1" style={{ color: C.plumSoft }}>
      {label}
    </div>
    <div style={{ fontFamily: FONT_HEAD, fontSize: 26, fontWeight: 700, color }}>{value}</div>
    {sublabel && (
      <div className="text-[11px] mt-1 font-medium" style={{ color: C.plumMuted }}>
        {sublabel}
      </div>
    )}
  </div>
);

const ArrowDown = () => <ChevronRight size={20} className="rotate-90 my-1 text-plumSoft/40" />;

export default function AbsorptionScreen({ todaysLog, target, dynamicTargetInfo, profile = {}, cycle = {} }) {
  const [showTargetDetails, setShowTargetDetails] = useState(true);
  const [showAbsorptionDetails, setShowAbsorptionDetails] = useState(true);
  const [showConstantsTable, setShowConstantsTable] = useState(true);
  const [showLiteratureReview, setShowLiteratureReview] = useState(false);

  const dietaryIron = todaysLog.reduce((sum, m) => sum + (m.iron || 0), 0);
  const absorbedIron = todaysLog.reduce((sum, m) => sum + (m.absorbed || 0), 0);
  const lastMeal = todaysLog[todaysLog.length - 1];

  const mealIron = lastMeal?.iron || dietaryIron || 2.70;
  const mealAbsorbed = lastMeal?.absorbed || absorbedIron || 0.22;
  const absorptionRate = lastMeal?.rate || (mealIron > 0 ? ((mealAbsorbed / mealIron) * 100).toFixed(1) : 8.0);
  const ironType = lastMeal?.ironType || "non-heme";
  const mealLabel = lastMeal?.label || "Pongal (Demo Meal)";
  const mealPortion = lastMeal?.portion || 150;

  const dyn = dynamicTargetInfo || {
    userAge: profile.age || 23,
    ageCategory: "Adult Reproductive-Age Women (18–59 years)",
    officialBaselineRda: 29.0,
    icmr_2010_historical_rda_mg: 21.0,
    ageEvaluationNote: "Evaluated: Adult reproductive age group. Official ICMR-NIN 2020 guideline specifies 29.0 mg/day baseline RDA (assuming 8% absorption) for Indian women of reproductive age. (The older ICMR 2010 recommendation was 21.0 mg/day).",
    basalAbsorbedNeed: 0.80,
    phaseLossIncrement: 0.60,
    totalModelledAbsorbedNeed: 1.40,
    phaseLabel: `${cycle.phase || "Luteal"} Phase (Pre-menstrual maintenance)`,
    flowIntensity: profile.intensity || "Moderate flow (1.00x loss assumption)",
    dietLabel: `${profile.diet || "Vegetarian"} (8.0% ICMR-NIN 2020 baseline bioavailability)`,
    bioavailabilityPct: 8,
    modelledDietaryTarget: target || 17.5,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <PastelBadge variant="lavender">
            <Sparkles size={12} color={C.lavenderDeep} />
            <span>Bioavailability Science</span>
          </PastelBadge>
          <PastelBadge variant="blush">Dynamic Requirement</PastelBadge>
        </div>
        <H size="text-3xl">Personalized Iron Analysis</H>
        <Body className="text-sm mt-1">
          NutriHer transparently separates dietary intake, bioavailable absorption, and context-aware reference targets.
        </Body>
      </div>

      {/* 3-Step Visual Narrative Journey */}
      <Card hover>
        <div className="flex flex-col items-center">
          <FlowStep
            label="1. Total Dietary Iron Consumed"
            value={`${dietaryIron.toFixed(2)} mg`}
            sublabel={`${todaysLog.length || 1} meal(s) logged today`}
            color={C.blushDeep}
            bg={C.blushLight}
            badge="Intake"
          />
          <ArrowDown />
          <FlowStep
            label="2. Estimated Absorbed Iron"
            value={`${absorbedIron.toFixed(2)} mg`}
            sublabel={`Calculated via ~${absorptionRate}% estimated meal bioavailability`}
            color={C.lavenderDeep}
            bg={C.lavenderLight}
            badge="Absorbed"
          />
          <ArrowDown />
          <FlowStep
            label="3. Context-Aware Modelled Reference Target"
            value={`${dyn.modelledDietaryTarget || dyn.dietaryTargetMg} mg/day`}
            sublabel={`${cycle.phase || "Luteal"} Phase · Age ${dyn.userAge || 23} · ${dyn.totalModelledAbsorbedNeed || dyn.absorbedTargetMg} mg absorbed need`}
            color={C.sageDeep}
            bg={C.sageLight}
            badge="Modelled Target"
          />
        </div>
      </Card>

      {/* CARD 1: Personalized Reference Target Derivation */}
      <Card hover>
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setShowTargetDetails(!showTargetDetails)}
        >
          <div className="flex items-center gap-2">
            <UserCheck size={18} color={C.sageDeep} />
            <Eyebrow color={C.sageDeep}>Personalized Target Derivation & Pipeline</Eyebrow>
          </div>
          <button type="button" style={{ color: C.plumMuted }}>
            {showTargetDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>

        {showTargetDetails && (
          <div className="mt-4 space-y-3 pt-3 border-t text-xs md:text-sm" style={{ borderColor: C.line }}>
            {/* Step 1: Age Evaluation */}
            <div className="flex flex-col sm:flex-row justify-between py-2 border-b gap-1" style={{ borderColor: C.line }}>
              <div>
                <span className="font-semibold" style={{ color: C.plum }}>1. Age Evaluation & Lifecycle Group</span>
                <span className="block text-[10px] text-emerald-700 font-medium">Category 1: Directly Supported by Published Literature</span>
              </div>
              <div className="text-right">
                <span className="font-bold" style={{ color: C.plum }}>Age {dyn.userAge || 23}</span>
                <span className="block text-[11px]" style={{ color: C.plumMuted }}>{dyn.ageCategory}</span>
              </div>
            </div>

            {/* Official Baseline RDA */}
            <div className="flex justify-between py-2 border-b" style={{ borderColor: C.line }}>
              <div>
                <span style={{ color: C.plumSoft }}>Official Baseline RDA (ICMR-NIN 2020)</span>
                <span className="block text-[10px]" style={{ color: C.plumMuted }}>
                  *Historical comparison: ICMR 2010 was 21.0 mg/day; updated to 29.0 mg/day in 2020.
                </span>
                <span className="block text-[10px] text-emerald-700 font-medium">Category 1: Directly Supported by Published Literature</span>
              </div>
              <div className="text-right">
                <span className="font-bold" style={{ color: C.sageDeep }}>{dyn.officialBaselineRda || 29.0} mg/day</span>
                <span className="block text-[10px] text-gray-500">ICMR-NIN 2020 Table 4.1</span>
              </div>
            </div>

            {/* Step 2: Basal Loss */}
            <div className="flex justify-between py-2 border-b" style={{ borderColor: C.line }}>
              <div>
                <span style={{ color: C.plumSoft }}>2. Basal Obligatory Iron Loss</span>
                <span className="block text-[10px] text-blue-700 font-medium">Category 2: Derived Mathematically from Published Data (14 µg/kg × 55 kg = 0.77 mg/day ≈ 0.80 mg/day reference benchmark)</span>
              </div>
              <div className="text-right">
                <span className="font-bold" style={{ color: C.plum }}>0.80 mg/day absorbed</span>
                <span className="block text-[10px] text-gray-500">Standardized benchmark (55 kg ref woman)</span>
              </div>
            </div>

            {/* Step 3: Menstrual Phase Increment */}
            <div className="flex justify-between py-2 border-b" style={{ borderColor: C.line }}>
              <div>
                <span style={{ color: C.plumSoft }}>3. Cycle Phase Adjustment ({dyn.phaseLabel})</span>
                <span className="block text-[10px] text-amber-700 font-medium">Category 3: NutriHer Project-Level Modelling Assumption</span>
              </div>
              <div className="text-right">
                <span className="font-bold" style={{ color: C.blushDeep }}>
                  +{Number(dyn.phaseLossIncrement || 0.6).toFixed(2)} mg/day absorbed
                </span>
                <span className="block text-[10px]" style={{ color: C.mauve }}>
                  Derived from Hallberg blood loss data
                </span>
              </div>
            </div>

            {/* Total Modelled Absorbed Need */}
            <div className="flex justify-between py-2 border-b font-semibold" style={{ borderColor: C.line }}>
              <span style={{ color: C.plum }}>Total Modelled Absorbed Requirement</span>
              <span style={{ color: C.lavenderDeep }}>{dyn.totalModelledAbsorbedNeed || dyn.absorbedTargetMg} mg absorbed / day</span>
            </div>

            {/* Step 4: Bioavailability Assumption */}
            <div className="flex justify-between py-2 border-b" style={{ borderColor: C.line }}>
              <div>
                <span style={{ color: C.plumSoft }}>4. Dietary Bioavailability Efficiency Factor</span>
                <span className="block text-[10px] text-emerald-700 font-medium">Category 1: 8% reference bioavailability assumption used by the ICMR-NIN framework</span>
              </div>
              <div className="text-right">
                <span className="font-bold" style={{ color: C.plum }}>{dyn.dietLabel}</span>
                <span className="block text-[10px] text-gray-500">ICMR-NIN 2020 Section 4.3</span>
              </div>
            </div>

            {/* Step 5: Final Modelled Target Box */}
            <div className="p-4 rounded-2xl font-mono text-xs mt-3" style={{ background: C.cream, border: `1px solid ${C.line}` }}>
              <div className="text-[11px] uppercase font-bold mb-1" style={{ color: C.sageDeep }}>
                Final Modelled Dietary Reference Target:
              </div>
              <div className="text-xs" style={{ color: C.plum }}>
                Modelled Target = Modelled Absorbed Need ÷ Assumed Bioavailability
              </div>
              <div className="mt-1 font-bold text-sm" style={{ color: C.sageDeep }}>
                {dyn.totalModelledAbsorbedNeed || dyn.absorbedTargetMg} mg ÷ {(Number(dyn.bioavailabilityPct || 8) / 100).toFixed(2)} ={" "}
                <span className="text-base">{dyn.modelledDietaryTarget || dyn.dietaryTargetMg} mg/day</span>
              </div>
              <div className="text-[11px] font-sans mt-2 leading-relaxed" style={{ color: C.plumMuted }}>
                ℹ️ <strong>Methodology Note:</strong> {dyn.ageEvaluationNote}
              </div>

              {/* Phase 17: Scientific Transparency Callout */}
              <div className="mt-3 pt-3 border-t border-dashed font-sans" style={{ borderColor: C.line }}>
                <div className="text-[11px] font-bold uppercase tracking-wider text-sky-800 mb-1.5 flex items-center gap-1.5">
                  <span>🔬</span> Scientific Transparency & Evidence Breakdown:
                </div>
                <div className="space-y-1 text-xs text-gray-700 font-sans">
                  <div className="flex justify-between py-0.5">
                    <span className="text-gray-500">Official Population Reference:</span>
                    <span className="font-semibold text-gray-800">{dyn.officialBaselineRda || 29.0} mg/day (ICMR-NIN 2020 Table 4.1)</span>
                  </div>
                  <div className="flex justify-between py-0.5">
                    <span className="text-gray-500">Modelled Adjustment:</span>
                    <span className="font-semibold text-rose-700">+{Number(dyn.phaseLossIncrement || 0.6).toFixed(2)} mg absorbed/day (NutriHer prototype model)</span>
                  </div>
                  <div className="flex justify-between py-0.5">
                    <span className="text-gray-500">Assumed Bioavailability:</span>
                    <span className="font-semibold text-gray-800">{dyn.bioavailabilityPct || 8.0}% ({dyn.dietLabel})</span>
                  </div>
                  <div className="mt-2 p-2.5 rounded-xl bg-sky-50/80 border border-sky-100 text-[11px] text-sky-900 leading-relaxed">
                    <strong>Why?</strong> The official 29.0 mg/day RDA represents a population-level safe upper benchmark covering 97.5% of individuals across a full year. NutriHer does not replace medical advice or clinical guidelines; rather, it uses a physiological model to dynamically demonstrate how menstrual losses fluctuate day-to-day, empowering women to emphasize iron and absorption enhancers when biological need is greatest.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* CARD 2: Step-by-Step Absorbed Iron Calculation Breakdown */}
      <Card hover>
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setShowAbsorptionDetails(!showAbsorptionDetails)}
        >
          <div className="flex items-center gap-2">
            <Calculator size={18} color={C.lavenderDeep} />
            <Eyebrow color={C.lavenderDeep}>Meal Bioavailability & Absorption Calculation</Eyebrow>
          </div>
          <button type="button" style={{ color: C.plumMuted }}>
            {showAbsorptionDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>

        {showAbsorptionDetails && (
          <div className="mt-4 space-y-3 pt-3 border-t text-xs md:text-sm" style={{ borderColor: C.line }}>
            <div className="flex justify-between py-1.5 border-b" style={{ borderColor: C.line }}>
              <span style={{ color: C.plumSoft }}>Food & Selected Portion</span>
              <span className="font-semibold" style={{ color: C.plum }}>{mealLabel} ({mealPortion}g)</span>
            </div>
            <div className="flex justify-between py-1.5 border-b" style={{ borderColor: C.line }}>
              <span style={{ color: C.plumSoft }}>Dietary Iron in Food</span>
              <span className="font-semibold" style={{ color: C.plum }}>{Number(mealIron).toFixed(2)} mg</span>
            </div>
            <div className="flex justify-between py-1.5 border-b" style={{ borderColor: C.line }}>
              <span style={{ color: C.plumSoft }}>Iron Form Classification</span>
              <span className="font-semibold capitalize" style={{ color: C.plum }}>{ironType} (Plant non-heme source)</span>
            </div>
            <div className="flex justify-between py-1.5 border-b" style={{ borderColor: C.line }}>
              <span style={{ color: C.plumSoft }}>Baseline Absorption Rate</span>
              <span className="font-semibold" style={{ color: C.plum }}>8.0% (8% reference bioavailability assumption used by the ICMR-NIN framework)</span>
            </div>
            <div className="flex justify-between py-1.5 border-b" style={{ borderColor: C.line }}>
              <span style={{ color: C.plumSoft }}>Vitamin C Modulator (Ascorbic Acid)</span>
              <span className="font-semibold" style={{ color: C.sageDeep }}>
                {lastMeal?.vitaminC > 20 ? "+5.0% (NutriHer high Vit C heuristic)" : lastMeal?.vitaminC > 5 ? "+2.0% (NutriHer moderate Vit C heuristic)" : "+0.0%"}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b" style={{ borderColor: C.line }}>
              <span style={{ color: C.plumSoft }}>Calcium Modulator (DMT1 Competition)</span>
              <span className="font-semibold" style={{ color: lastMeal?.calcium > 150 ? C.roseDeep : C.plum }}>
                {lastMeal?.calcium > 150 ? "-2.0% (NutriHer elevated Calcium heuristic)" : "-0.0%"}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b font-semibold" style={{ borderColor: C.line }}>
              <span style={{ color: C.plum }}>Estimated Meal Bioavailability Rate</span>
              <span style={{ color: C.lavenderDeep }}>{absorptionRate}%</span>
            </div>

            {/* Formula Line */}
            <div className="p-3.5 rounded-2xl font-mono text-xs mt-2" style={{ background: C.cream, border: `1px solid ${C.line}`, color: C.plum }}>
              <div className="text-[11px] uppercase font-bold mb-1" style={{ color: C.lavenderDeep }}>
                Exact Applied Formula:
              </div>
              <div>Estimated Absorbed Iron = Dietary Iron × Bioavailability Rate</div>
              <div className="mt-1 font-bold text-sm" style={{ color: C.lavenderDeep }}>
                {Number(mealIron).toFixed(2)} mg × {(+absorptionRate / 100).toFixed(4)} = {Number(mealAbsorbed).toFixed(2)} mg absorbed
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* CARD 3: Evidence vs. Modelling Assumptions Matrix */}
      <Card hover>
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setShowConstantsTable(!showConstantsTable)}
        >
          <div className="flex items-center gap-2">
            <Layers size={18} color={C.babyBlueDeep} />
            <Eyebrow color={C.babyBlueDeep}>Evidence vs. Modelling Assumptions Matrix</Eyebrow>
          </div>
          <button type="button" style={{ color: C.plumMuted }}>
            {showConstantsTable ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>

        {showConstantsTable && (
          <div className="mt-4 pt-3 border-t overflow-x-auto" style={{ borderColor: C.line }}>
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b" style={{ borderColor: C.line, color: C.plum }}>
                  <th className="py-2 pr-3 font-bold">Parameter / Factor</th>
                  <th className="py-2 pr-3 font-bold">Value Used</th>
                  <th className="py-2 pr-3 font-bold">Category Classification</th>
                  <th className="py-2 font-bold">Scientific Basis / Literature Source</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ divideColor: C.line }}>
                <tr>
                  <td className="py-2.5 pr-3 font-medium">Adult Female RDA (18–59 yrs)</td>
                  <td className="py-2.5 pr-3 font-bold">29.0 mg/day</td>
                  <td className="py-2.5 pr-3"><PastelBadge variant="sage">1. Authoritative Evidence</PastelBadge></td>
                  <td className="py-2.5 text-plumSoft">Directly published in ICMR-NIN (2020) Table 4.1 covering 97.5% of women at 8% absorption. (EAR = 15.0 mg/day).</td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-3 font-medium">Historical Baseline RDA (ICMR 2010)</td>
                  <td className="py-2.5 pr-3 font-bold">21.0 mg/day</td>
                  <td className="py-2.5 pr-3"><PastelBadge variant="sage">1. Authoritative Evidence</PastelBadge></td>
                  <td className="py-2.5 text-plumSoft">Directly published in older ICMR (2010) report; revised upward to 29 mg in 2020.</td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-3 font-medium">Pregnancy Dietary RDA</td>
                  <td className="py-2.5 pr-3 font-bold">27.0 mg/day</td>
                  <td className="py-2.5 pr-3"><PastelBadge variant="sage">1. Authoritative Evidence</PastelBadge></td>
                  <td className="py-2.5 text-plumSoft">Directly published in ICMR-NIN (2020) Table 4.1 (12% pregnancy absorption). Dietary tracking does not replace prescribed IFA tablets.</td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-3 font-medium">Lactation Dietary RDA (0–12 mos)</td>
                  <td className="py-2.5 pr-3 font-bold">23.0 mg/day</td>
                  <td className="py-2.5 pr-3"><PastelBadge variant="sage">1. Authoritative Evidence</PastelBadge></td>
                  <td className="py-2.5 text-plumSoft">Directly published in ICMR-NIN (2020) Table 4.1 for lactating mothers.</td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-3 font-medium">Post-Menopausal RDA (60+ yrs)</td>
                  <td className="py-2.5 pr-3 font-bold">15.0 mg/day</td>
                  <td className="py-2.5 pr-3"><PastelBadge variant="sage">1. Authoritative Evidence</PastelBadge></td>
                  <td className="py-2.5 text-plumSoft">Directly published in ICMR-NIN (2020) Table 4.1 (reflects absence of menstrual blood loss).</td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-3 font-medium">Adolescent Girls RDA (10–12, 13–15, 16–17 yrs)</td>
                  <td className="py-2.5 pr-3 font-bold">16 / 29 / 26 mg</td>
                  <td className="py-2.5 pr-3"><PastelBadge variant="sage">1. Authoritative Evidence</PastelBadge></td>
                  <td className="py-2.5 text-plumSoft">Directly published in ICMR-NIN (2020) Table 4.1 across respective adolescent growth velocity brackets.</td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-3 font-medium">Basal Obligatory Iron Excretion Rate</td>
                  <td className="py-2.5 pr-3 font-bold">14 µg/kg/day</td>
                  <td className="py-2.5 pr-3"><PastelBadge variant="sage">1. Authoritative Evidence</PastelBadge></td>
                  <td className="py-2.5 text-plumSoft">Radioisotope physiological excretion measurements by Green et al. (1968) and FAO/WHO (2004).</td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-3 font-medium">Basal Iron Loss (55 kg Reference Woman)</td>
                  <td className="py-2.5 pr-3 font-bold">0.80 mg/day</td>
                  <td className="py-2.5 pr-3"><PastelBadge variant="blue">2. Mathematically Derived</PastelBadge></td>
                  <td className="py-2.5 text-plumSoft">Mathematically derived: 0.014 mg/kg/day × 55 kg reference woman = 0.77 mg/day ≈ 0.80 mg/day (standardized reference benchmark, not scaled by user weight).</td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-3 font-medium">Indian Diet Bioavailability Baseline</td>
                  <td className="py-2.5 pr-3 font-bold">8.0% (0.08)</td>
                  <td className="py-2.5 pr-3"><PastelBadge variant="sage">1. Authoritative Evidence</PastelBadge></td>
                  <td className="py-2.5 text-plumSoft">8% reference bioavailability assumption used by the ICMR-NIN framework for habitual Indian cereal-pulse diets (not an individual measurement of meal absorption).</td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-3 font-medium">Mixed Diet Bioavailability</td>
                  <td className="py-2.5 pr-3 font-bold">14.0% (0.14)</td>
                  <td className="py-2.5 pr-3"><PastelBadge variant="blue">2. Mathematically Derived</PastelBadge></td>
                  <td className="py-2.5 text-plumSoft">Evidence-informed reference bioavailability tier (14.0%) derived from the FAO/WHO (2004) Chapter 13 framework (12%–15% tier for diets containing meat/fish/poultry; not an individual biological measurement).</td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-3 font-medium">Vegan Bioavailability</td>
                  <td className="py-2.5 pr-3 font-bold">8.0% (0.08)</td>
                  <td className="py-2.5 pr-3"><PastelBadge variant="butter">3. NutriHer Assumption</PastelBadge></td>
                  <td className="py-2.5 text-plumSoft">Evidence supports low plant bioavailability (5%–10%); the exact 8.0% value is a NutriHer modelling assumption.</td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-3 font-medium">Heme Baseline Bioavailability</td>
                  <td className="py-2.5 pr-3 font-bold">25.0% (0.25)</td>
                  <td className="py-2.5 pr-3"><PastelBadge variant="blue">2. Mathematically Derived</PastelBadge></td>
                  <td className="py-2.5 text-plumSoft">Evidence-informed representative midpoint (25%) derived from published biological range (20%–30%; Hallberg & Hurrell 2002).</td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-3 font-medium">Menstrual Blood Loss Iron Mass</td>
                  <td className="py-2.5 pr-3 font-bold">~13.5–20.0 mg</td>
                  <td className="py-2.5 pr-3"><PastelBadge variant="blue">2. Mathematically Derived</PastelBadge></td>
                  <td className="py-2.5 text-plumSoft">Derived: 30–40 mL survey blood loss (Hallberg et al., 1966) converted via hemoglobin iron stoichiometry (~0.45–0.50 mg Fe/mL blood).</td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-3 font-medium">Menstrual Phase Increments (+1.9, +0.9, +0.4, +0.6 mg)</td>
                  <td className="py-2.5 pr-3 font-bold">+0.40 to +1.90 mg</td>
                  <td className="py-2.5 pr-3"><PastelBadge variant="butter">3. NutriHer Assumption</PastelBadge></td>
                  <td className="py-2.5 text-plumSoft">Evidence supports the underlying biological relationship, but the exact numerical value used by NutriHer is a project-level modelling assumption.</td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-3 font-medium">Flow Multipliers (0.75x, 1.00x, 1.35x)</td>
                  <td className="py-2.5 pr-3 font-bold">0.75x / 1.00x / 1.35x</td>
                  <td className="py-2.5 pr-3"><PastelBadge variant="butter">3. NutriHer Assumption</PastelBadge></td>
                  <td className="py-2.5 text-plumSoft">Evidence supports menstrual volume variance, but the exact 0.75x, 1.00x, 1.35x multipliers are NutriHer modelling assumptions.</td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-3 font-medium">Vitamin C Enhancer Modulators (+2% / +5%)</td>
                  <td className="py-2.5 pr-3 font-bold">+2.0% / +5.0%</td>
                  <td className="py-2.5 pr-3"><PastelBadge variant="rose">4. Evidence Limited / Uncertain</PastelBadge></td>
                  <td className="py-2.5 text-plumSoft">Evidence is limited or mixed regarding exact percentage shifts in composite meals, and further research is needed; NutriHer uses +2% / +5% as educational heuristics.</td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-3 font-medium">Calcium Inhibitor Modulator (-2%)</td>
                  <td className="py-2.5 pr-3 font-bold">-2.0%</td>
                  <td className="py-2.5 pr-3"><PastelBadge variant="rose">4. Evidence Limited / Uncertain</PastelBadge></td>
                  <td className="py-2.5 text-plumSoft">Evidence is limited or mixed regarding exact percentage shifts in composite meals, and further research is needed; NutriHer uses -2% as an educational heuristic.</td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-3 font-medium">Dietary Conversion Formula</td>
                  <td className="py-2.5 pr-3 font-bold">Target = Need ÷ Bioavail</td>
                  <td className="py-2.5 pr-3"><PastelBadge variant="blue">2. Mathematically Derived</PastelBadge></td>
                  <td className="py-2.5 text-plumSoft">Standard mass-balance bioavailability equation used by ICMR & WHO.</td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-3 font-medium">Food Composition IFCT 2017</td>
                  <td className="py-2.5 pr-3 font-bold">Per 100g database</td>
                  <td className="py-2.5 pr-3"><PastelBadge variant="sage">1. Authoritative Evidence</PastelBadge></td>
                  <td className="py-2.5 text-plumSoft">Direct assays from Longvah et al. (2017); composite recipes derived from raw IFCT ingredients.</td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-3 font-medium">EfficientNet-B0 Food Classifier</td>
                  <td className="py-2.5 pr-3 font-bold">87.89% val accuracy</td>
                  <td className="py-2.5 pr-3"><PastelBadge variant="sage">1. Authoritative Evidence</PastelBadge></td>
                  <td className="py-2.5 text-plumSoft">Architecture from Tan & Le (2019); empirically validated across 13,182 test images.</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* CARD 4: Structured Scientific Evidence & Literature Review Base */}
      <Card hover>
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setShowLiteratureReview(!showLiteratureReview)}
        >
          <div className="flex items-center gap-2">
            <BookMarked size={18} color={C.mauve} />
            <Eyebrow color={C.mauve}>Structured Literature Review & Evidence Base</Eyebrow>
          </div>
          <button type="button" style={{ color: C.plumMuted }}>
            {showLiteratureReview ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>

        {showLiteratureReview && (
          <div className="mt-4 space-y-6 pt-3 border-t text-xs leading-relaxed" style={{ borderColor: C.line, color: C.plumSoft }}>
            
            {/* Review Section 1 */}
            <div className="p-4 rounded-2xl" style={{ background: C.cream }}>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 size={16} color={C.sageDeep} />
                <strong className="text-sm font-bold text-plum">1. Iron Requirements in Women (ICMR-NIN 2020 vs. 2010 Standards)</strong>
              </div>
              <ul className="space-y-1.5 pl-1">
                <li><strong>Research Finding:</strong> Reproductive-age women require elevated dietary iron to replace menstrual blood loss; post-menopausal requirements decrease substantially.</li>
                <li><strong>Source:</strong> ICMR-NIN Expert Group (2020), <em>Nutrient Requirements and RDA for Indians</em>, Table 4.1.</li>
                <li><strong>What Literature Establishes:</strong> Physiological absorbed need for adult Indian women (55 kg) is 2.32 mg/day (95th percentile). At 8% absorption efficiency on Indian cereal-pulse diets, the official RDA is <strong>29.0 mg/day</strong>. (The older 2010 ICMR RDA was 21.0 mg/day; post-menopausal RDA is 15.0 mg/day).</li>
                <li><strong>What Remains Uncertain:</strong> True individual absorption efficiency varies from 4% to 15% depending on personal iron status (ferritin) and meal context.</li>
                <li><strong>NutriHer Translation:</strong> Uses 29.0 mg/day as the official published adult baseline, 29.0 mg/day for adolescents, and 15.0 mg/day for post-menopausal profiles, dynamically modulating around this reference baseline.</li>
              </ul>
            </div>

            {/* Review Section 2 */}
            <div className="p-4 rounded-2xl" style={{ background: C.cream }}>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 size={16} color={C.sageDeep} />
                <strong className="text-sm font-bold text-plum">2. Dietary Iron: Heme vs. Non-Heme Absorption Disparities</strong>
              </div>
              <ul className="space-y-1.5 pl-1">
                <li><strong>Research Finding:</strong> Heme iron is absorbed intact with high bioavailability; non-heme iron exhibits low, highly variable bioavailability.</li>
                <li><strong>Source:</strong> Hallberg & Hurrell (2002), <em>Am J Clin Nutr</em> 75(2):173–175; Lynch (1997), <em>Nutr Rev</em> 55(4):102–110.</li>
                <li><strong>What Literature Establishes:</strong> Heme iron (meat/poultry/fish) absorbs at ~20–30% via HCP1, largely protected from meal inhibitors. Non-heme iron (plants/dairy) absorbs at ~5–10% via DMT1 and depends strongly on concurrent chelators and luminal pH.</li>
                <li><strong>What Remains Uncertain:</strong> Systemic mucosal uptake varies dynamically based on hepcidin regulation and body iron stores.</li>
                <li><strong>NutriHer Translation:</strong> Classifies food items as heme (~25% base) or non-heme (~8% base) and applies meal-level modulation.</li>
              </ul>
            </div>

            {/* Review Section 3 */}
            <div className="p-4 rounded-2xl" style={{ background: C.cream }}>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 size={16} color={C.sageDeep} />
                <strong className="text-sm font-bold text-plum">3. Bioavailability Modulators (Ascorbic Acid & Inhibitors)</strong>
              </div>
              <ul className="space-y-1.5 pl-1">
                <li><strong>Research Finding:</strong> Vitamin C enhances non-heme iron absorption in a dose-dependent manner; calcium and polyphenols inhibit it.</li>
                <li><strong>Source:</strong> Hallberg et al. (1989), <em>Int J Vitam Nutr Res</em> 30:103–108; Hallberg et al. (1991), <em>Am J Clin Nutr</em> 53(1):112–119.</li>
                <li><strong>What Literature Establishes:</strong> Ascorbic acid reduces ferric (Fe³⁺) to soluble ferrous (Fe²⁺) iron. High calcium (&gt; 150 mg) and tea tannins compete with or precipitate iron in the lumen.</li>
                <li><strong>What Remains Uncertain:</strong> Precise percentage changes in complex composite meals with multiple interacting enhancers and inhibitors cannot be predicted with clinical certainty.</li>
                <li><strong>NutriHer Translation:</strong> Implements transparent discrete heuristics (+2%/+5% for Vitamin C, -2% for Calcium) to illustrate meal composition effects for nutritional awareness.</li>
              </ul>
            </div>

            {/* Review Section 4 */}
            <div className="p-4 rounded-2xl" style={{ background: C.cream }}>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 size={16} color={C.sageDeep} />
                <strong className="text-sm font-bold text-plum">4. Menstrual Blood Loss & Cycle-Phase Iron Dynamics</strong>
              </div>
              <ul className="space-y-1.5 pl-1">
                <li><strong>Research Finding:</strong> Menstrual blood loss causes significant periodic iron loss with wide non-Gaussian variation across women.</li>
                <li><strong>Source:</strong> Hallberg et al. (1966), <em>Acta Obstet Gynecol Scand</em> 45(3):320–351; Green et al. (1968), <em>Am J Clin Nutr</em> 21(10):1170–1183.</li>
                <li><strong>What Literature Establishes:</strong> Mean blood loss is ~30–40 mL/cycle (~15–20 mg iron); upper percentiles exceed 60–80 mL (~30–40 mg iron). Basal non-menstrual loss is ~14 µg/kg/day (~0.80 mg/day for 55 kg woman).</li>
                <li><strong>What Remains Uncertain:</strong> Official guidelines do not establish separate daily RDAs for each menstrual phase; they specify a single 28-day cycle average.</li>
                <li><strong>NutriHer Translation:</strong> Distributes total cycle loss into phase-specific educational increments (+1.90 mg Menstruation, +0.90 mg Follicular, +0.40 mg Ovulation, +0.60 mg Luteal), clearly labelled as project modelling assumptions.</li>
              </ul>
            </div>

            {/* Review Section 5 */}
            <div className="p-4 rounded-2xl" style={{ background: C.cream }}>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 size={16} color={C.sageDeep} />
                <strong className="text-sm font-bold text-plum">5. Food Composition & Indian Food Composition Tables (IFCT 2017)</strong>
              </div>
              <ul className="space-y-1.5 pl-1">
                <li><strong>Research Finding:</strong> Nutrient content varies significantly across Indian staple foods, requiring regional compositional assays.</li>
                <li><strong>Source:</strong> Longvah, T. et al. (2017), <em>Indian Food Composition Tables (IFCT 2017)</em>, ICMR-NIN, Hyderabad.</li>
                <li><strong>What Literature Establishes:</strong> Provides verified laboratory assays for iron, vitamin C, calcium, protein, and energy per 100g edible portion for Indian foods.</li>
                <li><strong>What Remains Uncertain:</strong> Cooked composite recipe dishes vary based on culinary methods, water loss, and regional ingredient proportions.</li>
                <li><strong>NutriHer Translation:</strong> Uses direct IFCT values for single-ingredient staples and standardized ingredient-weighted composite recipe models for multi-ingredient dishes.</li>
              </ul>
            </div>

            {/* Review Section 6 */}
            <div className="p-4 rounded-2xl" style={{ background: C.cream }}>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 size={16} color={C.sageDeep} />
                <strong className="text-sm font-bold text-plum">6. Computer Vision Food Recognition (EfficientNet-B0)</strong>
              </div>
              <ul className="space-y-1.5 pl-1">
                <li><strong>Research Finding:</strong> Convolutional neural networks using compound scaling achieve high accuracy on food classification benchmarks.</li>
                <li><strong>Source:</strong> Tan, M. & Le, Q. V. (2019), <em>EfficientNet: Rethinking Model Scaling for CNNs</em>, ICML 2019, PMLR 97:6105–6114.</li>
                <li><strong>What Literature Establishes:</strong> EfficientNet-B0 balances parameter efficiency with deep representational capacity. On NutriHer's 80 Indian cuisine classes (131,819 images), the model achieved 87.89% validation accuracy.</li>
                <li><strong>What Remains Uncertain:</strong> Out-of-distribution (OOD) dishes and visually homogeneous gravies (e.g. curries) can create visual ambiguity.</li>
                <li><strong>NutriHer Translation:</strong> Employs Top-5 candidate exposure with confidence scores so users can inspect and select alternatives rather than relying solely on Top-1 predictions.</li>
              </ul>
            </div>

            {/* Numbered Reference List */}
            <div className="pt-4 border-t" style={{ borderColor: C.line }}>
              <strong className="block text-sm font-bold text-plum mb-3">
                Authoritative Numbered Reference List:
              </strong>
              <ol className="list-decimal pl-4 space-y-2 text-[11px] text-plumSoft">
                <li>
                  <strong>ICMR-NIN Expert Group (2020).</strong> <em>Nutrient Requirements and Recommended Dietary Allowances for Indians: A Report of the Expert Group.</em> Indian Council of Medical Research – National Institute of Nutrition, Hyderabad. Table 4.1. Available from: <a href="https://www.nin.res.in" target="_blank" rel="noreferrer" className="underline text-blue-700">ICMR-NIN Official Publication</a>.
                </li>
                <li>
                  <strong>Longvah, T., Ananthan, R., Bhaskarachary, K., & Venkaiah, K. (2017).</strong> <em>Indian Food Composition Tables (IFCT 2017).</em> National Institute of Nutrition, Indian Council of Medical Research, Hyderabad. ISBN: 978-93-84572-00-6.
                </li>
                <li>
                  <strong>World Health Organization & Food and Agriculture Organization (2004).</strong> <em>Vitamin and Mineral Requirements in Human Nutrition (2nd ed.).</em> WHO/FAO, Geneva. Chapter 13: Iron (pp. 246–278). ISBN: 92-4-154612-3.
                </li>
                <li>
                  <strong>Hallberg, L., & Hurrell, R. F. (2002).</strong> <em>Iron deficiency: Global iron nutrition.</em> The American Journal of Clinical Nutrition, 75(2), 173–175. DOI: <a href="https://doi.org/10.1093/ajcn/75.2.173" target="_blank" rel="noreferrer" className="underline text-blue-700">10.1093/ajcn/75.2.173</a>.
                </li>
                <li>
                  <strong>Hallberg, L., Brune, M., & Rossander, L. (1989).</strong> <em>The role of vitamin C in iron absorption.</em> International Journal for Vitamin and Nutrition Research, 30, 103–108. PMID: 2507853.
                </li>
                <li>
                  <strong>Hallberg, L., Brune, M., Erlandsson, M., Sandberg, A. S., & Rossander-Hultén, L. (1991).</strong> <em>Calcium: effect of different amounts on nonheme- and heme-iron absorption in humans.</em> The American Journal of Clinical Nutrition, 53(1), 112–119. DOI: <a href="https://doi.org/10.1093/ajcn/53.1.112" target="_blank" rel="noreferrer" className="underline text-blue-700">10.1093/ajcn/53.1.112</a>.
                </li>
                <li>
                  <strong>Hallberg, L., Högdahl, A. M., Nilsson, L., & Rybo, G. (1966).</strong> <em>Menstrual blood loss—a population study.</em> Acta Obstetricia et Gynecologica Scandinavica, 45(3), 320–351. DOI: <a href="https://doi.org/10.3109/00016346609158455" target="_blank" rel="noreferrer" className="underline text-blue-700">10.3109/00016346609158455</a>.
                </li>
                <li>
                  <strong>Green, R., Charlton, R., Seftel, H., Bothwell, T., Mayet, F., Adams, B., Finch, C., & Layrisse, M. (1968).</strong> <em>Body iron excretion in man: A collaborative study.</em> The American Journal of Clinical Nutrition, 21(10), 1170–1183. DOI: <a href="https://doi.org/10.1093/ajcn/21.10.1170" target="_blank" rel="noreferrer" className="underline text-blue-700">10.1093/ajcn/21.10.1170</a>.
                </li>
                <li>
                  <strong>Lynch, S. R. (1997).</strong> <em>Interaction of iron with other nutrients.</em> Nutrition Reviews, 55(4), 102–110. DOI: <a href="https://doi.org/10.1111/j.1753-4887.1997.tb06461.x" target="_blank" rel="noreferrer" className="underline text-blue-700">10.1111/j.1753-4887.1997.tb06461.x</a>.
                </li>
                <li>
                  <strong>Tan, M., & Le, Q. V. (2019).</strong> <em>EfficientNet: Rethinking model scaling for convolutional neural networks.</em> International Conference on Machine Learning (ICML), PMLR, 97:6105–6114. arXiv: <a href="https://arxiv.org/abs/1905.11946" target="_blank" rel="noreferrer" className="underline text-blue-700">1905.11946</a>.
                </li>
              </ol>
            </div>
          </div>
        )}
      </Card>

      {/* Academic Disclaimer Notice */}
      <Card style={{ background: C.lavenderLight + "55" }}>
        <div className="flex gap-3">
          <Info size={18} color={C.lavenderDeep} className="shrink-0 mt-0.5" />
          <Body className="text-xs leading-relaxed">
            NutriHer's personalized target is a modelled nutritional reference based on published population recommendations (ICMR-NIN 2020 RDA = 29 mg/day) and project-level modelling assumptions. It is not a clinical measurement or individualized medical prescription.
          </Body>
        </div>
      </Card>
    </div>
  );
}
