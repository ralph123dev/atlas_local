import { createContext } from 'react';

export const NavigationContext = createContext({
  push: (path: string) => {},
  replace: (path: string) => {},
});

/**
 * @Project: Atlas Local
 * @Author: Ralph <ralphurgue@gmail.com>
 * @Date: 2026-01-12
 * @Last Modified: 2026-01-24
 * @Description: Application mobile d'exploration.
 */