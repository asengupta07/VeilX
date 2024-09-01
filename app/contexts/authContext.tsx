"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

interface AuthContextType {
  user: string | null;
  login: (token: string, userId: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("token");
    const userId = Cookies.get("userId");

    if (token && userId) {
      login(token, userId);
    }
  }, []);

  const login = (token: string, userId: string) => {
    Cookies.set("token", token);
    Cookies.set("userId", userId);
    setUser(userId);
  };

  const logout = () => {
    Cookies.remove("token");
    Cookies.remove("userId");
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
