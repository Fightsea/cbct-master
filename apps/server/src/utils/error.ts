class ErrorBase extends Error {
  constructor(
    public status: number,
    public code: string,
    public message: string
  ) {
    super(message);
  }
}

class BadRequestError extends ErrorBase {
  constructor(
    public code: string,
    public message: string = ''
  ) {
    super(400, code, message);
  }
}

class UnauthorizedError extends ErrorBase {
  constructor(
    public code: string,
    public message: string = ''
  ) {
    super(401, code, message);
  }
}

class ValidationError extends BadRequestError {}

class ForbiddenError extends ErrorBase {
  constructor() {
    super(403, 'FORBIDDEN', '');
  }
}

class NotFoundError extends ErrorBase {
  constructor() {
    super(404, 'NOT_FOUND', '');
  }
}

class InternalServerError extends ErrorBase {
  constructor(
    public code: string = 'INTERNAL_SERVER_ERROR',
    public message: string = ''
  ) {
    super(500, code, message);
  }
}

export {
  ErrorBase,
  BadRequestError,
  UnauthorizedError,
  ValidationError,
  ForbiddenError,
  NotFoundError,
  InternalServerError
};
