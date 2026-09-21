import React, { useState } from "react";
import { Activity } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { C, FONT_BODY, SYMPTOM_OPTIONS } from "../styles/tokens";
import { Card, Eyebrow, H, Pill } from "../components/ui";

// Demo-only weekly trend data. Replace with a real /symptoms history
// endpoint once the backend persists logged entries.
const trendData = [
  { day: "Mon", intensity: 1 },
  { day: "Tue", intensity: 2 },
  { day: "Wed", intensity: 1 },
  { day: "Thu", intensity: 3 },
  { day: "Fri", intensity: 2 },
  { day: "Sat", intensity: 1 },
  { day: "Sun", intensity: 2 },
];

export default function SymptomScreen({ profile, setProfile }) {
  const [intensity, setIntensity] = useState("Mild");
  const toggle = (s) =>
    setProfile((p) => ({
      ...p,
      symptoms: p.symptoms.includes(s) ? p.symptoms.filter((x) => x !== s) : [...p.symptoms, s],
    }));

  return (
    <div className="space-y-6">
      <div>
        <Eyebrow>Symptom tracker</Eyebrow>
        <H size="text-3xl">How are you feeling?</H>
      </div>

      <Card>
        <Eyebrow>Select symptoms</Eyebrow>
        <div className="flex flex-wrap gap-2 mt-2">
          {SYMPTOM_OPTIONS.concat(["Bloating"]).map((s) => (
            <Pill key={s} active={profile.symptoms.includes(s)} onClick={() => toggle(s)} icon={Activity}>
              {s}
            </Pill>
          ))}
        </div>
        <div className="mt-5">
          <Eyebrow>Intensity</Eyebrow>
          <div className="flex gap-2 mt-2">
            {["Mild", "Moderate", "Severe"].map((opt) => (
              <Pill key={opt} active={intensity === opt} onClick={() => setIntensity(opt)}>
                {opt}
              </Pill>
            ))}
          </div>
        </div>
      </Card>

      <Card>
        <Eyebrow>Weekly trend</Eyebrow>
        <div style={{ width: "100%", height: 180 }}>
          <ResponsiveContainer>
            <LineChart data={trendData}>
              <CartesianGrid stroke={C.line} vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: C.plumSoft }} axisLine={false} tickLine={false} />
              <YAxis hide domain={[0, 3]} />
              <Tooltip contentStyle={{ fontFamily: FONT_BODY, borderRadius: 12, border: `1px solid ${C.line}` }} />
              <Line type="monotone" dataKey="intensity" stroke={C.roseDeep} strokeWidth={2.5} dot={{ fill: C.roseDeep, r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
