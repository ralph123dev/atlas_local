import { createContext } from 'react';

export const NavigationContext = createContext({
  push: (path: string, params?: any) => { },
  replace: (path: string, params?: any) => { },
  params: {} as any,
});

