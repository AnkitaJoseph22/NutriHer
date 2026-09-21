import { apiRequest } from "./api";

const DEFAULT_ACCOUNTS = {
  "ananya@nutriher.ai": {
    name: "Ananya",
    email: "ananya@nutriher.ai",
    password: "password123",
    age: 23,
    height: 160,
    weight: 55,
    diet: "Vegetarian",
    lifecycle_status: "Regular Cycle",
    lifecycleStatus: "Regular Cycle",
    cycleLength: 28,
    duration: 5,
    intensity: "Moderate",
    symptoms: ["Fatigue", "Headache"],
  },
  "ananya@example.com": {
    name: "Ananya",
    email: "ananya@example.com",
    password: "password123",
    age: 23,
    height: 160,
    weight: 55,
    diet: "Vegetarian",
    lifecycle_status: "Regular Cycle",
    lifecycleStatus: "Regular Cycle",
    cycleLength: 28,
    duration: 5,
    intensity: "Moderate",
    symptoms: ["Fatigue", "Headache"],
  },
};

export function getStoredAccounts() {
  try {
    const raw = localStorage.getItem("nutriher_accounts");
    if (!raw) {
      localStorage.setItem("nutriher_accounts", JSON.stringify(DEFAULT_ACCOUNTS));
      return { ...DEFAULT_ACCOUNTS };
    }
    return { ...DEFAULT_ACCOUNTS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_ACCOUNTS };
  }
}

export function saveStoredAccount(account) {
  try {
    const accounts = getStoredAccounts();
    const key = (account.email || "").toLowerCase().trim();
    if (key) {
      accounts[key] = { ...account };
      localStorage.setItem("nutriher_accounts", JSON.stringify(accounts));
    }
  } catch (err) {
    console.warn("[NutriHer] Failed saving account to localStorage:", err);
  }
}

export async function loginUser({ email, password }) {
  const cleanEmail = (email || "").toLowerCase().trim();
  const cleanPassword = password || "";

  if (!cleanEmail) {
    return { success: false, message: "Please enter your email address." };
  }
  if (!cleanPassword) {
    return { success: false, message: "Please enter your password." };
  }

  // 1. Try Backend API first
  try {
    const res = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: cleanEmail, password: cleanPassword }),
    });
    if (res && res.status === "ok" && res.user) {
      saveStoredAccount(res.user);
      localStorage.setItem("nutriher_user", JSON.stringify(res.user));
      return { success: true, user: res.user };
    }
    if (res && res.status === "error") {
      return { success: false, message: res.message || "Invalid email or password." };
    }
  } catch (err) {
    console.warn("[NutriHer] Backend /auth/login unavailable, checking local accounts store:", err);
  }

  // 2. Client-side storage fallback
  const accounts = getStoredAccounts();
  const existing = accounts[cleanEmail];
  if (existing) {
    if (existing.password && cleanPassword && existing.password !== cleanPassword) {
      return { success: false, message: "Incorrect password. Please try again." };
    }
    localStorage.setItem("nutriher_user", JSON.stringify(existing));
    return { success: true, user: existing };
  }

  return {
    success: false,
    message: "No account found with this email. Please create an account first or try Quick Demo.",
  };
}

export async function registerUser(userData) {
  const cleanEmail = (userData.email || "").toLowerCase().trim();
  if (!cleanEmail) {
    return { success: false, message: "Email is required." };
  }

  const record = {
    ...userData,
    email: cleanEmail,
    name: userData.name || cleanEmail.split("@")[0].charAt(0).toUpperCase() + cleanEmail.split("@")[0].slice(1),
    password: userData.password || "password123",
    age: Number(userData.age) || 24,
    height: Number(userData.height) || 160,
    weight: Number(userData.weight) || 55,
    diet: userData.diet || "Vegetarian",
    lifecycle_status: userData.lifecycle_status || userData.lifecycleStatus || "Regular Cycle",
    lifecycleStatus: userData.lifecycle_status || userData.lifecycleStatus || "Regular Cycle",
    cycleLength: Number(userData.cycleLength) || 28,
    duration: Number(userData.duration) || 5,
    intensity: userData.intensity || "Moderate",
    symptoms: userData.symptoms || [],
  };

  // 1. Check local accounts for duplicate
  const accounts = getStoredAccounts();
  if (accounts[cleanEmail] && cleanEmail !== "ananya@nutriher.ai" && cleanEmail !== "ananya@example.com") {
    return { success: false, message: "An account with this email already exists. Please log in." };
  }

  // 2. Try backend
  try {
    const res = await apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(record),
    });
    if (res && res.status === "error") {
      return { success: false, message: res.message || "Registration failed." };
    }
    if (res && res.status === "ok" && res.user) {
      saveStoredAccount(res.user);
      localStorage.setItem("nutriher_user", JSON.stringify(res.user));
      return { success: true, user: res.user };
    }
  } catch (err) {
    console.warn("[NutriHer] Backend /auth/register fallback:", err);
  }

  saveStoredAccount(record);
  localStorage.setItem("nutriher_user", JSON.stringify(record));
  return { success: true, user: record };
}

export function logoutUser() {
  try {
    localStorage.removeItem("nutriher_user");
  } catch {}
}
