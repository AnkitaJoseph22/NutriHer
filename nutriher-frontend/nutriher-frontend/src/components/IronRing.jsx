import React from "react";
import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";
import { C, FONT_HEAD } from "../styles/tokens";

export default function IronRing({ value, target, colorFrom = "#0284C7", subtext = "of modelled target" }) {
  const safeTarget = target > 0 ? target : 21.0;
  const pct = Math.min(100, Math.round((value / safeTarget) * 100) || 0);
  const data = [{ name: "iron", value: pct, fill: colorFrom }];

  return (
    <div className="relative w-36 h-36 mx-auto flex items-center justify-center select-none">
      {/* 3D Glowing Ambient Halo */}
      <div
        className="absolute inset-1 rounded-full opacity-35 animate-pulse-glow pointer-events-none"
        style={{ background: `radial-gradient(circle, ${colorFrom}44 0%, transparent 70%)` }}
      />

      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart innerRadius="74%" outerRadius="100%" data={data} startAngle={90} endAngle={-270}>
          <RadialBar dataKey="value" cornerRadius={30} background={{ fill: "#E2EEF8" }} />
        </RadialBarChart>
      </ResponsiveContainer>

      {/* 3D Inner Dial Core with Specular Light */}
      <div
        className="absolute w-24 h-24 rounded-full flex flex-col items-center justify-center"
        style={{
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(240, 247, 253, 0.92) 100%)",
          boxShadow:
            "0 6px 16px -4px rgba(2, 132, 199, 0.18), inset 0 2px 4px rgba(255, 255, 255, 0.95), inset 0 -1px 2px rgba(2, 132, 199, 0.12)",
          border: "1px solid rgba(255, 255, 255, 0.9)",
        }}
      >
        <span style={{ fontFamily: FONT_HEAD, fontSize: 24, color: "#0F172A", fontWeight: 800, lineHeight: 1 }}>
          {pct}%
        </span>
        <span className="text-[9px] font-bold tracking-tight mt-0.5 text-center px-1" style={{ color: "#64748B" }}>
          {subtext}
        </span>
      </div>
    </div>
  );
}
