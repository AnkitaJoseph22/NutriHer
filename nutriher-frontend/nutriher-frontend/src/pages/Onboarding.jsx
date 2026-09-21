import React, { useState } from "react";
import { Check, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { C, FONT_HEAD, FONT_BODY, SYMPTOM_OPTIONS, ONBOARDING_STEPS } from "../styles/tokens";
import { Card, Eyebrow, H, Body, Pill, PrimaryButton, GhostButton, Field, TextInput } from "../components/ui";

export default function Onboarding({ profile, setProfile, onFinish }) {
  const [step, setStep] = useState(0);

  const update = (patch) => setProfile((p) => ({ ...p, ...patch }));
  const toggleSymptom = (s) => {
    const current = profile.symptoms || [];
    update({
      symptoms: current.includes(s)
        ? current.filter((x) => x !== s)
        : [...current, s],
    });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-5" style={{ background: C.cream }}>
      <div className="w-full max-w-lg">
        {/* progress */}
        <div className="flex items-center gap-2 mb-8">
          {ONBOARDING_STEPS.map((label, i) => (
            <React.Fragment key={label}>
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold"
                  style={{
                    background: i <= step ? C.lavenderDeep : C.line,
                    color: i <= step ? C.white : C.plumSoft,
                  }}
                >
                  {i < step ? <Check size={13} /> : i + 1}
                </div>
                <span className="text-[10px] hidden sm:block" style={{ color: C.plumSoft, fontFamily: FONT_BODY }}>
                  {label}
                </span>
              </div>
              {i < ONBOARDING_STEPS.length - 1 && (
                <div className="flex-1 h-[2px]" style={{ background: i < step ? C.lavenderDeep : C.line }} />
              )}
            </React.Fragment>
          ))}
        </div>

        <Card>
          {step === 0 && (
            <>
              <Eyebrow>Step 1</Eyebrow>
              <H>About you</H>
              <Body className="mb-6 text-sm">A little context helps NutriHer personalize your targets.</Body>
              <Field label="Name">
                <TextInput value={profile.name} onChange={(e) => update({ name: e.target.value })} placeholder="Ananya" />
              </Field>
              <div className="grid grid-cols-3 gap-3">
                <Field label="Age">
                  <TextInput type="number" value={profile.age} onChange={(e) => update({ age: e.target.value })} />
                </Field>
                <Field label="Height (cm)">
                  <TextInput type="number" value={profile.height} onChange={(e) => update({ height: e.target.value })} />
                </Field>
                <Field label="Weight (kg)">
                  <TextInput type="number" value={profile.weight} onChange={(e) => update({ weight: e.target.value })} />
                </Field>
              </div>
              <Field label="Dietary preference">
                <div className="flex flex-wrap gap-2">
                  {["Vegetarian", "Non-vegetarian", "Vegan", "Other"].map((opt) => (
                    <Pill key={opt} active={profile.diet === opt} onClick={() => update({ diet: opt })}>
                      {opt}
                    </Pill>
                  ))}
                </div>
              </Field>
            </>
          )}

          {step === 1 && (
            <>
              <Eyebrow>Step 2</Eyebrow>
              <H>Your cycle</H>
              <Body className="mb-6 text-sm">This helps NutriHer estimate your current phase and iron needs.</Body>
              <Field label="Average cycle length (days)">
                <TextInput
                  type="number"
                  value={profile.cycleLength}
                  onChange={(e) => update({ cycleLength: +e.target.value })}
                />
              </Field>
              <Field label="First day of last period">
                <TextInput type="date" value={profile.lastPeriod} onChange={(e) => update({ lastPeriod: e.target.value })} />
              </Field>
              <Field label="Typical menstruation duration (days)">
                <TextInput type="number" value={profile.duration} onChange={(e) => update({ duration: e.target.value })} />
              </Field>
              <Field label="Typical bleeding intensity">
                <div className="flex gap-2">
                  {["Light", "Moderate", "Heavy"].map((opt) => (
                    <Pill key={opt} active={profile.intensity === opt} onClick={() => update({ intensity: opt })}>
                      {opt}
                    </Pill>
                  ))}
                </div>
              </Field>
            </>
          )}

          {step === 2 && (
            <>
              <Eyebrow>Step 3</Eyebrow>
              <H>Nutrition & symptoms</H>
              <Body className="mb-6 text-sm">
                Select anything you've noticed recently — this stays gentle, not overwhelming.
              </Body>
              <Field label="Symptoms you experience">
                <div className="flex flex-wrap gap-2">
                  {SYMPTOM_OPTIONS.map((s) => (
                    <Pill key={s} active={(profile.symptoms || []).includes(s)} onClick={() => toggleSymptom(s)}>
                      {s}
                    </Pill>
                  ))}
                </div>
              </Field>
            </>
          )}

          {step === 3 && (
            <div className="text-center py-6">
              <div
                className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center"
                style={{ background: C.sage + "55" }}
              >
                <Check size={28} color={C.sageDeep} />
              </div>
              <H>You're all set, {profile.name || "friend"}</H>
              <Body className="mt-2 text-sm max-w-xs mx-auto">
                NutriHer has what it needs to personalize your dashboard and iron insights.
              </Body>
            </div>
          )}

          <div className="flex justify-between mt-8">
            {step > 0 ? (
              <GhostButton onClick={() => setStep((s) => s - 1)} icon={ChevronLeft}>
                Back
              </GhostButton>
            ) : (
              <span />
            )}
            {step < ONBOARDING_STEPS.length - 1 ? (
              <PrimaryButton onClick={() => setStep((s) => s + 1)} icon={ChevronRight}>
                Continue
              </PrimaryButton>
            ) : (
              <PrimaryButton onClick={onFinish} icon={ArrowRight}>
                Go to dashboard
              </PrimaryButton>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
