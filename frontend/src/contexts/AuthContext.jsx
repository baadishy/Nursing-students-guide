import { createContext, useContext, useEffect, useState } from "react";
import { login as loginApi, signup as signupApi, setAuthToken } from "../services/api";

const TOKEN_KEY = "nursing-token";
const USER_KEY = "nursing-user";

const AuthContext = createContext({
  user: null,
  token: null,
  login: async () => {},
  signup: async () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  const login = async (payload) => {
    const res = await loginApi(payload);
    const { token: jwt, user: u } = res.data;
    setToken(jwt);
    setUser(u);
    localStorage.setItem(TOKEN_KEY, jwt);
    localStorage.setItem(USER_KEY, JSON.stringify(u));
    return res.data;
  };

  const signup = async (payload) => {
    const res = await signupApi(payload);
    return res.data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setAuthToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
