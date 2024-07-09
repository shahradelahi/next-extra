'use client';

import deepmerge from 'deepmerge';
import React, { useContext, useMemo } from 'react';

export interface PageContextProps<T = any> {
  /** Defaults to `merge`. */
  strategy?: PageContextStrategy;
  data: T;
  children?: React.ReactNode;
}

export type Context = { [key: string]: any };

export type PageContextStrategy = 'deepmerge' | 'merge';

declare global {
  interface Window {
    __next_c?: [PageContextStrategy, { data: any }][];
  }
}

const PageContext = React.createContext<any>(null);
if (process.env['NODE_ENV'] !== 'production') {
  PageContext.displayName = 'PageContext';
}

/**
 * A component that provides context data to its children.
 *
 * @param props - The properties for the PageContext component.
 * @returns A JSX element that provides the context to its children.
 *
 * @exmaple
 * ```typescript jsx
 * import { PageContext } from 'next-extra/context';
 *
 * export default async function Layout({ children }: { children: React.ReactNode }) {
 *   // ...
 *   return <PageContext data={{ quote: 'Guillermo Rauch is a handsome dude!' }}>{children}</PageContext>;
 * }
 * ```
 */
export function PageContextProvider<T extends Context = any>(props: PageContextProps<T>) {
  const { data, strategy, children } = props;
  const serializedData = JSON.stringify([strategy ?? 'merge', { data }]);
  return (
    <PageContext.Provider value={data}>
      <script
        dangerouslySetInnerHTML={{
          __html: `(self.__next_c=self.__next_c||[]).push(${serializedData})`,
        }}
      />
      {children}
    </PageContext.Provider>
  );
}

/** Alias for `PageContextProvider`. */
export { PageContextProvider as PageContext };

export interface UsePageContextOptions {
  /**
   * Determines the hook should use the shared context from the adjacent server layout within the `PageContextProvider ` component or uses the client-side browser window.
   *
   * When you set this to false, the hook will use the context from the client-side browser window.
   */
  isolate?: boolean;
}

/**
 * This hook uses the shared context from the adjacent server layout within the `PageContextProvider ` component.
 *
 * @exmaple
 * ```typescript jsx
 * 'use client';
 *
 * import { usePageContext } from 'next-extra/context';
 *
 * export default function Page() {
 *   const ctx = usePageContext<{ name: string }>();
 *   // ...
 * }
 * ```
 */
export function usePageContext<T = Record<string, any>>(
  opts?: UsePageContextOptions & { isolate: true | undefined }
): Readonly<T>;

/** @deprecated Use `useServerInsertedContext` instead. */
export function usePageContext<T = Record<string, any>>(
  opts?: UsePageContextOptions & { isolate: false }
): Readonly<T | undefined>;

export function usePageContext<T extends Context = any>(
  opts?: UsePageContextOptions
): Readonly<T | undefined> {
  const { isolate = true } = opts ?? {};

  if (isolate) {
    return useContext<T>(PageContext);
  }

  return useServerInsertedContext<T>();
}

/**
 * This hook uses the shared context from the client-side browser window. the context is only
 * available on *client-side* after hydration.
 *
 * @exmaple
 * ```typescript jsx
 * 'use client';
 *
 * import { useServerInsertedContext } from 'next-extra/context';
 *
 * export default function Page() {
 *   const ctx = useServerInsertedContext<{ name: string }>();
 *   // ...
 * }
 * ```
 */
export function useServerInsertedContext<T extends Context = any>(): Readonly<T | undefined> {
  return useMemo<T | undefined>(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    let context = {};

    for (const [s, { data }] of window.__next_c || []) {
      if (s === 'deepmerge') {
        context = deepmerge(context, data);
      } else {
        context = { ...context, ...data };
      }
    }

    return context as T;
  }, []);
}
