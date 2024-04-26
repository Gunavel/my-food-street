import { StatusCodes } from 'http-status-codes';

export class APIResponse<T = any> {
  httpStatusCode: StatusCodes;
  data: T;

  constructor(httpStatusCode: StatusCodes, data: T) {
    this.httpStatusCode = httpStatusCode;
    this.data = data;
  }
}
