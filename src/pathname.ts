import {
  staticGenerationAsyncStorage as _staticGenerationAsyncStorage,
  type StaticGenerationAsyncStorage,
} from 'next/dist/client/components/static-generation-async-storage.external';
import { headers } from 'next/headers';

import { ReadonlyURLSearchParams } from './utils/search-params';

function getExpectedStaticGenerationStore(callingExpression: string) {
  const staticGenerationStore =
    ((fetch as any).__nextGetStaticStore?.() as StaticGenerationAsyncStorage | undefined) ??
    _staticGenerationAsyncStorage;

  const store = staticGenerationStore.getStore();
  if (!store) {
    throw new Error(
      `Invariant: \`${callingExpression}\` expects to have staticGenerationAsyncStorage, none available.`
    );
  }

  return store;
}

function getRequestOrigin() {
  const requestHeaders = headers();
  const protocol = requestHeaders.get('x-forwarded-proto') || 'http';
  const host =
    requestHeaders.get('x-forwarded-host') || requestHeaders.get('host') || 'localhost:3000';
  return `${protocol}://${host}`;
}

function getRequestURL(callingExpression: string): URL {
  const store = getExpectedStaticGenerationStore(callingExpression);
  const origin = getRequestOrigin();
  return new URL(store.urlPathname, origin);
}

/** @deprecated This method will be removed in the next major release. */
export function invokeUrl(): URL {
  return getRequestURL('invokeUrl');
}

/**
 * A [Server Component](https://nextjs.org/docs/app/building-your-application/rendering/server-components) method
 * that lets you read the current URL's pathname.
 *
 * @example
 * ```ts
 * import { pathname } from 'next-extra/pathname'
 *
 * export default async function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
 *  const route = pathname() // returns "/dashboard" on /dashboard?foo=bar
 *  // ...
 * }
 * ```
 */
export function pathname(): string {
  const expression = 'pathname';
  const url = getRequestURL(expression);

  return url.pathname;
}

/**
 * A [Server Component](https://nextjs.org/docs/app/building-your-application/rendering/server-components) method
 * that lets you *read* the current URL's search parameters.
 *
 * Learn more about [`URLSearchParams` on MDN](https://developer.mozilla.org/docs/Web/API/URLSearchParams)
 *
 * @example
 * ```ts
 * import { searchParams } from 'next-extra/pathname'
 *
 * export default async function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
 *  const params = searchParams()
 *  params.get('foo') // returns 'bar' when ?foo=bar
 *  // ...
 * }
 * ```
 */
export function searchParams(): ReadonlyURLSearchParams {
  const expression = 'searchParams';
  const url = getRequestURL(expression);

  return new ReadonlyURLSearchParams(url.searchParams);
}
