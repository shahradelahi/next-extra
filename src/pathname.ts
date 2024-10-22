import { headers } from 'next/headers';

import { getExpectedRequestStore, getStaticGenerationStore } from '@/utils/async-storages';
import { ReadonlyURLSearchParams } from '@/utils/search-params';

// -- Internal ------------------------

async function getRequestOrigin() {
  const requestHeaders = await headers();
  const protocol = requestHeaders.get('x-forwarded-proto') || 'http';
  const host =
    requestHeaders.get('x-forwarded-host') || requestHeaders.get('host') || 'localhost:3000';
  return `${protocol}://${host}`;
}

async function getRequestURL(callingExpression: string): Promise<URL> {
  const origin = await getRequestOrigin();
  const staticStore = getStaticGenerationStore(callingExpression);

  if (staticStore && 'urlPathname' in staticStore && !!staticStore.urlPathname) {
    return new URL(staticStore.urlPathname, origin);
  }

  const requestStore = getExpectedRequestStore(callingExpression);
  if (requestStore && 'url' in requestStore && !!requestStore.url) {
    return new URL(`${requestStore.url.pathname}${requestStore.url.search}`, origin);
  }

  // We should never get here.
  throw new Error(
    `\`${callingExpression}\` could not access the request URL. Probably you should report this as a bug. GitHub: https://github.com/shahradelahi/next-extra/issues`
  );
}

// -- Exported ------------------------

/** @deprecated This method will be removed in the next major release. */
export async function invokeUrl(): Promise<URL> {
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
 *  const route = await pathname() // returns "/dashboard" on /dashboard?foo=bar
 *  // ...
 * }
 * ```
 */
export async function pathname(): Promise<string> {
  const expression = 'pathname';
  const url = await getRequestURL(expression);

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
 *  const params = await searchParams()
 *  params.get('foo') // returns 'bar' when ?foo=bar
 *  // ...
 * }
 * ```
 */
export async function searchParams(): Promise<ReadonlyURLSearchParams> {
  const expression = 'searchParams';
  const url = await getRequestURL(expression);

  return new ReadonlyURLSearchParams(url.searchParams);
}
