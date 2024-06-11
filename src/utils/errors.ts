export class ActionError extends Error {
  constructor(
    readonly code: string,
    readonly description: string
  ) {
    super();
    Error.captureStackTrace(this, ActionError);
  }

  static fromError(error: Error): ActionError {
    return new ActionError(error.name, error.message);
  }

  toPlain(): ActionErrorPlain {
    return {
      code: this.code,
      description: this.description,
    };
  }
}

export interface ActionErrorPlain {
  code: string;
  description: string;
}
