import React, { createContext, useContext, useMemo, useState } from "react";
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("leadsphere_demo_user")) || null;
    } catch {
      return null;
    }
  });
  const login = (email, password) => {
    if (!email.trim() || !password.trim())
      return { ok: false, message: "Enter your email and password." };
    if (
      email.toLowerCase() !== "admin@leadsphere.com" ||
      password !== "admin123"
    )
      return {
        ok: false,
        message:
          "Demo credentials do not match. Use the demo account shown below.",
      };
    const nextUser = { name: "Hasti Admin", email, role: "Administrator" };
    localStorage.setItem("leadsphere_demo_user", JSON.stringify(nextUser));
    setUser(nextUser);
    return { ok: true };
  };
  const register = ({ name, email, password }) => {
    if (!name.trim() || !email.trim() || password.length < 6)
      return {
        ok: false,
        message: "Enter all fields. Password must be at least 6 characters.",
      };
    const nextUser = {
      name: name.trim(),
      email: email.trim(),
      role: "Employee",
    };
    localStorage.setItem("leadsphere_demo_user", JSON.stringify(nextUser));
    setUser(nextUser);
    return { ok: true };
  };
  const logout = () => {
    localStorage.removeItem("leadsphere_demo_user");
    setUser(null);
  };
  const value = useMemo(() => ({ user, login, register, logout }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
