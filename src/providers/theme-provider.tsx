"use client";

import { useEffect } from 'react';
import useUIStore from '@/stores/ui-store';
import { TooltipProvider } from '@/components/ui/tooltip';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { darkMode, setDarkMode } = useUIStore();

  useEffect(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) {
      setDarkMode(saved === 'true');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', String(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return <TooltipProvider>{children}</TooltipProvider>;
}
