import { authService } from "@/services/auth.service";
import type { AppRole, AuthSession, User } from "@/types/app";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

interface AppContextValue {
  session: AuthSession | null;
  user: User | null;
  isAuthenticated: boolean;
  role: AppRole | null;
  login: (role: AppRole) => Promise<AuthSession>;
  logout: () => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);

  useEffect(() => {
    setSession(authService.getSession());
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!session) return;

    window.localStorage.setItem("jov-fleet-auth-session", JSON.stringify(session));
  }, [session]);

  const value = useMemo<AppContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      isAuthenticated: Boolean(session),
      role: session?.role ?? null,
      login: async (role: AppRole) => {
        const nextSession = await authService.login(role);
        setSession(nextSession);
        return nextSession;
      },
      logout: async () => {
        await authService.logout();
        setSession(null);
      },
    }),
    [session],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext(): AppContextValue {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("AppContext provider is required.");
  }
  return context;
}
