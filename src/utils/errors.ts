export class ActionError extends Error {
  constructor(
    public readonly code: string,
    message: string
  ) {
    super(message);
    Error.captureStackTrace(this, ActionError);
  }

  toPlain(): ActionErrorPlain {
    return {
      code: this.name,
      message: this.message,
    };
  }
}

export interface ActionErrorPlain {
  code: string;
  message: string;
}
