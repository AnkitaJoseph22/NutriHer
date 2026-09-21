import React from "react";
import { Flower2, ChevronRight, Info, Utensils, Droplets, Sparkles, Heart } from "lucide-react";
import { C, FONT_HEAD } from "../styles/tokens";
import { Card, Eyebrow, H, Body } from "../components/ui";
import IronRing from "../components/IronRing";
import CyclePhaseBar from "../components/CyclePhaseBar";
import { PastelBadge, BotanicalBranch, CherryBlossomPetal } from "../components/Decorations";

export default function Dashboard({ profile, cycle, todaysLog, target, dynamicTargetInfo, setPage }) {
  const dietaryIron = todaysLog.reduce((sum, m) => sum + (m.iron || 0), 0);
  const absorbedIron = todaysLog.reduce((sum, m) => sum + (m.absorbed || 0), 0);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const dyn = dynamicTargetInfo || {
    dietaryTargetMg: target || 17.5,
    absorbedTargetMg: 1.40,
    phaseLabel: `${cycle.phase || "Luteal"} phase`,
    ageCategory: "Adult Reproductive-Age Women (18–59 years)",
    officialBaselineRda: 29.0,
  };

  return (
    <div className="space-y-6">
      {/* NutriHer Sanctuary Brand Banner */}
      <div
        className="rounded-3xl p-6 md:p-7 relative overflow-hidden soft-ceramic-card"
        style={{
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 247, 253, 0.9) 100%)",
          border: "1.5px solid #D1E2F0",
        }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
                style={{ background: "#E0F2FE", color: "#0369A1", border: "1px solid #BAE6FD" }}
              >
                <Flower2 size={13} color="#0284C7" />
                <span>NutriHer Sanctuary</span>
              </span>
              <PastelBadge variant="blush">
                <span>Day {cycle.day} · {cycle.phase} Phase</span>
              </PastelBadge>
              <PastelBadge variant="blue">Age {profile.age || 23}</PastelBadge>
              {dyn.lifecycleStatus && dyn.lifecycleStatus !== "Regular Cycle" && (
                <PastelBadge variant="butter">{dyn.lifecycleStatus}</PastelBadge>
              )}
            </div>

            <H size="text-3xl sm:text-4xl">
              {greeting}, {profile.name || "friend"}
            </H>
            <Body className="text-sm mt-1 text-slate-600 max-w-xl">
              Your personalized bioavailable iron sanctuary synchronized with your biological cycle rhythm.
            </Body>
          </div>

          <button
            type="button"
            onClick={() => setPage("food")}
            className="btn-3d flex items-center gap-2 px-6 py-3.5 rounded-full text-sm font-bold text-white self-start md:self-auto shadow-md"
            style={{
              background: "linear-gradient(135deg, #0284C7 0%, #0369A1 100%)",
            }}
          >
            <Utensils size={16} />
            <span>Scan Food Dish</span>
          </button>
        </div>
      </div>

      {/* Primary 2-Column Nutrition Cards */}
      <div className="grid sm:grid-cols-2 gap-5">
        {/* Card 1: Dietary Iron Consumed vs Modelled Target */}
        <Card hover className="relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <Eyebrow color={C.blushDeep}>Dietary Iron Consumed</Eyebrow>
            <span
              className="text-[10px] font-bold px-2.5 py-0.5 rounded-full"
              style={{ background: C.blushLight, color: C.blushDeep, border: `1px solid ${C.blush}` }}
            >
              {dyn.lifecycleStatus && dyn.lifecycleStatus !== "Regular Cycle"
                ? `${dyn.lifecycleStatus} Target`
                : `${cycle.phase} Target`}
            </span>
          </div>

          <div className="flex items-center gap-5 mt-3">
            <IronRing value={dietaryIron} target={dyn.dietaryTargetMg} colorFrom={C.blushDeep} subtext="of modelled target" />
            <div className="flex-1">
              <div style={{ fontFamily: FONT_HEAD, fontSize: 32, color: C.plum, fontWeight: 700, lineHeight: 1.1 }}>
                {dietaryIron.toFixed(1)} <span style={{ fontSize: 16, fontWeight: 500, color: C.plumMuted }}>mg</span>
              </div>
              <div className="text-xs font-semibold mt-1" style={{ color: C.plumSoft }}>
                Modelled Target: <span style={{ color: C.blushDeep }}>{dyn.dietaryTargetMg} mg/day</span>
              </div>
              <div className="text-[11px] mt-1" style={{ color: C.plumMuted }}>
                Population RDA Benchmark: {dyn.officialBaselineRda || 29.0} mg/day (ICMR 2020)
              </div>
            </div>
          </div>
        </Card>

        {/* Card 2: Estimated Absorbed Iron */}
        <div
          onClick={() => setPage("absorption")}
          className="cursor-pointer transition-all duration-300 hover:-translate-y-1"
        >
          <Card className="h-full relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <Eyebrow color={C.lavenderDeep}>Estimated Absorbed Iron</Eyebrow>
              <div className="flex items-center gap-1 text-xs font-semibold" style={{ color: C.lavenderDeep }}>
                <span>Bioavailability</span>
                <ChevronRight size={14} />
              </div>
            </div>

            <div className="flex items-center gap-5 mt-3">
              <IronRing value={absorbedIron} target={dyn.absorbedTargetMg} colorFrom={C.lavenderDeep} subtext="of absorbed need" />
              <div className="flex-1">
                <div style={{ fontFamily: FONT_HEAD, fontSize: 32, color: C.plum, fontWeight: 700, lineHeight: 1.1 }}>
                  {absorbedIron.toFixed(2)} <span style={{ fontSize: 16, fontWeight: 500, color: C.plumMuted }}>mg</span>
                </div>
                <div className="text-xs font-semibold mt-1" style={{ color: C.plumSoft }}>
                  Absorbed Need: <span style={{ color: C.lavenderDeep }}>{dyn.absorbedTargetMg} mg/day</span>
                </div>
                <div className="text-[11px] mt-1" style={{ color: C.plumMuted }}>
                  Physiological model heuristic
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Cycle Rhythm Card */}
      <Card hover>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <CherryBlossomPetal size={16} color={C.blushDeep} />
            <Eyebrow color={C.blushDeep}>Menstrual Cycle Rhythm</Eyebrow>
          </div>
          <button
            type="button"
            onClick={() => setPage("cycle")}
            className="text-xs font-semibold flex items-center gap-1"
            style={{ color: C.mauve }}
          >
            <span>Adjust Cycle</span>
            <ChevronRight size={14} />
          </button>
        </div>

        <div className="flex items-center gap-4 mt-2">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"
            style={{ background: `linear-gradient(135deg, ${C.blushLight}, ${C.lavenderLight})`, border: `1px solid ${C.blush}` }}
          >
            <Flower2 size={22} color={C.blushDeep} />
          </div>
          <div>
            <div style={{ fontFamily: FONT_HEAD, fontSize: 22, color: C.plum, fontWeight: 700 }}>
              Day {cycle.day} · {cycle.phase} Phase
            </div>
            <Body className="text-xs mt-0.5">
              {cycle.daysUntilNext} days remaining until next expected cycle.
            </Body>
          </div>
        </div>

        <CyclePhaseBar day={cycle.day} cycleLength={cycle.cycleLength} />
      </Card>

      {/* Logged Meal Stream or Quick Action */}
      {todaysLog.length > 0 ? (
        <Card>
          <div className="flex items-center justify-between mb-3">
            <Eyebrow color={C.sageDeep}>Today's Logged Meals ({todaysLog.length})</Eyebrow>
            <button type="button" onClick={() => setPage("food")} className="text-xs font-semibold" style={{ color: C.sageDeep }}>
              + Add Meal
            </button>
          </div>
          <div className="space-y-2">
            {todaysLog.map((meal, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-2xl"
                style={{ background: C.cream, border: `1px solid ${C.line}` }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: C.white }}>
                    <Utensils size={15} color={C.sageDeep} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold" style={{ color: C.plum }}>{meal.label}</div>
                    <div className="text-xs" style={{ color: C.plumMuted }}>{meal.portion}g · {meal.ironType}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold" style={{ color: C.plum }}>{meal.iron} mg iron</div>
                  <div className="text-[11px]" style={{ color: C.lavenderDeep }}>~{meal.absorbed} mg absorbed</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ) : (
        <Card style={{ background: `linear-gradient(135deg, ${C.cream}, ${C.babyBlueLight}44)` }}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
            <div className="flex items-center gap-3.5 text-center sm:text-left">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: C.white, border: `1px solid ${C.line}` }}>
                <Utensils size={20} color={C.babyBlueDeep} />
              </div>
              <div>
                <div className="text-sm font-bold" style={{ color: C.plum }}>No meals logged yet today</div>
                <Body className="text-xs">Upload or capture a food photo to calculate bioavailable nutrients.</Body>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setPage("food")}
              className="px-5 py-2.5 rounded-full text-xs font-bold shrink-0 shadow-sm"
              style={{ background: C.white, color: C.plum, border: `1.5px solid ${C.line}` }}
            >
              Log First Meal
            </button>
          </div>
        </Card>
      )}

      {/* Symptoms & Educational Disclaimer */}
      <div className="grid sm:grid-cols-2 gap-5">
        <Card>
          <div className="flex items-center justify-between mb-2">
            <Eyebrow color={C.mauve}>Recorded Symptoms</Eyebrow>
            <button type="button" onClick={() => setPage("symptoms")} style={{ color: C.mauve }}>
              <ChevronRight size={16} />
            </button>
          </div>
          {profile.symptoms && profile.symptoms.length > 0 ? (
            <div className="flex flex-wrap gap-2 mt-2">
              {profile.symptoms.map((s) => (
                <PastelBadge key={s} variant="blush">{s}</PastelBadge>
              ))}
            </div>
          ) : (
            <Body className="text-xs mt-1">No symptoms logged today.</Body>
          )}
        </Card>

        <Card style={{ background: C.lavenderLight + "55" }}>
          <div className="flex items-center gap-2 mb-1.5">
            <Info size={15} color={C.lavenderDeep} />
            <Eyebrow color={C.lavenderDeep}>Academic Prototype Notice</Eyebrow>
          </div>
          <Body className="text-[11px] leading-relaxed">
            NutriHer provides modelled nutritional reference estimates based on published ICMR-NIN 2020 RDA guidelines (29 mg/day) and project assumptions. It is for educational demonstration and does not provide clinical diagnoses or medical prescriptions.
          </Body>
        </Card>
      </div>
    </div>
  );
}
