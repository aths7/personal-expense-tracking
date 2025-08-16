'use client';

import { createContext, useContext, useState } from 'react';

interface MoodThemeContextType {
  backgroundEffects: boolean;
  setBackgroundEffects: (enabled: boolean) => void;
}

const MoodThemeContext = createContext<MoodThemeContextType | undefined>(undefined);

export const useMoodTheme = () => {
  const context = useContext(MoodThemeContext);
  if (!context) {
    throw new Error('useMoodTheme must be used within a MoodThemeProvider');
  }
  return context;
};

export function MoodThemeProvider({ children }: { children: React.ReactNode }) {
  const [backgroundEffects, setBackgroundEffects] = useState(true);

  return (
    <MoodThemeContext.Provider
      value={{
        backgroundEffects,
        setBackgroundEffects,
      }}
    >
      {children}
    </MoodThemeContext.Provider>
  );
}

// Simple mood indicator component 
export function MoodIndicator() {
  return null; // Remove mood functionality for now
}