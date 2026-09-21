import React, { useState } from "react";
import { X, Lock, Mail, User, Sparkles, Heart, ArrowRight, ShieldCheck } from "lucide-react";
import { NutriHerLogo3D, PastelBadge } from "./Decorations";
import { C, FONT_HEAD, FONT_BODY } from "../styles/tokens";

export default function AuthModal({ isOpen, onClose, onLogin, onRegister, initialTab = "login" }) {
  const [tab, setTab] = useState(initialTab); // "login" | "register"

  // Login fields
  const [loginEmail, setLoginEmail] = useState("ananya@example.com");
  const [loginPassword, setLoginPassword] = useState("password123");

  // Register fields
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regAge, setRegAge] = useState(24);
  const [regLifecycle, setRegLifecycle] = useState("Regular Cycle");
  const [regDiet, setRegDiet] = useState("Vegetarian");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const cleanEmail = (loginEmail || "").trim();
    if (!cleanEmail) {
      setError("Please enter your email address.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setError("Please enter a valid email address (e.g. name@example.com).");
      return;
    }
    if (!loginPassword) {
      setError("Please enter your password.");
      return;
    }
    setLoading(true);
    try {
      const res = await onLogin({
        email: cleanEmail,
        password: loginPassword,
      });
      if (res && res.success === false) {
        setError(res.message || "Login failed");
      }
    } catch (err) {
      setError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!regName.trim()) {
      setError("Please enter your full name.");
      return;
    }
    const cleanEmail = (regEmail || "").trim();
    if (!cleanEmail) {
      setError("Please enter your email address.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setError("Please enter a valid email address (e.g. priya@example.com).");
      return;
    }
    if (!regPassword || regPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    setLoading(true);
    try {
      const res = await onRegister({
        name: regName.trim(),
        email: cleanEmail,
        password: regPassword,
        age: Number(regAge) || 24,
        lifecycle_status: regLifecycle,
        lifecycleStatus: regLifecycle,
        diet: regDiet,
      });
      if (res && res.success === false) {
        setError(res.message || "Registration failed");
      }
    } catch (err) {
      setError(err?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = () => {
    setError("");
    onLogin({
      email: "ananya@nutriher.ai",
      password: "password123",
      name: "Ananya",
      isDemo: true,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-md rounded-3xl p-6 sm:p-8 soft-ceramic-card overflow-hidden shadow-2xl"
        style={{
          background: "linear-gradient(165deg, rgba(255, 255, 255, 0.98) 0%, rgba(240, 247, 254, 0.95) 100%)",
          border: "1.5px solid #D1E2F0",
          boxShadow: "0 25px 60px -15px rgba(2, 132, 199, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.9)",
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X size={18} />
        </button>

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <NutriHerLogo3D size={56} className="mb-2" />
          <h3
            style={{ fontFamily: FONT_HEAD, color: "#0F172A", fontWeight: 800 }}
            className="text-2xl sm:text-3xl tracking-tight"
          >
            NutriHer Sanctuary
          </h3>
          <p className="text-xs text-slate-600 mt-0.5">
            Your personalized women's nutrition & biological rhythm portal
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700 flex items-center justify-between animate-fade-in">
            <span>⚠️ {error}</span>
            <button
              type="button"
              onClick={() => setError("")}
              className="text-rose-400 hover:text-rose-700 ml-2 font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* Tab Switcher */}
        <div
          className="flex rounded-2xl p-1 mb-6"
          style={{ background: "rgba(2, 132, 199, 0.08)", border: "1px solid #D1E2F0" }}
        >
          <button
            type="button"
            onClick={() => setTab("login")}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              tab === "login"
                ? "bg-white text-sky-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => setTab("register")}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              tab === "register"
                ? "bg-white text-rose-600 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Tab 1: Log In Form */}
        {tab === "login" && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-3d w-full py-3 rounded-full text-sm font-bold text-white shadow-md flex items-center justify-center gap-2"
              style={{ background: "linear-gradient(135deg, #0284C7 0%, #0369A1 100%)" }}
            >
              <span>Log In to Sanctuary</span>
              <ArrowRight size={15} />
            </button>

            <div className="relative flex items-center justify-center my-3">
              <div className="border-t border-slate-200 w-full" />
              <span className="bg-white px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider absolute">
                or
              </span>
            </div>

            <button
              type="button"
              onClick={handleQuickDemo}
              className="w-full py-2.5 rounded-full text-xs font-bold border border-rose-200 text-rose-600 bg-rose-50/60 hover:bg-rose-100/60 transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <Sparkles size={14} className="text-amber-500" />
              <span>One-Click Demo Sign In (Ananya, Day 18)</span>
            </button>
          </form>
        )}

        {/* Tab 2: Create Account Form */}
        {tab === "register" && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Your Name</label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="priya@example.com"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Age (Years)</label>
                <input
                  type="number"
                  min="10"
                  max="99"
                  value={regAge}
                  onChange={(e) => setRegAge(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Lifecycle Stage</label>
              <select
                value={regLifecycle}
                onChange={(e) => setRegLifecycle(e.target.value)}
                className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
              >
                <option value="Regular Cycle">Regular Cycle (Menstruation Rhythms)</option>
                <option value="Pregnant">Pregnant (27 mg RDA, MoHFW IFA Protocol)</option>
                <option value="Lactating">Lactating (23 mg RDA, 0–12 months)</option>
                <option value="Post-Menopausal">Post-Menopausal (15 mg RDA, 60+ yrs)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Dietary Pattern</label>
              <select
                value={regDiet}
                onChange={(e) => setRegDiet(e.target.value)}
                className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
              >
                <option value="Vegetarian">Vegetarian (8% ICMR-NIN Baseline)</option>
                <option value="Non-Vegetarian">Non-Vegetarian (14% Mixed Bioavailability)</option>
                <option value="Eggetarian">Eggetarian (10% Bioavailability)</option>
                <option value="Vegan">Vegan (8% Plant Bioavailability)</option>
              </select>
            </div>

            <button
              type="submit"
              className="btn-3d w-full py-3 rounded-full text-sm font-bold text-white shadow-md flex items-center justify-center gap-2 mt-2"
              style={{ background: "linear-gradient(135deg, #E11D48 0%, #BE123C 100%)" }}
            >
              <span>Create Account & Enter</span>
              <ArrowRight size={15} />
            </button>
          </form>
        )}

        <div className="mt-5 text-center">
          <span className="text-[10px] text-slate-500 flex items-center justify-center gap-1">
            <ShieldCheck size={12} className="text-emerald-500" />
            <span>Private & Encrypted Local Session · ICMR-NIN 2020 Aligned</span>
          </span>
        </div>
      </div>
    </div>
  );
}
