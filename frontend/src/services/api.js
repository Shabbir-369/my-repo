import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

// ─── Axios instance ───────────────────────────────────────────────────────────
const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  console.log("API Request:", config.method?.toUpperCase(), config.url);
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const registerUser       = (data) => api.post("/auth/register", data);
export const loginUser          = (data) => api.post("/auth/login", data);
export const getMe              = ()     => api.get("/auth/me");
export const verifyEmail        = (data) => api.post("/auth/verify-email", data);
export const resendVerification = (data) => api.post("/auth/resend-verification", data);
export const forgotPassword     = (data) => api.post("/auth/forgot-password", data);
export const resetPassword      = (data) => api.post("/auth/reset-password", data);
export const verifyResetOtp     = (data) => api.post("/auth/verify-reset-otp", data);

// ─── Sensors ──────────────────────────────────────────────────────────────────
export const registerSensor   = (data)     => api.post("/sensors/register", data);
export const fetchSensorData  = ()         => api.get("/sensors/my-data");
export const fetchDailyAverage= ()         => api.get("/sensors/daily-average");
export const fetchMySensors   = ()         => api.get("/sensors/my-sensors");
export const deleteSensor     = (id)       => api.delete(`/sensors/${id}`);

// ─── User ─────────────────────────────────────────────────────────────────────
export const updateProfile    = (data) => api.patch("/user/profile", data);
export const changePassword   = (data) => api.patch("/user/change-password", data);
export const deleteAccount    = ()     => api.delete("/user/account");

// ─── Contact ──────────────────────────────────────────────────────────────────
export const sendContactMessage = (data) => api.post("/contact", data);

// ─── Analysis ─────────────────────────────────────────────────────────────────

/**
 * Farmer: upload image for analysis.
 * @param {FormData} formData  — must include fields: image (File), type ('soil'|'seed')
 */
export const uploadAnalysis = (formData) =>
  api.post("/analysis/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

/**
 * Farmer: get own analysis history.
 */
export const getMyAnalyses = () => api.get("/analysis/my");

/**
 * Expert: get pending review queue.
 */
export const getPendingQueue = () => api.get("/analysis/queue");

/**
 * Expert: get full detail of one analysis (includes sensor snapshot).
 * @param {string} id  — analysis record id
 */
export const getAnalysisDetail = (id) => api.get(`/analysis/${id}`);

/**
 * Expert: submit feedback for an analysis.
 * @param {string} id        — analysis record id
 * @param {string} feedback  — advice text
 */
export const submitFeedback = (id, feedback) =>
  api.post(`/analysis/${id}/feedback`, { feedback });

/**
 * Expert: get own submitted review history.
 */
export const getExpertHistory = () => api.get("/analysis/expert/history");

// ─── Inbox ────────────────────────────────────────────────────────────────────

/**
 * Farmer: get all expert messages in inbox.
 */
export const getFarmerMessages = () => api.get("/inbox/messages");

/**
 * Farmer: mark a message as read.
 * @param {string} id  — message id
 */
export const markMessageRead = (id) => api.patch(`/inbox/messages/${id}/read`);

/**
 * Farmer: get unread message count.
 */
export const getUnreadCount = () => api.get("/inbox/unread");

/**
 * Farmer: get notices (global + targeted).
 */
export const getFarmerNotices = () => api.get("/inbox/notices");

/**
 * Expert/Admin: send a notice to all farmers or one specific farmer.
 * @param {{ title: string, message: string, recipient_id?: string }} data
 */
export const sendNotice = (data) => api.post("/inbox/notices", data);

/**
 * Expert/Admin: get list of all farmers (for broadcast dropdown).
 */
export const getFarmersList = () => api.get("/inbox/farmers");

export default api;