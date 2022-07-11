import Ticket from "../models/Ticket";

class AppError {
  public readonly message: string;

  public readonly statusCode: number;

  public readonly additionalData: object | undefined;

  constructor(message: string, statusCode = 400, additionalData?: object) {
    this.message = message;
    this.statusCode = statusCode;
    this.additionalData = additionalData;
  }
}

export default AppError;
