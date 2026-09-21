import { apiRequest, mockDelay } from "./api";
import { FOOD_DB } from "../data/foodDb";

export async function predictFood(imageFile) {
  try {
    const formData = new FormData();
    if (imageFile) {
      formData.append("image", imageFile);
    }
    return await apiRequest("/predict", {
      method: "POST",
      body: formData,
    });
  } catch (err) {
    console.warn("[NutriHer] /predict fallback to local benchmark:", err);
    await mockDelay(600);
    return {
      food: "pongal",
      food_name: "Pongal",
      confidence: 98.63,
      alternatives: [
        { food: "medu_vada", food_name: "Medu Vada", confidence: 0.47 },
        { food: "sabudana_vada", food_name: "Sabudana Vada", confidence: 0.11 },
        { food: "sabudana_khichdi", food_name: "Sabudana Khichdi", confidence: 0.1 },
        { food: "idli", food_name: "Idli", confidence: 0.1 },
      ],
    };
  }
}

export async function getNutrients(foodKey, portionGrams = 100) {
  try {
    const data = await apiRequest(`/nutrients/${encodeURIComponent(foodKey)}?portion_g=${portionGrams}`);
    return {
      label: data.label || data.food_name,
      iron: data.iron,
      vitaminC: data.vitaminC,
      calcium: data.calcium,
      protein: data.protein,
      energy: data.energy,
      sourceType: data.source_type,
      notes: data.notes,
    };
  } catch (err) {
    console.warn("[NutriHer] /nutrients fallback to local IFCT data:", err);
    await mockDelay(200);
    const base = FOOD_DB[foodKey] || FOOD_DB.pongal;
    const factor = portionGrams / 100;
    return {
      label: base.label,
      iron: +(base.iron * factor).toFixed(1),
      vitaminC: +(base.vitaminC * factor).toFixed(1),
      calcium: +(base.calcium * factor).toFixed(0),
      protein: +(base.protein * factor).toFixed(1),
      energy: +(base.energy * factor).toFixed(0),
    };
  }
}

