export class ActionError extends Error {
  constructor(
    public code: string,
    message: string
  ) {
    super(message);
    this.name = 'ActionError';
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
