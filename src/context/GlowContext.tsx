import React, { createContext, useContext, useState, useEffect } from 'react';
import { kelvinToRGB, KelvinColor } from '../utils/kelvinToRGB';

interface GlowContextValue {
  kelvin: number;
  setKelvin: (k: number) => void;
  color: KelvinColor;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  isPowerOn: boolean;
  setIsPowerOn: (on: boolean) => void;
}

const GlowContext = createContext<GlowContextValue | undefined>(undefined);

export const GlowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [kelvin, setKelvin] = useState<number>(3000);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isPowerOn, setIsPowerOn] = useState<boolean>(true);

  const color = kelvinToRGB(kelvin);

  useEffect(() => {
    const root = document.documentElement;
    if (isPowerOn) {
      root.style.setProperty('--glow', color.hex);
      root.style.setProperty('--glow-rgb', color.rgbString);
    } else {
      root.style.setProperty('--glow', '#3B4252');
      root.style.setProperty('--glow-rgb', '59, 66, 82');
    }
  }, [color.hex, color.rgbString, isPowerOn]);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <GlowContext.Provider
      value={{
        kelvin,
        setKelvin,
        color,
        theme,
        toggleTheme,
        isPowerOn,
        setIsPowerOn,
      }}
    >
      {children}
    </GlowContext.Provider>
  );
};

export function useGlow(): GlowContextValue {
  const ctx = useContext(GlowContext);
  if (!ctx) {
    throw new Error('useGlow must be used within a GlowProvider');
  }
  return ctx;
}
