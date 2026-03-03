import { createContext, useContext, useState, useEffect } from "react";

// ─── Context ────────────────────────────────────────────────────────────────
const AuthContext = createContext(null);

// ─── Provider ───────────────────────────────────────────────────────────────
export const AuthProvider = ({ children }) => {
  const [token, setToken]   = useState(() => localStorage.getItem("token") || null);
  const [user, setUser]     = useState(() => {
    try {
      const stored = localStorage.getItem("agrisense_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Keep localStorage in sync whenever token/user changes
  useEffect(() => {
    if (token && user) {
      localStorage.setItem("token", token);
      localStorage.setItem("agrisense_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("agrisense_user");
    }
  }, [token, user]);

  /**
   * Call this after a successful login API response.
   * @param {string} newToken  - JWT from backend
   * @param {{ id, role, full_name }} userData - user info from backend
   */
  const login = (newToken, userData) => {
    setToken(newToken);
    setUser(userData);
  };

  /** Clears everything and logs the user out */
  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = Boolean(token);
  const isFarmer        = user?.role === "farmer";
  const isAdmin         = user?.role === "admin";
  const isExpert        = user?.role === "expert";

  return (
    <AuthContext.Provider
      value={{ token, user, login, logout, isAuthenticated, isFarmer, isAdmin, isExpert }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ─── Hook ────────────────────────────────────────────────────────────────────
/**
 * Use this hook anywhere you need auth data:
 *
 *   const { token, user, login, logout, isFarmer } = useAuth();
 */
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};

export default AuthContext;