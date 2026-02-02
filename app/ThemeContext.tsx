import { createContext } from 'react';

export type Theme = 'light' | 'dark' | 'blue';

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    transitionCoords?: { x: number; y: number };
    setThemeWithTransition?: (theme: Theme, coords: { x: number; y: number }) => void;
}

export const ThemeContext = createContext<ThemeContextType>({
    theme: 'light',
    setTheme: () => { },
    transitionCoords: undefined,
    setThemeWithTransition: () => { },
});

