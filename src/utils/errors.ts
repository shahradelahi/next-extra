/**
 * @deprecated Use `next-zod-action` instead. This class will be removed in the next major release.
 */
export class ActionError extends Error {
  override name = 'ActionError';
  constructor(
    public code: string,
    message: string
  ) {
    super(message);
    Error.captureStackTrace(this, ActionError);
  }

  toPlain(): ActionErrorPlain {
    return {
      code: this.code,
      message: this.message,
    };
  }
}

/**
 * @deprecated Use `next-zod-action` instead. This interface will be removed in the next major release.
 */
export interface ActionErrorPlain {
  code: string;
  message: string;
}
