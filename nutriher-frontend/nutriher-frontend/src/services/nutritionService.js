import { apiRequest, mockDelay } from "./api";

export function calculateIron(nutrients) {
  return nutrients.iron;
}

export async function calculateAbsorbedIron(nutrients) {
  try {
    const data = await apiRequest("/absorption", {
      method: "POST",
      body: JSON.stringify({
        food_name: nutrients.label || "pongal",
        portion_grams: nutrients.portion || 150,
        iron: nutrients.iron,
        vitaminC: nutrients.vitaminC,
        calcium: nutrients.calcium,
      }),
    });
    return {
      absorbed: data.absorbed,
      rate: data.rate,
      enhancers: data.enhancers || [],
      inhibitors: data.inhibitors || [],
      assumptions: data.assumptions,
    };
  } catch (err) {
    console.warn("[NutriHer] /absorption fallback to local estimation:", err);
    await mockDelay(200);
    let rate = 0.08;
    const enhancers = [];
    const inhibitors = [];

    if (nutrients.vitaminC > 15) {
      rate += 0.05;
      enhancers.push("Vitamin C");
    } else if (nutrients.vitaminC > 5) {
      rate += 0.02;
      enhancers.push("Vitamin C");
    }
    if (nutrients.calcium > 150) {
      rate -= 0.02;
      inhibitors.push("Calcium");
    }
    enhancers.push("Non-heme dietary context");
    inhibitors.push("Tea / coffee polyphenols (if consumed with meal)");

    rate = Math.max(0.03, Math.min(rate, 0.18));

    return {
      absorbed: +(nutrients.iron * rate).toFixed(2),
      rate: +(rate * 100).toFixed(1),
      enhancers,
      inhibitors,
    };
  }
}

