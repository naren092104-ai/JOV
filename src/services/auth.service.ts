import type { AppRole, AuthSession, User } from "@/types/app";

const STORAGE_KEY = "jov-fleet-auth-session";

const demoUsers: Record<AppRole, User> = {
  customer: {
    id: "customer-demo",
    name: "Priya Sharma",
    email: "priya@jovfleet.demo",
    phone: "+91 98765 43210",
    role: "customer",
    avatar: "P",
    isActive: true,
  },
  driver: {
    id: "driver-demo",
    name: "Arun Kumar",
    email: "arun@jovfleet.demo",
    phone: "+91 98765 67890",
    role: "driver",
    avatar: "AK",
    isActive: true,
  },
  admin: {
    id: "admin-demo",
    name: "JOV Fleet Admin",
    email: "ops@jovfleet.demo",
    phone: "+91 90000 10000",
    role: "admin",
    avatar: "JF",
    isActive: true,
  },
};

const buildSession = (role: AppRole): AuthSession => {
  const user = demoUsers[role];
  return {
    user,
    role,
    token: `${role}-demo-token`,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 8).toISOString(),
  };
};

export const authService = {
  async login(role: AppRole) {
    const session = buildSession(role);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    }
    return session;
  },

  async logout() {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    return true;
  },

  getSession(): AuthSession | null {
    if (typeof window === "undefined") return null;

    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    try {
      const session = JSON.parse(raw) as AuthSession;
      return session && session.user ? session : null;
    } catch {
      return null;
    }
  },

  hasAccess(requiredRole: AppRole, session: AuthSession | null): boolean {
    return Boolean(session && session.role === requiredRole);
  },
};

export const mockUsers = demoUsers;
