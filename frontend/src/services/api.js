import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

// ─── Axios instance ───────────────────────────────────────────────────────────
// Automatically attaches Bearer token from localStorage on every request
const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Auth ─────────────────────────────────────────────────────────────────────

/**
 * Register a new user.
 * @param {{ full_name, email, password, role }} data
 */
export const registerUser = (data) =>
  api.post("/auth/register", data);

/**
 * Login. Returns { token, role, full_name }.
 * @param {{ email, password }} data
 */
export const loginUser = (data) =>
  api.post("/auth/login", data);

/**
 * Get the currently logged-in user's profile.
 * Requires valid token (auto-attached).
 */
export const getMe = () =>
  api.get("/auth/me");

// ─── Sensors ──────────────────────────────────────────────────────────────────

/**
 * Register a new ESP32 sensor for the logged-in farmer.
 * @param {{ esp32_mac_address: string }} data
 */
export const registerSensor = (data) =>
  api.post("/sensors/register", data);

/**
 * Fetch all sensor readings for the logged-in farmer.
 * Returns array of { sensor: mac, graph_data: [...] }
 */
export const fetchSensorData = () =>
  api.get("/sensors/my-data");

/**
 * Fetch daily average moisture for the logged-in farmer.
 * Returns array of { date, avg_moisture }
 */
export const fetchDailyAverage = () =>
  api.get("/sensors/daily-average");

// ─── Contact ──────────────────────────────────────────────────────────────────

/**
 * Send a contact form message.
 * @param {{ name, email, subject, message }} formData
 */
export const sendContactMessage = (formData) =>
  api.post("/contact", formData);


// frontend/src/services/api.js

// ... existing imports and functions ...

/**
 * Fetch all sensors owned by the logged-in farmer (without readings).
 * Returns array of sensors with MAC, status, created_at, etc.
 */
export const fetchMySensors = () => api.get("/sensors/my-sensors");
export const deleteSensor = (sensorId) => api.delete(`/sensors/${sensorId}`);

export const updateProfile = (data) => api.patch("/user/profile", data);
export const changePassword = (data) => api.patch("/user/change-password", data);
export const deleteAccount = () => api.delete("/user/account");

export default api;