export function importThis<
  Object extends Record<string, any>,
  Async extends boolean = false,
  T = Async extends true ? Promise<Object | undefined> : Object | undefined,
>(path: string, async: Async = false as Async): T {
  if (async) {
    try {
      return import(path) as T;
    } catch (_) {
      return Promise.resolve(undefined) as T;
    }
  } else {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      return require(path);
    } catch (_) {
      return undefined as T;
    }
  }
}
