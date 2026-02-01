import { createContext } from 'react';

export type Theme = 'light' | 'dark';

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

/**
 * @Project: Atlas Local
 * @Author: Ralph <ralphurgue@gmail.com>
 * @Date: 2026-01-12
 * @Last Modified: 2026-01-24
 * @Description: Application mobile d'exploration.
 */