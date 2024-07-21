import { headers } from 'next/headers';

import { getExpectedRequestStore, getExpectedStaticGenerationStore } from '@/utils/async-storages';
import { ReadonlyURLSearchParams } from '@/utils/search-params';

// -- Internal ------------------------

function getRequestOrigin() {
  const requestHeaders = headers();
  const protocol = requestHeaders.get('x-forwarded-proto') || 'http';
  const host =
    requestHeaders.get('x-forwarded-host') || requestHeaders.get('host') || 'localhost:3000';
  return `${protocol}://${host}`;
}

function getRequestURL(callingExpression: string): URL {
  const staticStore = getExpectedStaticGenerationStore(callingExpression);
  const origin = getRequestOrigin();

  if ('urlPathname' in staticStore && !!staticStore.urlPathname) {
    return new URL(staticStore.urlPathname, origin);
  }

  const requestStore = getExpectedRequestStore(callingExpression);
  if ('url' in requestStore && !!requestStore.url) {
    return new URL(`${requestStore.url.pathname}${requestStore.url.search}`, origin);
  }

  // We should never get here.
  throw new Error(
    `\`${callingExpression}\` could not access the request URL. Probably you should report this as a bug. GitHub: https://github.com/shahradelahi/next-extra/issues`
  );
}

// -- Exported ------------------------

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
