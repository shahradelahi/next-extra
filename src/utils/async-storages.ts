import { requestAsyncStorage } from 'next/dist/client/components/request-async-storage.external';
import {
  staticGenerationAsyncStorage as _staticGenerationAsyncStorage,
  type StaticGenerationAsyncStorage,
} from 'next/dist/client/components/static-generation-async-storage.external';

export function getExpectedStaticGenerationStore(callingExpression: string) {
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

export function getExpectedRequestStore(callingExpression: string) {
  const store = requestAsyncStorage.getStore();
  if (store) return store;
  throw new Error(
    `\`${callingExpression}\` was called outside a request scope. Read more: https://nextjs.org/docs/messages/next-dynamic-api-wrong-context`
  );
}
