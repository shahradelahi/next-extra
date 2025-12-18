import type { AsyncLocalStorage } from 'node:async_hooks';

import { safeImport } from '@/utils/dynamic-import';

type WUAS =
  | {
      getExpectedRequestStore: any;
    }
  | {
      workUnitAsyncStorage: AsyncLocalStorage<any>;
    };

async function getRequestStore(): Promise<WUAS | undefined> {
  try {
    return process.env['TURBOPACK']
      ? await import('next/dist/server/app-render/work-unit-async-storage.external')
      : safeImport('next/dist/server/app-render/work-unit-async-storage.external');
  } catch {
    return Promise.resolve(undefined);
  }
}

export async function getExpectedRequestStore(callingExpression: string) {
  const workUnitStoreModule = await getRequestStore();
  if (workUnitStoreModule) {
    if ('getExpectedRequestStore' in workUnitStoreModule) {
      return workUnitStoreModule.getExpectedRequestStore();
    }
    return workUnitStoreModule.workUnitAsyncStorage.getStore();
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

export function getStaticGenerationStore(callingExpression: string) {
  const staticGenerationStoreModule = safeImport<{
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
