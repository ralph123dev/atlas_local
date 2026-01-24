import { createContext } from 'react';

export type Theme = 'light' | 'dark' | 'blue';

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

export const ThemeContext = createContext<ThemeContextType>({
    theme: 'light',
    setTheme: () => { },
});
