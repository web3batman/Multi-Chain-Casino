export class CustomError extends Error {
  status: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.message = message;
    this.status = statusCode;
  }
}
