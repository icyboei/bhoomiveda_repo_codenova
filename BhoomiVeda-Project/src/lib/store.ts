import { create } from "zustand";

interface User {
  id: string;
  mobile: string;
  name: string;
  role: string;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  checkingAuth: boolean;
  checkAuth: () => Promise<void>;
  login: (mobile: string, otp: string) => Promise<{ success: boolean; error?: string }>;
  signup: (
    name: string,
    mobile: string,
    role: string,
    otp: string
  ) => Promise<{ success: boolean; error?: string }>;
  sendOtp: (
    mobile: string,
    purpose: "login" | "signup"
  ) => Promise<{ success: boolean; otp?: string; error?: string }>;
  verifyOtp: (
    mobile: string,
    otp: string,
    purpose: "login" | "signup"
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  loading: false,
  checkingAuth: true,

  checkAuth: async () => {
    set({ checkingAuth: true });
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          set({ user: data.user, isAuthenticated: true });
        } else {
          set({ user: null, isAuthenticated: false });
        }
      } else {
        set({ user: null, isAuthenticated: false });
      }
    } catch {
      set({ user: null, isAuthenticated: false });
    } finally {
      set({ checkingAuth: false });
    }
  },

  login: async (mobile: string, otp: string) => {
    set({ loading: true });
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, otp }),
      });
      const data = await res.json();
      if (data.success) {
        set({ user: data.user, isAuthenticated: true });
        return { success: true };
      }
      return { success: false, error: data.error || "Login failed" };
    } catch {
      return { success: false, error: "Network error. Please try again." };
    } finally {
      set({ loading: false });
    }
  },

  signup: async (name: string, mobile: string, role: string, otp: string) => {
    set({ loading: true });
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, mobile, role, otp }),
      });
      const data = await res.json();
      if (data.success) {
        set({ user: data.user, isAuthenticated: true });
        return { success: true };
      }
      return { success: false, error: data.error || "Signup failed" };
    } catch {
      return { success: false, error: "Network error. Please try again." };
    } finally {
      set({ loading: false });
    }
  },

  sendOtp: async (mobile: string, purpose: "login" | "signup") => {
    set({ loading: true });
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, purpose }),
      });
      const data = await res.json();
      if (data.success) {
        return { success: true, otp: data.otp };
      }
      return { success: false, error: data.error || "Failed to send OTP" };
    } catch {
      return { success: false, error: "Network error. Please try again." };
    } finally {
      set({ loading: false });
    }
  },

  verifyOtp: async (mobile: string, otp: string, purpose: "login" | "signup") => {
    set({ loading: true });
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, otp, purpose }),
      });
      const data = await res.json();
      if (data.success) {
        return { success: true };
      }
      return { success: false, error: data.error || "Invalid OTP" };
    } catch {
      return { success: false, error: "Network error. Please try again." };
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      set({ user: null, isAuthenticated: false });
    }
  },

  setLoading: (loading: boolean) => set({ loading }),
}));
