import React, { useState } from "react";
import { Home, Utensils, Flower2, Sparkles, User, ShieldCheck, RotateCcw, ChevronDown, ArrowRight } from "lucide-react";
import { C, FONT_HEAD } from "../styles/tokens";
import { NutriHerLogo3D, GeometricGridTexture, CherryBlossomPetal, PastelBadge } from "./Decorations";

export const NAV_ITEMS = [
  { id: "dashboard", label: "Sanctuary", icon: Home },
  { id: "food", label: "Food Scan", icon: Utensils },
  { id: "cycle", label: "Cycle Rhythm", icon: Flower2 },
  { id: "insights", label: "Insights", icon: Sparkles },
  { id: "profile", label: "Profile", icon: User },
];

export default function Shell({ page, setPage, profile = {}, cycle = {}, onResetDemo, onStartOnboarding, onGoWelcome, children }) {
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const userName = profile?.name || "Member";
  const userInitial = userName.charAt(0).toUpperCase();
  const userEmail = profile?.email || `${userName.toLowerCase()}@nutriher.ai`;

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row relative overflow-hidden" style={{ background: "transparent" }}>
      {/* Background Geometric Texture */}
      <GeometricGridTexture />

      {/* DESKTOP SIDEBAR */}
      <aside
        className="hidden md:flex flex-col w-64 shrink-0 p-6 gap-2 soft-glass-panel border-r z-20 sticky top-0 h-screen"
        style={{ borderColor: "#D1E2F0" }}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between mb-7 px-1">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setPage("dashboard")}>
            <NutriHerLogo3D size={46} />
            <div>
              <div className="flex items-center gap-1.5">
                <span
                  style={{
                    fontFamily: FONT_HEAD,
                    fontSize: 24,
                    color: "#0F172A",
                    fontWeight: 800,
                    letterSpacing: "-0.01em",
                  }}
                >
                  NutriHer
                </span>
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" title="Sanctuary Active" />
              </div>
              <span className="block text-[10px] tracking-wider uppercase font-bold text-rose-600">
                Women's Sanctuary
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="space-y-1.5">
          {NAV_ITEMS.map((item) => {
            const active = page === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setPage(item.id)}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl w-full text-left transition-all duration-200 ${
                  active
                    ? "btn-3d text-white font-bold"
                    : "hover:bg-white/60 text-slate-700 font-medium hover:text-slate-900"
                }`}
                style={{
                  background: active ? "linear-gradient(135deg, #0284C7 0%, #E11D48 100%)" : "transparent",
                  color: active ? "#FFFFFF" : "#334155",
                }}
              >
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors"
                  style={{
                    background: active ? "rgba(255, 255, 255, 0.22)" : "rgba(225, 29, 72, 0.08)",
                    color: active ? "#FFFFFF" : "#E11D48",
                  }}
                >
                  <item.icon size={17} strokeWidth={active ? 2.5 : 2} />
                </div>
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Account & Reset Demo in Sidebar */}
        <div className="mt-auto pt-4 border-t border-slate-200/80 space-y-2">
          <div
            className="flex items-center gap-2.5 p-2 rounded-2xl bg-white/65 border border-slate-100 shadow-sm cursor-pointer hover:border-sky-300 transition-colors"
            onClick={() => setPage("profile")}
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm text-white shrink-0 shadow-sm"
              style={{ background: "linear-gradient(135deg, #FB7185 0%, #0284C7 100%)" }}
            >
              {userInitial}
            </div>
            <div className="overflow-hidden flex-1">
              <div className="text-xs font-bold text-slate-900 truncate">{userName}</div>
              <div className="text-[10px] text-slate-500 truncate">{userEmail}</div>
            </div>
          </div>

          <button
            type="button"
            onClick={onResetDemo}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-sky-700 bg-sky-50/70 hover:bg-sky-100/80 border border-sky-200 transition-colors"
          >
            <RotateCcw size={13} />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen relative z-10">
        {/* UNIFIED PERSISTENT TOP HEADER (DESKTOP & MOBILE) */}
        <header
          className="sticky top-0 z-40 px-5 md:px-10 py-3.5 flex items-center justify-between soft-glass-panel border-b backdrop-blur-xl"
          style={{ borderColor: "#D1E2F0" }}
        >
          {/* Left: Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="cursor-pointer flex items-center gap-2.5" onClick={() => setPage("dashboard")}>
              <NutriHerLogo3D size={38} />
              <div>
                <div className="flex items-center gap-1.5">
                  <span
                    style={{
                      fontFamily: FONT_HEAD,
                      fontSize: 21,
                      color: "#0F172A",
                      fontWeight: 800,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    NutriHer
                  </span>
                  <span className="hidden sm:inline-block text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                    Sanctuary
                  </span>
                </div>
                <span className="block text-[9px] font-bold tracking-wider uppercase text-sky-700">
                  AI-Assisted Nutrition
                </span>
              </div>
            </div>
          </div>

          {/* Center: Cycle Status Badge */}
          <div className="hidden md:flex items-center gap-2">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-sm"
              style={{ background: "#FFF0F4", color: "#E11D48", border: "1px solid #FECDD3" }}
            >
              <CherryBlossomPetal size={13} color="#E11D48" />
              <span>Day {cycle?.day || 1} · {cycle?.phase || "Menstruation"} Phase</span>
            </span>
            <span
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold text-slate-700"
              style={{ background: "#E0F2FE", border: "1px solid #BAE6FD" }}
            >
              {profile?.lifecycle_status || profile?.lifecycleStatus || "Regular Cycle"}
            </span>
          </div>

          {/* Right: Account & Action Controls */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setPage("food")}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-white shadow-sm transition-transform hover:scale-105"
              style={{ background: "linear-gradient(135deg, #0284C7 0%, #0369A1 100%)" }}
            >
              <Utensils size={13} />
              <span>Scan Food</span>
            </button>

            {/* User Chip & Account Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowAccountMenu((v) => !v)}
                className="flex items-center gap-2 p-1 sm:px-3 sm:py-1.5 rounded-full bg-white/90 border border-slate-200 shadow-sm hover:border-sky-300 transition-all"
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs text-white shadow-sm"
                  style={{ background: "linear-gradient(135deg, #FB7185 0%, #0284C7 100%)" }}
                >
                  {userInitial}
                </div>
                <span className="hidden sm:inline-block text-xs font-bold text-slate-800">{userName}</span>
                <ChevronDown size={13} className="text-slate-400 hidden sm:inline-block" />
              </button>

              {/* Account Dropdown */}
              {showAccountMenu && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-2xl p-3 soft-ceramic-card shadow-2xl z-50 animate-fade-in border border-slate-200"
                  style={{ background: "rgba(255, 255, 255, 0.98)" }}
                >
                  <div className="pb-2.5 border-b border-slate-100 mb-2">
                    <div className="text-xs font-bold text-slate-900">{userName}</div>
                    <div className="text-[11px] text-slate-500 truncate">{userEmail}</div>
                    <div className="mt-1.5 inline-block text-[10px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100">
                      {profile?.lifecycle_status || "Regular Cycle"}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAccountMenu(false);
                        setPage("profile");
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors text-left"
                    >
                      <User size={14} className="text-sky-600" />
                      <span>Edit Health Profile</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setShowAccountMenu(false);
                        onResetDemo && onResetDemo();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors text-left"
                    >
                      <RotateCcw size={14} className="text-sky-600" />
                      <span>Reset Demo Data</span>
                    </button>

                    {onStartOnboarding && (
                      <button
                        type="button"
                        onClick={() => {
                          setShowAccountMenu(false);
                          onStartOnboarding();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors text-left"
                      >
                        <ArrowRight size={14} className="text-emerald-600" />
                        <span>Retake Guided Onboarding</span>
                      </button>
                    )}

                    {onGoWelcome && (
                      <div className="pt-1.5 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => {
                            setShowAccountMenu(false);
                            onGoWelcome();
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors text-left"
                        >
                          <Sparkles size={14} className="text-amber-500" />
                          <span>View Welcome Overview</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 px-5 md:px-10 pt-6 md:pt-8 pb-28 md:pb-10 max-w-5xl w-full mx-auto">
          {children}
        </main>

        {/* Mobile Bottom Navigation */}
        <nav
          className="md:hidden fixed bottom-0 left-0 right-0 flex justify-around py-2.5 soft-glass-panel border-t z-50 shadow-xl"
          style={{ borderColor: "#D1E2F0" }}
        >
          {NAV_ITEMS.map((item) => {
            const active = page === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setPage(item.id)}
                className="flex flex-col items-center gap-1 px-3 py-1 transition-transform active:scale-95"
                style={{ color: active ? "#E11D48" : "#64748B" }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
                  style={{
                    background: active ? "rgba(225, 29, 72, 0.12)" : "transparent",
                    color: active ? "#E11D48" : "#64748B",
                  }}
                >
                  <item.icon size={18} strokeWidth={active ? 2.5 : 1.8} />
                </div>
                <span className={`text-[10px] ${active ? "font-bold text-rose-600" : "font-medium"}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
