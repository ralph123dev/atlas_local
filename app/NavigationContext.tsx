import { createContext } from 'react';

export const NavigationContext = createContext({
  push: (path: string) => {},
  replace: (path: string) => {},
});

