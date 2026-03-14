"use client";

import { create } from "zustand";

interface UIState {
  sidebarCollapsed: boolean;
  sidebarMobileOpen: boolean;
  darkMode: boolean;
  focusMode: boolean;
  toggleSidebar: () => void;
  setSidebarMobileOpen: (open: boolean) => void;
  toggleDarkMode: () => void;
  toggleFocusMode: () => void;
  setDarkMode: (dark: boolean) => void;
}

const useUIStore = create<UIState>((set) => ({
  sidebarCollapsed: false,
  sidebarMobileOpen: false,
  darkMode: false,
  focusMode: false,

  toggleSidebar: () => {
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed }));
  },

  setSidebarMobileOpen: (open: boolean) => {
    set({ sidebarMobileOpen: open });
  },

  toggleDarkMode: () => {
    set((state) => {
      const next = !state.darkMode;
      if (typeof document !== "undefined") {
        document.documentElement.classList.toggle("dark", next);
      }
      return { darkMode: next };
    });
  },

  toggleFocusMode: () => {
    set((state) => ({ focusMode: !state.focusMode }));
  },

  setDarkMode: (dark: boolean) => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", dark);
    }
    set({ darkMode: dark });
  },
}));

export default useUIStore;
