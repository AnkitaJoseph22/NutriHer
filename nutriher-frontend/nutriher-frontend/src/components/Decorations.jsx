import React from "react";
import { C } from "../styles/tokens";

export const CherryBlossomPetal = ({ className = "", style = {}, color = C.blushDeep, size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block ${className}`}
    style={{ ...style }}
  >
    <path
      d="M12 2C9.5 4.5 4 10 7.5 16.5C11 23 16 19.5 19 14.5C22 9.5 14.5 4.5 12 2Z"
      fill={color}
      fillOpacity="0.85"
    />
    <path
      d="M12 4C10.5 5.8 7 9.8 9.2 14.2C11.5 18.5 14.8 16.2 16.8 12.8C18.8 9.2 13.8 5.8 12 4Z"
      fill="#FFF0F4"
      fillOpacity="0.6"
    />
  </svg>
);

export const BotanicalBranch = ({ className = "", style = {}, color = C.sageDeep, width = 60, height = 30 }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 100 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block ${className}`}
    style={{ ...style }}
  >
    <path
      d="M5 45 C35 35, 65 25, 95 10"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeOpacity="0.75"
    />
    {/* Leaves */}
    <path
      d="M30 36 C25 28, 32 18, 38 24 C44 30, 36 38, 30 36 Z"
      fill={C.sage}
      fillOpacity="0.85"
    />
    <path
      d="M55 27 C50 16, 62 10, 68 18 C74 26, 62 30, 55 27 Z"
      fill={C.sage}
      fillOpacity="0.85"
    />
    <path
      d="M75 18 C75 8, 88 5, 90 14 C92 23, 80 22, 75 18 Z"
      fill={C.sage}
      fillOpacity="0.85"
    />
    {/* Tiny Blossom */}
    <circle cx="48" cy="22" r="4.5" fill={C.blushDeep} fillOpacity="0.8" />
    <circle cx="48" cy="22" r="2" fill={C.butter} />
    <circle cx="85" cy="12" r="4" fill={C.blush} fillOpacity="0.9" />
  </svg>
);

export const FloatingPetalCluster = ({ className = "" }) => (
  <div className={`pointer-events-none select-none absolute inset-0 overflow-hidden ${className}`}>
    <div className="absolute top-10 left-[8%] animate-float-slow opacity-60">
      <CherryBlossomPetal size={24} color={C.blushDeep} />
    </div>
    <div className="absolute top-28 right-[12%] animate-float-slow opacity-70" style={{ animationDelay: "1.5s" }}>
      <FloatingGlassOrb size={36} color="blue" />
    </div>
    <div className="absolute bottom-24 left-[12%] animate-float-slow opacity-60" style={{ animationDelay: "3s" }}>
      <FloatingGlassOrb size={44} color="cyan" />
    </div>
    <div className="absolute bottom-12 right-[15%] animate-float-slow opacity-65" style={{ animationDelay: "2.2s" }}>
      <CherryBlossomPetal size={22} color={C.roseDeep} />
    </div>
  </div>
);

export const FloatingGlassOrb = ({ size = 40, color = "blue", className = "", style = {} }) => {
  const gradient =
    color === "blue"
      ? "radial-gradient(circle at 30% 28%, rgba(255, 255, 255, 0.95) 0%, rgba(186, 230, 253, 0.5) 40%, rgba(2, 132, 199, 0.4) 85%)"
      : color === "rose"
      ? "radial-gradient(circle at 30% 28%, rgba(255, 255, 255, 0.95) 0%, rgba(254, 205, 211, 0.5) 40%, rgba(225, 29, 72, 0.4) 85%)"
      : "radial-gradient(circle at 30% 28%, rgba(255, 255, 255, 0.95) 0%, rgba(224, 242, 254, 0.6) 45%, rgba(14, 165, 233, 0.35) 90%)";

  return (
    <div
      className={`rounded-full pointer-events-none ${className}`}
      style={{
        width: size,
        height: size,
        background: gradient,
        boxShadow: "inset -4px -4px 10px rgba(2, 132, 199, 0.25), inset 3px 3px 8px rgba(255, 255, 255, 0.8), 0 10px 24px -4px rgba(2, 132, 199, 0.2)",
        backdropFilter: "blur(6px)",
        ...style,
      }}
    />
  );
};

export const GeometricGridTexture = ({ className = "" }) => (
  <div
    className={`absolute inset-0 pointer-events-none opacity-40 texture-grid-overlay select-none ${className}`}
  />
);

