import React, { useState, useMemo, useCallback, useEffect } from "react";
import Shell from "./components/Shell";
import Welcome from "./pages/Welcome";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import FoodScreen from "./pages/Food";
import AbsorptionScreen from "./pages/Absorption";
import CycleScreen from "./pages/Cycle";
import SymptomScreen from "./pages/Symptoms";
import InsightsScreen from "./pages/Insights";
import ProfileScreen from "./pages/Profile";

import { getCycleData, calculateDynamicTarget } from "./services/cycleService";
import { calculateAbsorbedIron } from "./services/nutritionService";
import { getPersonalizedInsight } from "./services/insightService";

const DEMO_PROFILE = {
  name: "Ananya",
  email: "ananya@nutriher.ai",
  age: 23,
  height: 160,
  weight: 55,
  diet: "Vegetarian",
  lifecycle_status: "Regular Cycle",
  lifecycleStatus: "Regular Cycle",
  cycleLength: 28,
  lastPeriod: (() => {
    const d = new Date();
    d.setDate(d.getDate() - 17); // puts her on ~day 18 (Luteal phase)
    return d.toISOString().slice(0, 10);
  })(),
  duration: 5,
  intensity: "Moderate",
  symptoms: ["Fatigue", "Headache"],
};

const EMPTY_PROFILE = {
  name: "",
  email: "",
  age: "",
  height: "",
  weight: "",
  diet: "Vegetarian",
  lifecycle_status: "Regular Cycle",
  lifecycleStatus: "Regular Cycle",
  cycleLength: 28,
  lastPeriod: new Date().toISOString().slice(0, 10),
  duration: 5,
  intensity: "Moderate",
  symptoms: [],
};

export default function App() {
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem("nutriher_user");
      return saved ? JSON.parse(saved) : DEMO_PROFILE;
    } catch {
      return DEMO_PROFILE;
    }
  });

  const [mode, setMode] = useState(() => {
    try {
      const active = sessionStorage.getItem("nutriher_active_mode");
      if (active === "app" || active === "onboarding") return active;
      return "welcome";
    } catch {
      return "welcome";
    }
  }); // welcome | onboarding | app

  const switchMode = useCallback((newMode) => {
    setMode(newMode);
    try {
      sessionStorage.setItem("nutriher_active_mode", newMode);
    } catch {}
  }, []);

  const [page, setPage] = useState("dashboard");
  const [todaysLog, setTodaysLog] = useState([]);

  // Dynamic Menstrual Cycle Calculation
  const cycle = useMemo(
    () => getCycleData(profile.lastPeriod || new Date().toISOString(), profile.cycleLength || 28),
    [profile.lastPeriod, profile.cycleLength]
  );

  // Dynamic Context-Aware Iron Target (Updates automatically with Profile & Cycle changes)
  const dynamicTargetInfo = useMemo(
    () => calculateDynamicTarget(profile, cycle),
    [profile, cycle]
  );

  const target = dynamicTargetInfo.dietaryTargetMg;

  const dietaryIron = todaysLog.reduce((s, m) => s + (m.iron || 0), 0);
  const absorbedIron = todaysLog.reduce((s, m) => s + (m.absorbed || 0), 0);

  const insight = useMemo(
    () =>
      getPersonalizedInsight({
        profile,
        cycle,
        dietaryIron: +dietaryIron.toFixed(2),
        absorbedIron: +absorbedIron.toFixed(2),
        target,
      }),
    [profile, cycle, dietaryIron, absorbedIron, target]
  );

  const handleLogMeal = useCallback(async (meal) => {
    const abs = await calculateAbsorbedIron({
      ...meal.nutrients,
      diet: profile.diet,
      menstrual_cycle_phase: cycle.phase,
      intensity: profile.intensity,
    });
    setTodaysLog((log) => [
      ...log,
      {
        label: meal.label,
        iron: meal.iron,
        absorbed: abs.absorbed,
        rate: abs.rate,
        portion: meal.portion || 150,
        ironType: meal.nutrients?.ironType || "non-heme",
        vitaminC: meal.nutrients?.vitaminC || 0,
        calcium: meal.nutrients?.calcium || 0,
        sourceType: meal.nutrients?.sourceType || "Composite Recipe Estimation (IFCT 2017 Ingredients)",
        enhancers: abs.enhancers,
        inhibitors: abs.inhibitors,
        assumptions: abs.assumptions,
      },
    ]);
    setPage("dashboard");
  }, [profile.diet, profile.intensity, cycle.phase]);

  const handleResetDemo = useCallback(() => {
    setProfile(DEMO_PROFILE);
    try {
      localStorage.setItem("nutriher_user", JSON.stringify(DEMO_PROFILE));
      sessionStorage.setItem("nutriher_active_mode", "welcome");
    } catch {}
    setTodaysLog([]);
    setPage("dashboard");
    setMode("welcome");
  }, []);

  return (
    <>
      {mode === "welcome" && (
        <Welcome
          onStart={() => switchMode("onboarding")}
          onDemo={() => {
            handleResetDemo();
            switchMode("app");
          }}
        />
      )}

      {mode === "onboarding" && (
        <Onboarding
          profile={profile}
          setProfile={(updater) => {
            setProfile((prev) => {
              const next = typeof updater === "function" ? updater(prev) : updater;
              try {
                localStorage.setItem("nutriher_user", JSON.stringify(next));
              } catch {}
              return next;
            });
          }}
          onFinish={() => switchMode("app")}
        />
      )}

      {mode === "app" && (
        <Shell
          page={page}
          setPage={setPage}
          profile={profile}
          cycle={cycle}
          onResetDemo={handleResetDemo}
          onStartOnboarding={() => switchMode("onboarding")}
          onGoWelcome={() => switchMode("welcome")}
        >
          {page === "dashboard" && (
            <Dashboard
              profile={profile}
              cycle={cycle}
              todaysLog={todaysLog}
              target={target}
              dynamicTargetInfo={dynamicTargetInfo}
              setPage={setPage}
            />
          )}
          {page === "food" && <FoodScreen onLogMeal={handleLogMeal} />}
          {page === "absorption" && (
            <AbsorptionScreen
              todaysLog={todaysLog}
              target={target}
              dynamicTargetInfo={dynamicTargetInfo}
              profile={profile}
              cycle={cycle}
            />
          )}
          {page === "cycle" && <CycleScreen profile={profile} setProfile={setProfile} cycle={cycle} />}
          {page === "symptoms" && <SymptomScreen profile={profile} setProfile={setProfile} />}
          {page === "insights" && <InsightsScreen insight={insight} />}
          {page === "profile" && (
            <ProfileScreen
              profile={profile}
              setProfile={(updater) => {
                setProfile((prev) => {
                  const next = typeof updater === "function" ? updater(prev) : updater;
                  try {
                    localStorage.setItem("nutriher_user", JSON.stringify(next));
                  } catch {}
                  return next;
                });
              }}
              onResetDemo={handleResetDemo}
              onStartOnboarding={() => switchMode("onboarding")}
            />
          )}
        </Shell>
      )}
    </>
  );
}
