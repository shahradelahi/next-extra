import type { AsyncLocalStorage } from 'node:async_hooks';

import { importThis } from '@/utils/dynamic-import';

export async function getExpectedRequestStore(callingExpression: string) {
  try {
    const workUnitStoreModule =
      (await import('next/dist/server/app-render/work-unit-async-storage.external')) as
        | {
            getExpectedRequestStore: any;
          }
        | {
            workUnitAsyncStorage: AsyncLocalStorage<any>;
          };
    if (workUnitStoreModule) {
      if ('getExpectedRequestStore' in workUnitStoreModule) {
        return workUnitStoreModule.getExpectedRequestStore();
      }

      return workUnitStoreModule.workUnitAsyncStorage.getStore();
    }
  } catch (_) {
    // noop
  }

  const requestStoreModule = importThis<{
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

export function getStaticGenerationStore(callingExpression: string) {
  const staticGenerationStoreModule = importThis<{
    staticGenerationAsyncStorage: any;
  }>('next/dist/client/components/static-generation-async-storage.external');
  if (staticGenerationStoreModule) {
    const staticGenerationStore =
      (fetch as any).__nextGetStaticStore?.() ??
      staticGenerationStoreModule.staticGenerationAsyncStorage;

    const store = staticGenerationStore.getStore();
    if (!store) {
      throw new Error(
        `Invariant: \`${callingExpression}\` expects to have staticGenerationAsyncStorage, none available.`
      );
    }

    return store;
  }
}
