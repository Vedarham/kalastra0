import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getMe, refreshToken } from "../api/auth.ts";
import { setAccessToken } from "@/api/interceptor.ts";

type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  phone?: string;
  bio?: string;
};

type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  loadUser: () => Promise<void>;
  isAuthLoading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const loadUser = useCallback(async () => {
    try {
      const res = await getMe();
      setUser(res.data.user);
    } catch {
      setUser(null);
    } finally {
      setIsAuthLoading(false);
    }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
    try {
      const res = await refreshToken();
      setAccessToken(res.data.accessToken);
      await loadUser();
    } catch {
      setUser(null);
      setIsAuthLoading(false);
    }
  };

    initAuth();
  }, [loadUser]);

  return (
    <AuthContext.Provider value={{ user, setUser, loadUser, isAuthLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};