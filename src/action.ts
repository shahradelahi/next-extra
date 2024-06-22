import { headers } from 'next/headers';
import type { SafeReturn } from 'p-safe';

import { ActionError, type ActionErrorPlain } from '@/utils/errors';
import { isIP } from '@/utils/ip';

type AnyFunc<This = void> = (this: This, ...args: readonly any[]) => unknown;

type ActionFunc<T> = T extends (...args: infer Args) => infer Return
  ? (this: any, ...args: Args) => Promise<SafeReturn<Awaited<Return>, ActionError>>
  : never;

export class Action<Return> {
  #fn: AnyFunc<Context<any>>;

  constructor(fn: AnyFunc<Context<any>>) {
    this.#fn = fn;
  }

  resolve(result: Return): never {
    throw { data: result };
  }

  reject(reason: ActionErrorPlain | ActionError): never {
    throw reason;
  }

  /** @internal */
  async run(...arguments_: any[]) {
    try {
      const result_ = await this.#fn.apply(this, arguments_); // eslint-disable-line prefer-spread
      if (result_ !== undefined) {
        return { data: result_ };
      }
      return { data: void 0 };
    } catch (e) {
      if (!!e && typeof e === 'object' && 'data' in e) {
        return e;
      }
      if (e instanceof ActionError) {
        return { error: e.toPlain() };
      }
      if (!!e && typeof e === 'object' && 'code' in e && 'message' in e) {
        return { error: { code: e.code, message: e.message } };
      }
      throw e;
    }
  }
}

export interface Context<Return> {
  resolve: (result: Return) => never;
  reject: (error: ActionErrorPlain | ActionError) => never;
}

export function createAction<T extends AnyFunc<Context<any>>>(fn: T): ActionFunc<T> {
  const action = new Action<T>(fn);

  return new Proxy(fn as any, {
    apply: (_target, _thisArg, argumentsList) => {
      return action.run(...argumentsList);
    },
  });
}

export function actionError(code: string, message: string): never {
  const e = new ActionError(code, message);
  Error.captureStackTrace(e, actionError);
  throw e;
}

/**
 * Retrieves the client's IP address from request headers.
 *
 * The function checks various headers commonly used by different cloud providers and proxies to find the client's IP address.
 * It prioritizes the 'x-forwarded-for' header, which may contain multiple IP addresses, and extracts the first one.
 * If no valid IP is found, it throws an error.
 *
 * @returns {string} The client's IP address.
 * @throws {Error} If the client's IP address cannot be determined from the headers.
 */
export function clientIP() {
  const hs = headers();

  // X-Forwarded-For (Header may return multiple IP addresses in the format: "client IP, proxy 1 IP, proxy 2 IP", so we take the first one.)
  if (hs.has('x-forwarded-for')) {
    const forwardedIp = getClientIpFromXForwardedFor(hs.get('x-forwarded-for'));
    if (forwardedIp) {
      return forwardedIp;
    }
  }

  const headerKeys = [
    // Standard headers used by Amazon EC2, Heroku, and others.
    'x-client-ip',

    // Cloudflare.
    // @see https://support.cloudflare.com/hc/en-us/articles/200170986-How-does-Cloudflare-handle-HTTP-Request-headers-
    // CF-Connecting-IP - applied to every request to the origin.
    'cf-connecting-ip',

    // Fastly and Firebase hosting header (When forwared to cloud function)
    'fastly-client-ip',

    // Akamai and Cloudflare: True-Client-IP.
    'true-client-ip',

    // X-Real-IP (Nginx proxy/FastCGI)
    'x-real-ip',

    // X-Cluster-Client-IP (Rackspace LB, Riverbed Stingray)
    'x-cluster-client-ip',

    // X-Forwarded, Forwarded-For and Forwarded (Variations of #2)
    'x-forwarded',
    'forwarded-for',
    'forwarded',

    // Google Cloud App Engine
    // https://cloud.google.com/appengine/docs/standard/go/reference/request-response-headers
    'x-appengine-user-ip',

    // Cloudflare fallback
    // https://blog.cloudflare.com/eliminating-the-last-reasons-to-not-enable-ipv6/#introducingpseudoipv4
    'Cf-Pseudo-IPv4',
  ];

  for (const headerKey of headerKeys) {
    if (hs.has(headerKey)) {
      const ip = hs.get(headerKey);
      if (ip && isIP(ip)) {
        return ip;
      }
    }
  }

  throw new Error('Unable to determine client IP address from request headers');
}

/**
 * Parses the 'x-forwarded-for' header to extract the client's IP address.
 *
 * This header may contain multiple IP addresses in the format "client IP, proxy 1 IP, proxy 2 IP".
 * This function extracts and returns the first valid IP address.
 *
 * @link https://github.com/pbojinov/request-ip/blob/e1d0f4b89edf26c77cf62b5ef662ba1a0bd1c9fd/src/index.js#L9
 */
function getClientIpFromXForwardedFor(value: any) {
  if (value === null) {
    return null;
  }

  if (typeof value !== 'string') {
    throw new TypeError(`Expected a string, got "${typeof value}"`);
  }

  // x-forwarded-for may return multiple IP addresses in the format:
  // "client IP, proxy 1 IP, proxy 2 IP"
  // Therefore, the right-most IP address is the IP address of the most recent proxy
  // and the left-most IP address is the IP address of the originating client.
  // source: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-For
  // Azure Web App's also adds a port for some reason, so we'll only use the first part (the IP)
  const forwardedIps = value.split(',').map((e) => {
    const ip = e.trim();
    if (ip.includes(':')) {
      const splitted = ip.split(':');
      // make sure we only use this if it's ipv4 (ip:port)
      if (splitted.length === 2) {
        return splitted[0];
      }
    }
    return ip;
  });

  // Sometimes IP addresses in this header can be 'unknown' (http://stackoverflow.com/a/11285650).
  // Therefore taking the right-most IP address that is not unknown
  // A Squid configuration directive can also set the value to "unknown" (http://www.squid-cache.org/Doc/config/forwarded_for/)
  for (let i = 0; i < forwardedIps.length; i++) {
    const ip = forwardedIps[i];
    if (ip && isIP(ip)) {
      return ip;
    }
  }

  // If no value in the split list is an ip, return null
  return null;
}
