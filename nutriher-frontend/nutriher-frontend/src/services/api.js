// Thin fetch wrapper around the FastAPI backend.
//
// Every other file in this `services/` folder currently returns mock data
// (see the comments in each function). To go live, swap the body of each
// mock function for a call through `apiRequest`, e.g.:
//
//   export async function predictFood(imageFile) {
//     const form = new FormData();
//     form.append("image", imageFile);
//     return apiRequest("/predict", { method: "POST", body: form });
//   }
//
// No component code needs to change — every page imports from
// `services/*Service.js`, never from here directly.

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export async function apiRequest(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: options.body instanceof FormData ? undefined : { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`NutriHer API error ${res.status}: ${text || res.statusText}`);
  }
  return res.json();
}

// Small helper used by the mock services below to simulate network latency.
export const mockDelay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));
