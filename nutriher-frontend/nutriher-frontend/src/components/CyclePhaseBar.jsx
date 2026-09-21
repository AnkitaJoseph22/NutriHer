import React from "react";
import { C } from "../styles/tokens";

export default function CyclePhaseBar({ day, cycleLength = 28 }) {
  const safeCycleLength = cycleLength || 28;
  const phases = [
    { name: "Menstruation", start: 1, end: 5, color: C.blushDeep, bg: C.blushLight },
    { name: "Follicular", start: 6, end: 13, color: C.babyBlueDeep, bg: C.babyBlueLight },
    { name: "Ovulation", start: 14, end: 16, color: C.butterDeep, bg: C.butterLight },
    { name: "Luteal", start: 17, end: safeCycleLength, color: C.lavenderDeep, bg: C.lavenderLight },
  ];

  let prev = 0;

  return (
    <div className="mt-5">
      <div className="flex w-full h-3 rounded-full overflow-hidden p-0.5" style={{ background: C.creamDeep, border: `1px solid ${C.line}` }}>
        {phases.map((p) => {
          const width = ((p.end - prev) / safeCycleLength) * 100;
          prev = p.end;
          return (
            <div
              key={p.name}
              className="h-full rounded-full transition-all"
              style={{ width: `${width}%`, background: p.color, opacity: 0.85 }}
            />
          );
        })}
      </div>

      <div className="relative h-5">
        <div
          className="absolute -top-4 transition-all duration-500 flex flex-col items-center"
          style={{
            left: `calc(${Math.min(98, Math.max(2, (day / safeCycleLength) * 100))}% - 9px)`,
          }}
        >
          <div
            className="w-4.5 h-4.5 rounded-full border-2 shadow-sm flex items-center justify-center"
            style={{
              background: C.white,
              borderColor: C.blushDeep,
            }}
          >
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: C.blushDeep }} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-1 text-center text-[10px] font-semibold mt-1">
        {phases.map((p) => (
          <span
            key={p.name}
            className="py-1 rounded-md"
            style={{
              color: p.color,
              background: p.bg,
            }}
          >
            {p.name}
          </span>
        ))}
      </div>
    </div>
  );
}
