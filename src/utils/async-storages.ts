import type { AsyncLocalStorage } from 'node:async_hooks';

import { safeImport } from '@/utils/dynamic-import';

export function getExpectedRequestStore(callingExpression: string) {
  const workUnitStoreModule = safeImport<{
    getExpectedRequestStore: any;
  }>('next/dist/server/app-render/work-unit-async-storage.external');
  if (workUnitStoreModule) {
    return workUnitStoreModule.getExpectedRequestStore();
  }

  const requestStoreModule = safeImport<{
    requestAsyncStorage: AsyncLocalStorage<any>;
  }>('next/dist/client/components/request-async-storage.external');
  if (requestStoreModule) {
    const store = requestStoreModule.requestAsyncStorage.getStore();
    if (store) return store;
    throw new Error(
      `\`${callingExpression}\` was called outside a request scope. Read more: https://nextjs.org/docs/messages/next-dynamic-api-wrong-context`
    );
  }

  throw new Error(
    `Invariant: \`${callingExpression}\` expects to have requestAsyncStorage, none available.`
  );
}

export function getStaticGenerationStore() {
  const staticGenerationStoreModule = safeImport<{
    getExpectedStaticGenerationStore(): any;
  }>('next/dist/client/components/static-generation-async-storage.external');
  if (staticGenerationStoreModule && staticGenerationStoreModule.getExpectedStaticGenerationStore) {
    return staticGenerationStoreModule.getExpectedStaticGenerationStore();
  }
}
