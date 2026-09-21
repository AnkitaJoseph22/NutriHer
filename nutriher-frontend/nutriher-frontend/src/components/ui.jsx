import React from "react";
import { C, FONT_HEAD, FONT_BODY } from "../styles/tokens";

export const Card = ({ children, style, className = "", hover = false }) => (
  <div
    className={`soft-ceramic-card rounded-3xl p-6 md:p-7 transition-all duration-300 ${
      hover ? "hover:-translate-y-1 hover:shadow-xl cursor-pointer" : ""
    } ${className}`}
    style={{
      background: "rgba(255, 255, 255, 0.90)",
      border: "1px solid #D1E2F0",
      boxShadow: "0 18px 40px -14px rgba(2, 132, 199, 0.09), 0 3px 8px -2px rgba(2, 132, 199, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.95)",
      ...style,
    }}
  >
    {children}
  </div>
);

export const GlassCard = ({ children, style, className = "" }) => (
  <div
    className={`soft-glass-panel rounded-3xl p-6 transition-all duration-300 ${className}`}
    style={{
      ...style,
    }}
  >
    {children}
  </div>
);

export const Eyebrow = ({ children, color = "#0284C7", className = "" }) => (
  <div
    className={`text-[11px] tracking-[0.22em] uppercase mb-1.5 font-bold flex items-center gap-1.5 ${className}`}
    style={{ color, fontFamily: FONT_BODY }}
  >
    {children}
  </div>
);

export const H = ({ children, size = "text-2xl", style, className = "" }) => (
  <h2
    className={`${size} ${className}`}
    style={{ fontFamily: FONT_HEAD, color: "#0F172A", fontWeight: 700, letterSpacing: "-0.01em", ...style }}
  >
    {children}
  </h2>
);

export const Body = ({ children, style, className = "" }) => (
  <p className={className} style={{ fontFamily: FONT_BODY, color: "#334155", ...style }}>
    {children}
  </p>
);

export const Pill = ({ active, onClick, children, icon: Icon, color = "#0284C7" }) => (
  <button
    onClick={onClick}
    type="button"
    className="flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold transition-all duration-200 active:scale-95 shadow-sm"
    style={{
      fontFamily: FONT_BODY,
      background: active ? color : "#FFFFFF",
      color: active ? "#FFFFFF" : "#334155",
      border: `1.5px solid ${active ? color : "#D1E2F0"}`,
      boxShadow: active ? `0 6px 16px -4px ${color}66` : "0 2px 6px -2px rgba(2, 132, 199, 0.06)",
    }}
  >
    {Icon && <Icon size={14} />}
    {children}
  </button>
);

export const PrimaryButton = ({ children, onClick, full, icon: Icon, disabled, variant = "ocean" }) => {
  const gradient =
    variant === "ocean" || variant === "blue"
      ? "linear-gradient(135deg, #0284C7 0%, #0369A1 100%)"
      : variant === "lavender"
      ? "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)"
      : variant === "sage"
      ? "linear-gradient(135deg, #16A34A 0%, #15803D 100%)"
      : "linear-gradient(135deg, #E11D48 0%, #BE123C 100%)";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      type="button"
      className={`btn-3d flex items-center justify-center gap-2.5 rounded-full px-6 py-3.5 font-bold text-sm transition-all duration-200 active:scale-[0.98] shadow-md hover:shadow-lg ${
        full ? "w-full" : ""
      }`}
      style={{
        fontFamily: FONT_BODY,
        background: disabled ? "#E2E8F0" : gradient,
        color: disabled ? "#94A3B8" : "#FFFFFF",
        opacity: disabled ? 0.7 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
        boxShadow: disabled ? "none" : "0 10px 24px -6px rgba(2, 132, 199, 0.35)",
      }}
    >
      <span>{children}</span>
      {Icon && <Icon size={16} />}
    </button>
  );
};

export const GhostButton = ({ children, onClick, icon: Icon, color = C.mauve }) => (
  <button
    onClick={onClick}
    type="button"
    className="flex items-center justify-center gap-2 rounded-full px-5 py-3 font-semibold text-sm transition-colors hover:bg-black/5"
    style={{ fontFamily: FONT_BODY, color, background: "transparent" }}
  >
    {Icon && <Icon size={16} />}
    <span>{children}</span>
  </button>
);

export const Field = ({ label, children, sublabel }) => (
  <label className="block mb-4">
    <div className="flex justify-between items-baseline mb-1.5">
      <span className="block text-sm font-semibold" style={{ fontFamily: FONT_BODY, color: C.plum }}>
        {label}
      </span>
      {sublabel && <span className="text-xs" style={{ color: C.plumMuted }}>{sublabel}</span>}
    </div>
    {children}
  </label>
);

export const TextInput = (props) => (
  <input
    {...props}
    className="w-full rounded-2xl px-4 py-3.5 outline-none transition-all duration-200 focus:ring-2"
    style={{
      fontFamily: FONT_BODY,
      background: C.cream,
      border: `1.5px solid ${C.line}`,
      color: C.plum,
      boxShadow: "inset 0 1px 3px 0 rgba(0,0,0,0.02)",
      ...(props.style || {}),
    }}
  />
);

export const Stat = ({ label, value, subtext }) => (
  <div>
    <div className="text-xs mb-1" style={{ color: C.plumMuted }}>
      {label}
    </div>
    <div style={{ fontFamily: FONT_HEAD, fontSize: 22, color: C.plum, fontWeight: 700 }}>{value}</div>
    {subtext && <div className="text-[11px] mt-0.5" style={{ color: C.plumSoft }}>{subtext}</div>}
  </div>
);
