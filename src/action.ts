import type { SafeReturn } from 'p-safe';

import { ActionError, type ActionErrorPlain } from '@/utils/errors';

type AnyFunc<This = void> = (this: This, ...args: readonly any[]) => unknown;

type ActionFunc<T> = T extends (...args: infer Args) => infer Return
  ? (this: any, ...args: Args) => Promise<SafeReturn<Awaited<Return>, ActionError>>
  : never;

export class Action<Return> {
  #result: Return | undefined;
  #fn: AnyFunc<Context<any>>;

  constructor(fn: AnyFunc<Context<any>>) {
    this.#fn = fn;
  }

  resolve(result: Return) {
    throw { data: result };
  }

  reject(reason: ActionErrorPlain | ActionError) {
    throw reason;
  }

  /** @internal */
  async run(...arguments_: any[]) {
    try {
      const result_ = await this.#fn.apply(this, arguments_); // eslint-disable-line prefer-spread
      if (result_ !== undefined) {
        return result_;
      }
      return this.#result;
    } catch (e) {
      if (!!e && typeof e === 'object' && 'data' in e) {
        return e;
      }
      if (e instanceof ActionError) {
        return { error: e.toPlain() };
      }
      if (!!e && typeof e === 'object' && 'code' in e && 'description' in e) {
        return { error: new ActionError(String(e.code), String(e.description)).toPlain() };
      }
      throw e;
    }
  }
}

export interface Context<Return> {
  resolve: (result: Return) => void;
  reject: (error: ActionErrorPlain | ActionError) => void;
}

export function createAction<T extends AnyFunc<Context<any>>>(fn: T): ActionFunc<T> {
  const action = new Action<T>(fn);

  return new Proxy(fn as any, {
    apply: (_target, _thisArg, argumentsList) => {
      return action.run(...argumentsList);
    },
  });
}

export function actionError(code: string, description: string): ActionError {
  const e = new ActionError(code, description);
  Error.captureStackTrace(e, actionError);
  return e;
}
