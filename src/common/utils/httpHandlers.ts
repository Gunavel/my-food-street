import { Response } from 'express';

import { APIResponse } from '@/common/models/apiResponse';

export const sendAPIResponse = (apiResponse: APIResponse, response: Response) => {
  return response.status(apiResponse.httpStatusCode).send(apiResponse.data);
};