export const NutriHerLogo3D = ({ size = 64, className = "" }) => (
  <div
    className={`relative inline-flex items-center justify-center rounded-3xl p-2.5 transition-all duration-300 hover:scale-105 select-none ${className}`}
    style={{
      width: size,
      height: size,
      background: "linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 240, 245, 0.9) 50%, rgba(240, 247, 254, 0.95) 100%)",
      boxShadow:
        "0 14px 28px -6px rgba(225, 29, 72, 0.22), 0 4px 12px -2px rgba(2, 132, 199, 0.15), inset 0 2px 4px rgba(255, 255, 255, 0.98), inset 0 -2px 4px rgba(225, 29, 72, 0.12)",
      border: "1.5px solid rgba(255, 255, 255, 0.95)",
    }}
  >
    <svg
      width={size * 0.74}
      height={size * 0.74}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Harmonious Rose Pink to Ocean Blue Gradient */}
        <linearGradient id="nhPetalRose" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FB7185" />
          <stop offset="0.45" stopColor="#E11D48" />
          <stop offset="1" stopColor="#0284C7" />
        </linearGradient>
        <linearGradient id="nhSideLeft" x1="4" y1="14" x2="24" y2="38" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FDA4AF" />
          <stop offset="1" stopColor="#E11D48" />
        </linearGradient>
        <linearGradient id="nhSideRight" x1="44" y1="14" x2="24" y2="38" gradientUnits="userSpaceOnUse">
          <stop stopColor="#38BDF8" />
          <stop offset="1" stopColor="#0284C7" />
        </linearGradient>
        <linearGradient id="nhSpecular" x1="12" y1="8" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="1" stopColor="#FFE4E6" stopOpacity="0.4" />
        </linearGradient>
        <filter id="nhShadowGlow" x="-25%" y="-25%" width="150%" height="150%">
          <feDropShadow dx="0" dy="2.5" stdDeviation="2.5" floodColor="#BE123C" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* Left Blooming Rose Petal */}
      <path
        d="M24 16 C16 10, 6 18, 8 28 C10 35, 18 39, 24 41 Z"
        fill="url(#nhSideLeft)"
        opacity="0.85"
      />
      {/* Right Serenity Blue Petal */}
      <path
        d="M24 16 C32 10, 42 18, 40 28 C38 35, 30 39, 24 41 Z"
        fill="url(#nhSideRight)"
        opacity="0.85"
      />

      {/* Center Lotus Leaf Petals */}
      <path
        d="M24 5 C20 13, 11 18, 11 28 C11 36, 17 42, 24 42 C31 42, 37 36, 37 28 C37 18, 28 13, 24 5 Z"
        fill="url(#nhPetalRose)"
        filter="url(#nhShadowGlow)"
      />
      {/* Inner Radiant Specular Leaf */}
      <path
        d="M24 9 C21 15, 15 19, 15 28 C15 34, 19 38, 24 38 C29 38, 33 34, 33 28 C33 19, 27 15, 24 9 Z"
        fill="url(#nhSpecular)"
      />
      {/* Core Biological Vein Line */}
      <path
        d="M24 13 L24 38 M24 23 L18 19 M24 28 L30 24 M24 32 L19 30"
        stroke="#FFFFFF"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeOpacity="0.9"
      />
      {/* Golden Micronutrient Core */}
      <circle cx="24" cy="18" r="2.4" fill="#FEF08A" />
      <circle cx="24" cy="18" r="1.2" fill="#EAB308" />
    </svg>
  </div>
);

export const PastelBadge = ({ children, variant = "blush", className = "" }) => {
  const styles = {
    blush: { bg: C.blushLight, text: C.blushDeep, border: C.blush },
    blue: { bg: C.babyBlueLight, text: C.babyBlueDeep, border: C.babyBlue },
    butter: { bg: C.butterLight, text: C.butterDeep, border: C.butter },
    lavender: { bg: C.lavenderLight, text: C.lavenderDeep, border: C.lavender },
    sage: { bg: C.sageLight, text: C.sageDeep, border: C.sage },
    peach: { bg: C.peachLight, text: C.peachDeep, border: C.peach },
  }[variant] || { bg: C.cream, text: C.plum, border: C.line };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide transition-all shadow-sm ${className}`}
      style={{
        background: styles.bg,
        color: styles.text,
        border: `1px solid ${styles.border}`,
        boxShadow: "0 2px 6px -2px rgba(2, 132, 199, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)",
      }}
    >
      {children}
    </span>
  );
};
