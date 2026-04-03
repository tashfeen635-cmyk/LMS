"use client";

import { create } from "zustand";
import type { User, UserRole } from "@/types";
import { users } from "@/lib/mock-data";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (userId: string) => void;
  loginAsRole: (role: UserRole) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  login: (userId: string) => {
    const found = users.find((u) => u.id === userId) ?? null;
    if (found) {
      document.cookie = `lms-role=${found.role};path=/;max-age=86400;SameSite=Lax`;
    } else {
      document.cookie = "lms-role=;path=/;max-age=0";
    }
    set({
      user: found,
      isAuthenticated: found !== null,
    });
  },

  loginAsRole: (role: UserRole) => {
    const found = users.find((u) => u.role === role) ?? null;
    if (found) {
      document.cookie = `lms-role=${found.role};path=/;max-age=86400;SameSite=Lax`;
    } else {
      document.cookie = "lms-role=;path=/;max-age=0";
    }
    set({
      user: found,
      isAuthenticated: found !== null,
    });
  },

  logout: () => {
    document.cookie = "lms-role=;path=/;max-age=0";
    set({
      user: null,
      isAuthenticated: false,
    });
  },
}));

export default useAuthStore;
