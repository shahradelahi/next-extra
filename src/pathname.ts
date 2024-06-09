import { staticGenerationAsyncStorage } from 'next/dist/client/components/static-generation-async-storage.external';
import { trackDynamicDataAccessed } from 'next/dist/server/app-render/dynamic-rendering';

import { ReadonlyURLSearchParams } from './utils/search-params';

export function pathname(): string {
  const expression = 'pathname';
  const store = staticGenerationAsyncStorage.getStore();

  if (!store) {
    throw new Error(`Invariant: static generation store missing in ${expression}`);
  }

  if (!store.forceStatic) {
    trackDynamicDataAccessed(store, expression);
  }

  return Object.freeze(store.urlPathname);
}

export function searchParams(): ReadonlyURLSearchParams {
  const params = ReadonlyURLSearchParams.from(pathname());

  return new ReadonlyURLSearchParams(params);
}
