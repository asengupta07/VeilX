"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import Cookies from "js-cookie";

interface AuthContextType {
  token: string | null;
  email: string | null;
  username: string | null;
  login: (token: string, email: string, username: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  const login = (token: string, email: string, username: string) => {
    setToken(token);
    setEmail(email);
    setUsername(username);
    Cookies.set("token", token, { expires: 7 });
    Cookies.set("email", email, { expires: 7 });
    Cookies.set("username", username, { expires: 7 });
  };

  const logout = () => {
    setToken(null);
    setEmail(null);
    setUsername(null);
    Cookies.remove("token");
    Cookies.remove("email");
    Cookies.remove("username");
  };

  useEffect(() => {
    const tokenFromCookie = Cookies.get("token");
    const emailFromCookie = Cookies.get("email");
    const usernameFromCookie = Cookies.get("username");
    if (tokenFromCookie && emailFromCookie && usernameFromCookie) {
      setToken(tokenFromCookie);
      setEmail(emailFromCookie);
      setUsername(usernameFromCookie);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ token, email, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
