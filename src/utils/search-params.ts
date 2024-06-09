/**
 * @internal
 */
export class ReadonlyURLSearchParamsError extends Error {
  constructor() {
    super('Method unavailable on `ReadonlyURLSearchParams`.');
  }
}

export class ReadonlyURLSearchParams extends URLSearchParams {
  /**
   * Creates a ReadonlyURLSearchParams instance from a full pathname.
   *
   * @param pathname The full pathname
   * @returns
   */
  public static from(pathname: URL | string): ReadonlyURLSearchParams {
    if (pathname instanceof URL) {
      return new ReadonlyURLSearchParams(pathname.searchParams);
    }

    const url = new URL(pathname, 'http://localhost');
    if (url.searchParams) {
      return new ReadonlyURLSearchParams(url.searchParams);
    }

    return new ReadonlyURLSearchParams();
  }

  /** @deprecated Method unavailable on `ReadonlyURLSearchParams`. */
  override append() {
    throw new ReadonlyURLSearchParamsError();
  }

  /** @deprecated Method unavailable on `ReadonlyURLSearchParams`. */
  override delete() {
    throw new ReadonlyURLSearchParamsError();
  }

  /** @deprecated Method unavailable on `ReadonlyURLSearchParams`. */
  override set() {
    throw new ReadonlyURLSearchParamsError();
  }

  /** @deprecated Method unavailable on `ReadonlyURLSearchParams`. */
  override sort() {
    throw new ReadonlyURLSearchParamsError();
  }
}
