import React from "react";
import { ArrowRight, Sparkles, Utensils, Heart, ShieldCheck, Activity, Compass } from "lucide-react";
import { C, FONT_HEAD, FONT_BODY } from "../styles/tokens";
import { Body, PrimaryButton } from "../components/ui";
import {
  NutriHerLogo3D,
  FloatingGlassOrb,
  GeometricGridTexture,
  CherryBlossomPetal,
  BotanicalBranch,
  PastelBadge,
} from "../components/Decorations";

export default function Welcome({ onStart, onDemo }) {
  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center px-5 py-12 text-center relative overflow-hidden select-none"
      style={{
        background: `radial-gradient(circle at 18% 18%, rgba(2, 132, 199, 0.18) 0%, transparent 45%),
                     radial-gradient(circle at 82% 16%, rgba(99, 102, 241, 0.16) 0%, transparent 48%),
                     radial-gradient(circle at 50% 88%, rgba(225, 29, 72, 0.10) 0%, transparent 50%),
                     linear-gradient(180deg, #F0F6FC 0%, #E6F1FA 60%, #EEF6FC 100%)`,
      }}
    >
      {/* Background Texture & 3D Glass Orbs */}
      <GeometricGridTexture />

      <FloatingGlassOrb
        size={96}
        color="blue"
        className="absolute -top-10 -left-10 opacity-70 animate-orb-drift"
      />
      <FloatingGlassOrb
        size={130}
        color="cyan"
        className="absolute -bottom-16 -right-16 opacity-65 animate-orb-drift"
        style={{ animationDelay: "4s" }}
      />
      <FloatingGlassOrb
        size={54}
        color="rose"
        className="absolute top-1/4 right-[10%] opacity-55 animate-float-slow"
        style={{ animationDelay: "2s" }}
      />
      <FloatingGlassOrb
        size={46}
        color="blue"
        className="absolute bottom-1/3 left-[8%] opacity-60 animate-float-slow"
        style={{ animationDelay: "3s" }}
      />

      <div className="relative z-10 max-w-2xl flex flex-col items-center">
        {/* FIRST THING YOU SEE: NUTRIHER 3D BRAND HERO */}
        <div className="flex flex-col items-center mb-6">
          <div className="animate-float-slow mb-3 drop-shadow-xl">
            <NutriHerLogo3D size={88} />
          </div>

          <h1
            style={{
              fontFamily: FONT_HEAD,
              color: "#0F172A",
              fontWeight: 800,
              letterSpacing: "-0.02em",
            }}
            className="text-5xl sm:text-6xl md:text-7xl leading-none mb-2"
          >
            NutriHer
          </h1>

          <div className="flex items-center gap-2 mt-1">
            <PastelBadge variant="blue" className="px-4 py-1 text-xs">
              <Compass size={13} color={C.oceanBlueDeep} />
              <span className="font-semibold tracking-wide">
                AI-Assisted Women's Nutrition & Bioavailable Iron Optimization
              </span>
            </PastelBadge>
          </div>
        </div>

        {/* Human Design Headline & Value Premise */}
        <h2
          style={{ fontFamily: FONT_HEAD, color: "#1E293B", fontWeight: 600 }}
          className="text-2xl sm:text-3xl md:text-4xl mb-4 leading-tight"
        >
          Nourish Your Body in Harmony with Your Cycle.
        </h2>

        <div className="flex items-center justify-center gap-3 my-1 opacity-75">
          <BotanicalBranch width={60} height={25} />
          <CherryBlossomPetal size={18} color={C.blushDeep} />
          <BotanicalBranch width={60} height={25} style={{ transform: "scaleX(-1)" }} />
        </div>

        <p
          className="text-sm sm:text-base md:text-lg mb-8 leading-relaxed max-w-lg"
          style={{ fontFamily: FONT_BODY, color: "#334155" }}
        >
          Standard nutrition trackers assume flat daily targets and 100% absorption.{" "}
          <strong style={{ color: "#0F172A" }}>NutriHer</strong> personalizes your nutritional targets dynamically
          across each menstrual phase, evaluating meal-level bioavailability and chemical enhancers to combat latent iron deficiency.
        </p>

        {/* 3D Elevated Feature Showcase Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full mb-9">
          <div
            className="rounded-2xl p-3.5 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            style={{
              background: "rgba(255, 255, 255, 0.85)",
              border: "1px solid rgba(255, 255, 255, 0.95)",
              boxShadow: "0 10px 25px -8px rgba(2, 132, 199, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.9)",
            }}
          >
            <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-2" style={{ background: C.oceanBlueLight }}>
              <Utensils size={16} color={C.oceanBlueDeep} />
            </div>
            <div className="text-xs font-bold" style={{ color: "#0F172A" }}>80 Indian Dishes</div>
            <div className="text-[10px] mt-0.5" style={{ color: "#64748B" }}>EfficientNet-B0 Vision</div>
          </div>

          <div
            className="rounded-2xl p-3.5 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            style={{
              background: "rgba(255, 255, 255, 0.85)",
              border: "1px solid rgba(255, 255, 255, 0.95)",
              boxShadow: "0 10px 25px -8px rgba(99, 102, 241, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.9)",
            }}
          >
            <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-2" style={{ background: C.lavenderLight }}>
              <Activity size={16} color={C.lavenderDeep} />
            </div>
            <div className="text-xs font-bold" style={{ color: "#0F172A" }}>Absorption Engine</div>
            <div className="text-[10px] mt-0.5" style={{ color: "#64748B" }}>Non-Heme vs Heme</div>
          </div>

          <div
            className="rounded-2xl p-3.5 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            style={{
              background: "rgba(255, 255, 255, 0.85)",
              border: "1px solid rgba(255, 255, 255, 0.95)",
              boxShadow: "0 10px 25px -8px rgba(225, 29, 72, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.9)",
            }}
          >
            <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-2" style={{ background: C.blushLight }}>
              <Heart size={16} color={C.blushDeep} />
            </div>
            <div className="text-xs font-bold" style={{ color: "#0F172A" }}>Cycle Dynamics</div>
            <div className="text-[10px] mt-0.5" style={{ color: "#64748B" }}>Phase-Specific Targets</div>
          </div>

          <div
            className="rounded-2xl p-3.5 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            style={{
              background: "rgba(255, 255, 255, 0.85)",
              border: "1px solid rgba(255, 255, 255, 0.95)",
              boxShadow: "0 10px 25px -8px rgba(22, 163, 74, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.9)",
            }}
          >
            <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-2" style={{ background: C.sageLight }}>
              <ShieldCheck size={16} color={C.sageDeep} />
            </div>
            <div className="text-xs font-bold" style={{ color: "#0F172A" }}>ICMR-NIN 2020</div>
            <div className="text-[10px] mt-0.5" style={{ color: "#64748B" }}>IFCT 2017 Assays</div>
          </div>
        </div>

        {/* Action Buttons: Initial Onboarding Flow */}
        <div className="flex flex-col gap-3 items-center w-full max-w-sm sm:max-w-md">
          <button
            onClick={onStart}
            type="button"
            className="btn-3d flex items-center justify-center gap-2.5 rounded-full px-7 py-3.5 font-bold text-sm text-white w-full shadow-lg transition-all duration-300 hover:scale-[1.02]"
            style={{
              background: "linear-gradient(135deg, #0284C7 0%, #0369A1 100%)",
            }}
          >
            <span>Begin Guided Onboarding</span>
            <ArrowRight size={17} />
          </button>

          <button
            onClick={onDemo}
            type="button"
            className="flex items-center justify-center gap-2 rounded-full px-6 py-2.5 font-semibold text-xs w-full transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0.5 shadow-sm"
            style={{
              background: "rgba(255, 255, 255, 0.95)",
              color: "#334155",
              border: "1px solid #D1E2F0",
              boxShadow: "0 6px 16px -4px rgba(2, 132, 199, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.9)",
            }}
          >
            <Sparkles size={14} color="#CA8A04" />
            <span>Instant Demo Mode (Ananya, Day 18)</span>
          </button>
        </div>

        {/* Academic Prototype Notice */}
        <div className="mt-7 text-[11px] font-medium" style={{ color: "#64748B" }}>
          NutriHer Academic Research & Engineering Demonstration · Non-Diagnostic Educational Model
        </div>
      </div>
    </div>
  );
}
