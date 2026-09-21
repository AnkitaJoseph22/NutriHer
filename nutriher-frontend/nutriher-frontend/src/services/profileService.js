import { apiRequest } from "./api";

export async function saveProfile(profile) {
  try {
    const res = await apiRequest("/profile", {
      method: "POST",
      body: JSON.stringify(profile),
    });
    return res.profile || profile;
  } catch (err) {
    console.warn("[NutriHer] /profile save fallback to memory:", err);
    return profile;
  }
}

export async function loadProfile() {
  try {
    return await apiRequest("/profile");
  } catch (err) {
    console.warn("[NutriHer] /profile load fallback:", err);
    return null;
  }
}
