'use client';

import deepmerge from 'deepmerge';
import React from 'react';

export interface PageContextProps<T = any> {
  /** Defaults to `merge`. */
  strategy?: PageContextStrategy;
  data: T;
  children?: React.ReactNode;
}

export type PageContextStrategy = 'deepmerge' | 'merge';

declare global {
  interface Window {
    __next_c?: [PageContextStrategy, { data: any }][];
  }
}

const Context = React.createContext<any>(null);

export function PageContext<T = any>({ data, strategy, children }: PageContextProps<T>) {
  const serializedData = JSON.stringify([strategy ?? 'merge', { data }]);
  return (
    <Context.Provider value={data}>
      <script
        dangerouslySetInnerHTML={{
          __html: `(self.__next_c=self.__next_c||[]).push(${serializedData})`,
        }}
      />
      {children}
    </Context.Provider>
  );
}

export interface UsePageContextOptions {
  /** Determines if the context should be isolated to the window. Defaults to `false`. */
  isolate?: boolean;
}

export function usePageContext<T = Record<string, any>>(opts: UsePageContextOptions = {}): T {
  const { isolate = false } = opts;

  if (typeof window === 'undefined' || isolate) {
    // Probably Pre-rendering or StaticGeneration
    return React.useContext(Context);
  }

  const data = React.useMemo(() => {
    let context = {} as T;

    for (const [s, { data }] of window.__next_c || []) {
      if (s === 'deepmerge') {
        context = deepmerge(context, data);
      } else {
        context = { ...context, ...data };
      }
    }

    return context;
  }, []);

  return data;
}
