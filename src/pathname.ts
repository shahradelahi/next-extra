import { staticGenerationAsyncStorage } from 'next/dist/client/components/static-generation-async-storage.external';

import { ReadonlyURLSearchParams } from './utils/search-params';

export function invokeUrl(): URL {
  const expression = 'invokeUrl';
  const store = staticGenerationAsyncStorage.getStore();

  if (!store) {
    throw new Error(`Invariant: static generation store missing in ${expression}`);
  }

  const { incrementalCache, urlPathname } = store;
  if (!incrementalCache) {
    throw new Error(`Invariant: incremental cache missing in ${expression}`);
  }

  const { requestHeaders } = incrementalCache;

  const base = `${requestHeaders['x-forwarded-proto']}://${requestHeaders['host']}`;

  return new URL(urlPathname, base);
}

export function pathname(): string {
  const url = invokeUrl();

  return url.pathname;
}

export function searchParams(): ReadonlyURLSearchParams {
  const url = invokeUrl();

  return new ReadonlyURLSearchParams(url.searchParams);
}
