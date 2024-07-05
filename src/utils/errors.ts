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

export interface ActionErrorPlain {
  code: string;
  message: string;
}
