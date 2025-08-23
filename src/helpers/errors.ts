import { StatusCodes } from 'http-status-codes';
import { ValidationError } from 'joi';

export class ApplicationError extends Error {
  public statusCode: number;
  public code: string;
  public details: string[];

  constructor(message: string, code: string, statusCode: StatusCodes, details: string[]) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export class MissingBodyError extends ApplicationError {
  constructor() {
    super('Missing request body', 'ERROR_MISSING_BODY', StatusCodes.BAD_REQUEST, []);
  }
}

export class ValidateSchemaError extends ApplicationError {
  constructor(error: ValidationError) {
    super(
      'Failed to validate schema of Joi',
      'ERROR_VALIDATE_SCHEMA',
      StatusCodes.BAD_REQUEST,
      error.details.map((d) => d.message)
    );
  }
}

export class SaveOfferError extends ApplicationError {
  constructor(value: object) {
    super(
      'Failed to retrieve save a job offer',
      'ERROR_ATTEMPT_SAVE_ERROR',
      StatusCodes.INTERNAL_SERVER_ERROR,
      [JSON.stringify(value)]
    );
  }
}

export class GetIdError extends ApplicationError {
  constructor(offerSaved: object) {
    super(
      'Failed to retrieve job offer ID',
      'ERROR_ATTEMPT_GET_ID',
      StatusCodes.INTERNAL_SERVER_ERROR,
      [JSON.stringify(offerSaved)]
    );
  }
}
