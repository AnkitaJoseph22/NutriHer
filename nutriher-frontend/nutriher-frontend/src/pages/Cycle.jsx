import React from "react";
import { Flower2, Calendar, Moon, Sparkles, Droplets } from "lucide-react";
import { C, FONT_HEAD } from "../styles/tokens";
import { Card, Eyebrow, H, Stat, Field, Pill, TextInput, Body } from "../components/ui";
import CyclePhaseBar from "../components/CyclePhaseBar";
import { PastelBadge, CherryBlossomPetal } from "../components/Decorations";

export default function CycleScreen({ profile, setProfile, cycle }) {
  const phaseDetails = {
    Menstruation: {
      color: C.blushDeep,
      bg: C.blushLight,
      badge: "Active Bleeding Phase",
      desc: "Uterine lining sheds (~15-35 mg iron total lost across bleeding days). Prioritize iron-dense meals paired with ascorbic acid (Vitamin C).",
    },
    Follicular: {
      color: C.babyBlueDeep,
      bg: C.babyBlueLight,
      badge: "Ferritin Store Recovery",
      desc: "Estrogen levels rise as follicles mature. Ideal phase for replenishing depleted ferritin iron reserves and sustaining physical vitality.",
    },
    Ovulation: {
      color: C.butterDeep,
      bg: C.butterLight,
      badge: "Peak Energy & Ovulation",
      desc: "Luteinizing hormone peaks around mid-cycle. Micronutrient balance and steady hydration support optimal physiological metabolism.",
    },
    Luteal: {
      color: C.lavenderDeep,
      bg: C.lavenderLight,
      badge: "Progesterone Dominance",
      desc: "Progesterone rises in preparation for the upcoming cycle. Sustaining steady dietary iron helps prevent pre-menstrual fatigue dips.",
    },
  }[cycle.phase] || {
    color: C.lavenderDeep,
    bg: C.lavenderLight,
    badge: "Cycle Rhythm",
    desc: "Maintaining balanced micronutrient intake supports metabolic and hormonal equilibrium.",
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <PastelBadge variant="blush">
            <Flower2 size={13} color={C.blushDeep} />
            <span>Biological Rhythms</span>
          </PastelBadge>
          <PastelBadge variant="lavender">Cycle Tracker</PastelBadge>
        </div>
        <H size="text-3xl">Menstrual Cycle Context</H>
        <Body className="text-sm mt-0.5">
          Understanding your hormonal phase helps tailor bioavailable nutrition.
        </Body>
      </div>

      {/* Main Cycle Overview Card */}
      <Card hover>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CherryBlossomPetal size={18} color={phaseDetails.color} />
            <Eyebrow color={phaseDetails.color}>{phaseDetails.badge}</Eyebrow>
          </div>
          <PastelBadge variant="blue">Day {cycle.day} of {cycle.cycleLength}</PastelBadge>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
          <Stat label="Current Cycle Day" value={`Day ${cycle.day}`} subtext={`${cycle.phase} Phase`} />
          <Stat label="Cycle Length" value={`${cycle.cycleLength} days`} subtext="Standard cadence" />
          <Stat label="Days to Next Period" value={`${cycle.daysUntilNext} days`} subtext="Projected start" />
          <Stat label="Flow Setting" value={profile.intensity || "Moderate"} subtext="Blood loss factor" />
        </div>

        <CyclePhaseBar day={cycle.day} cycleLength={cycle.cycleLength} />

        {/* Phase Contextual Note */}
        <div className="mt-5 p-4 rounded-2xl text-xs leading-relaxed" style={{ background: phaseDetails.bg, border: `1.5px solid ${phaseDetails.color}44` }}>
          <strong className="block text-sm mb-1" style={{ color: C.plum }}>{cycle.phase} Phase Context:</strong>
          <span style={{ color: C.plumSoft }}>{phaseDetails.desc}</span>
        </div>
      </Card>

      {/* Adjust Inputs Card */}
      <Card hover>
        <Eyebrow color={C.mauve}>Adjust Cycle Parameters</Eyebrow>
        <div className="grid sm:grid-cols-3 gap-4 mt-3">
          <Field label="Last Period Start Date">
            <TextInput
              type="date"
              value={profile.lastPeriod ? profile.lastPeriod.slice(0, 10) : ""}
              onChange={(e) => setProfile((p) => ({ ...p, lastPeriod: e.target.value }))}
            />
          </Field>

          <Field label="Cycle Length (Days)">
            <TextInput
              type="number"
              min={21}
              max={40}
              value={profile.cycleLength || 28}
              onChange={(e) => setProfile((p) => ({ ...p, cycleLength: +e.target.value || 28 }))}
            />
          </Field>

          <Field label="Bleeding Intensity">
            <div className="flex gap-1.5 pt-1">
              {["Light", "Moderate", "Heavy"].map((opt) => (
                <Pill
                  key={opt}
                  active={profile.intensity === opt}
                  color={C.blushDeep}
                  onClick={() => setProfile((p) => ({ ...p, intensity: opt }))}
                >
                  {opt}
                </Pill>
              ))}
            </div>
          </Field>
        </div>
      </Card>
    </div>
  );
}
