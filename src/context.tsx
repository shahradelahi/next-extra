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

/**
 * A component that provides context data to its children.
 *
 * @param props - The properties for the PageContext component.
 * @returns A JSX element that provides the context to its children.
 */
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
  /**
   * Determines context should be from the adjacent layout or not. Defaults to `true`.
   *
   * When you set this to `false`, the context is only usable on client-side after hydration.
   */
  isolate?: boolean;
}

export function usePageContext<T = Record<string, any>>(
  opts?: UsePageContextOptions & { isolate: true | undefined }
): Readonly<T>;

export function usePageContext<T = Record<string, any>>(
  opts?: UsePageContextOptions & { isolate: false }
): Readonly<T | undefined>;

export function usePageContext<T = Record<string, any>>(
  opts?: UsePageContextOptions
): Readonly<T | undefined> {
  const { isolate = true } = opts || {};

  const ctx = React.useContext(Context);

  const data = React.useMemo(() => {
    if (isolate) {
      return ctx;
    }

    if (typeof window === 'undefined') {
      return undefined;
    }

    let context = {} as T;

    for (const [s, { data }] of window.__next_c || []) {
      if (s === 'deepmerge') {
        context = deepmerge(context, data);
      } else {
        context = { ...context, ...data };
      }
    }

    return context;
  }, [isolate]);

  return data;
}
