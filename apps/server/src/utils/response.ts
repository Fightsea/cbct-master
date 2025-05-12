class SuccessResponse<T> {
  public success: boolean = true;

  constructor(
    public message?: string,
    public data?: T
  ) {}
}

class ErrorResponse {
  public success: boolean = false;

  constructor(
    public code: string,
    public message?: string
  ) {}
}

export const success = <T>(message?: string, data?: any): SuccessHttpResponse<T> => {
  return new SuccessResponse(message, data);
};

export const error = (code: string, message?: string): ErrorHttpResponse => {
  // Remove empty string message
  return new ErrorResponse(code, message || undefined);
};
