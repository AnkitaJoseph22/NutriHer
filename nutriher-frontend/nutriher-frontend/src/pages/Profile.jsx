import React from "react";
import { User, ShieldCheck, Heart, Sparkles, Leaf, RotateCcw, ArrowRight } from "lucide-react";
import { Card, Eyebrow, H, Body, Pill, Field, TextInput } from "../components/ui";
import { C } from "../styles/tokens";
import { PastelBadge } from "../components/Decorations";

export default function ProfileScreen({ profile, setProfile, onResetDemo, onStartOnboarding }) {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <PastelBadge variant="lavender">
            <User size={13} color={C.lavenderDeep} />
            <span>Personal Profile</span>
          </PastelBadge>
          <PastelBadge variant="blue">Age {profile.age || 23}</PastelBadge>
        </div>
        <H size="text-3xl">{profile.name || "Your Profile"}</H>
        <Body className="text-sm mt-0.5">
          Your profile parameters dynamically calibrate your physiological iron reference target.
        </Body>
      </div>

      <Card hover>
        <div className="grid sm:grid-cols-3 gap-4 mb-4">
          <Field label="Your Name">
            <TextInput
              value={profile.name || ""}
              placeholder="e.g. Ananya"
              onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
            />
          </Field>
          <Field label="Age (Years)" sublabel="Evaluates RDA Age Group">
            <TextInput
              type="number"
              min={10}
              max={99}
              value={profile.age || ""}
              placeholder="e.g. 23"
              onChange={(e) => setProfile((p) => ({ ...p, age: +e.target.value }))}
            />
          </Field>
          <Field label="Height (cm)">
            <TextInput
              type="number"
              value={profile.height || ""}
              placeholder="e.g. 160"
              onChange={(e) => setProfile((p) => ({ ...p, height: +e.target.value }))}
            />
          </Field>
        </div>

        <Field label="Dietary Pattern (Calibrates Bioavailability Assumption)">
          <div className="flex flex-wrap gap-2.5 pt-1">
            {["Vegetarian", "Non-Vegetarian", "Vegan", "Eggetarian"].map((opt) => (
              <Pill
                key={opt}
                active={profile.diet === opt}
                color={C.lavenderDeep}
                onClick={() => setProfile((p) => ({ ...p, diet: opt }))}
              >
                {opt}
              </Pill>
            ))}
          </div>
        </Field>

        <Field label="Lifecycle Stage (Calibrates Reference RDA & Blood Loss Context)" className="mt-4">
          <div className="flex flex-wrap gap-2.5 pt-1">
            {[
              { id: "Regular Cycle", label: "Regular Cycle" },
              { id: "Pregnant", label: "Pregnant (27 mg RDA)" },
              { id: "Lactating", label: "Lactating (23 mg RDA)" },
              { id: "Post-Menopausal", label: "Post-Menopausal (15 mg RDA)" },
            ].map((opt) => (
              <Pill
                key={opt.id}
                active={(profile.lifecycle_status || profile.lifecycleStatus || "Regular Cycle") === opt.id}
                color={C.sageDeep}
                onClick={() => setProfile((p) => ({ ...p, lifecycle_status: opt.id, lifecycleStatus: opt.id }))}
              >
                {opt.label}
              </Pill>
            ))}
          </div>
          {(profile.lifecycle_status === "Pregnant" || profile.lifecycleStatus === "Pregnant") && (
            <div className="mt-2 text-xs p-2.5 rounded-xl border" style={{ background: C.butterLight, borderColor: C.butterDeep, color: C.plum }}>
              🤰 <strong>Clinical Supplementation Advisory:</strong> ICMR-NIN 2020 sets dietary RDA at 27.0 mg/day (12% absorption). Government of India (MoHFW) standard protocol mandates daily Iron-Folic Acid (IFA) clinical supplementation during pregnancy. NutriHer tracks dietary intake and does not replace prescribed tablets.
            </div>
          )}
          {(profile.lifecycle_status === "Post-Menopausal" || profile.lifecycleStatus === "Post-Menopausal") && (
            <div className="mt-2 text-xs p-2.5 rounded-xl border" style={{ background: C.lavenderLight, borderColor: C.lavenderDeep, color: C.plum }}>
              🌸 <strong>Post-Menopausal Status:</strong> Official ICMR-NIN 2020 RDA is 15.0 mg/day, reflecting the absence of menstrual blood loss. Dynamic menstrual phase increments are deactivated.
            </div>
          )}
        </Field>
      </Card>

      {/* Account Management & Security Card */}
      <Card hover>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck size={17} color="#0284C7" />
            <Eyebrow color="#0284C7">Account & Sanctuary Access</Eyebrow>
          </div>
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            Active Session
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80">
          <div>
            <div className="text-sm font-bold text-slate-900">
              {profile.name || "Ananya"}
            </div>
            <div className="text-xs text-slate-500">
              {profile.email || `${(profile.name || "ananya").toLowerCase()}@nutriher.ai`}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Lifecycle: {profile.lifecycle_status || profile.lifecycleStatus || "Regular Cycle"}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onResetDemo}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-sky-700 bg-white hover:bg-sky-50 border border-sky-200 transition-colors shadow-sm flex items-center gap-1.5"
            >
              <RotateCcw size={13} className="text-sky-600" />
              <span>Reset Demo Baseline</span>
            </button>
            {onStartOnboarding && (
              <button
                type="button"
                onClick={onStartOnboarding}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors shadow-sm flex items-center gap-1.5"
              >
                <ArrowRight size={13} className="text-emerald-600" />
                <span>Retake Onboarding</span>
              </button>
            )}
          </div>
        </div>
      </Card>

      <Card hover style={{ background: C.cream }}>
        <div className="flex items-center gap-2 mb-2">
          <Leaf size={16} color={C.sageDeep} />
          <Eyebrow color={C.sageDeep}>About NutriHer Architecture</Eyebrow>
        </div>
        <Body className="text-xs leading-relaxed">
          NutriHer combines an <strong>EfficientNet-B0</strong> deep-learning food classifier (80 Indian classes, 87.89% validation accuracy) with the <strong>ICMR-NIN Indian Food Composition Tables (IFCT 2017)</strong> and a menstrual-cycle bioavailable iron calculation engine.
        </Body>
      </Card>
    </div>
  );
}
