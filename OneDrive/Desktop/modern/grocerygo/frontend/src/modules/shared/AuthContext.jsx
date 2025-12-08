import React, { createContext, useContext, useEffect, useState } from "react";
import { fetchJSON } from "./useApi";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("grocerygo_user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem("grocerygo_token") || null);

  useEffect(() => {
    if (user) localStorage.setItem("grocerygo_user", JSON.stringify(user));
    else localStorage.removeItem("grocerygo_user");
  }, [user]);

  useEffect(() => {
    if (token) localStorage.setItem("grocerygo_token", token);
    else localStorage.removeItem("grocerygo_token");
  }, [token]);

  const logout = () => { setUser(null); setToken(null); };

  const register = async (payload) => {
    const data = await fetchJSON("/users/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return data;
  };


  const loginSendOtp = async (payload) => {
    const data = await fetchJSON("/users/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return data;
  };


  const verifyOtp = async ({ email, otp }) => {
    const data = await fetchJSON("/users/verify-login", {
      method: "POST",
      body: JSON.stringify({ email, otp }),
    });

    if (data.token) {
      setToken(data.token);
      setUser(data.user);
    }
    return data;
  };

  const authFetch = async (path, options = {}) => {
    const headers = { ...(options.headers || {}) };
    if (token) headers.Authorization = `Bearer ${token}`;
    return fetchJSON(path, { ...options, headers });
  };

  return (
    <AuthContext.Provider value={{ user, token, register, loginSendOtp, verifyOtp, authFetch, logout, setUser, setToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
