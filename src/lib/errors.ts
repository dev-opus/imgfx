import type { ZodIssue } from 'zod';

export enum HTTPExceptionType {
  v = 'ValidationError',
  a = 'AuthorizationError',
}

export class APIException extends Error {
  message: string;
  status: number;
  cause?: any;

  constructor(message: string, status: number, cause?: any) {
    super(message, cause);

    this.cause = cause;
    this.status = status;
    this.message = message;

    Error.captureStackTrace(this, APIException);
  }

  getResponse() {
    return {
      ok: false,
      msg: this.message,
      cause: this.cause,
    };
  }
}

export class HTTPException extends APIException {
  type?: HTTPExceptionType;

  constructor(
    message: string,
    status: number,
    type?: HTTPExceptionType,
    cause?: any
  ) {
    super(message, status, cause);

    this.type = type;
    Error.captureStackTrace(this, HTTPException);
  }

  override getResponse() {
    if (this.cause) {
      if (this.type === HTTPExceptionType.v) {
        this.cause = formatZodIssues(this.cause as ZodIssue[]);
      }
    }

    return {
      ok: false,
      msg: this.message,
      type: this.type,
      cause: this.cause,
    };
  }
}

function formatZodIssues(issues: ZodIssue[]) {
  return issues.map((issue) => {
    return {
      path: issue.path.join(':'),
      message: issue.message,
    };
  });
}
