import { apiRequest } from "./api";

export function getPersonalizedInsight({ profile = {}, cycle = {}, dietaryIron = 0, absorbedIron = 0, target = 21 }) {
  const gap = +(target - dietaryIron).toFixed(1);
  const phaseNote =
    cycle.phase === "Menstruation"
      ? "Iron needs are typically highest during and right after your period due to blood loss."
      : cycle.phase === "Luteal"
      ? "In the luteal phase, some people notice more fatigue — keeping iron-rich meals steady can help."
      : "Your cycle phase currently carries a moderate iron requirement.";

  return {
    iron: `Your logged meal provided ${dietaryIron} mg of dietary iron today.`,
    absorption: `Based on today's meal composition, an estimated ${absorbedIron} mg may be absorbed — this is a nutritional estimate, not a clinical measurement.`,
    cycle: `You're on day ${cycle.day || 1} of your cycle — ${(cycle.phase || "follicular").toLowerCase()} phase. ${phaseNote}`,
    suggestion:
      gap > 0
        ? `You're about ${gap} mg away from your daily reference intake. Pairing iron-rich foods with vitamin-C-rich foods (like citrus, tomato, or amla) may help.`
        : `You've met your daily iron intake target for today. Nice work, ${profile.name || "there"}!`,
    disclaimer: "NutriHer provides nutritional suggestions for informational purposes only.",
  };
}

export async function fetchPersonalizedInsight({ profile, cycle, dietaryIron, absorbedIron, target }) {
  try {
    return await apiRequest("/insights", {
      method: "POST",
      body: JSON.stringify({
        profile,
        cycle,
        dietaryIron,
        absorbedIron,
        target,
        symptoms: profile?.symptoms || [],
      }),
    });
  } catch (err) {
    console.warn("[NutriHer] /insights API fallback to local template:", err);
    return getPersonalizedInsight({ profile, cycle, dietaryIron, absorbedIron, target });
  }
}

