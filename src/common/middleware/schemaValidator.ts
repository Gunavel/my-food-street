import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { JsonWebTokenError } from 'jsonwebtoken';
import { z, ZodError } from 'zod';

import { APIResponse } from '@/common/models/apiResponse';
import { sendAPIResponse } from '@/common/utils/httpHandlers';

export function validate(schema: z.ZodObject<any, any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({ body: req.body, query: req.query, params: req.params });
      next();
    } catch (error) {
      let apiResponse = new APIResponse(StatusCodes.INTERNAL_SERVER_ERROR, 'Internal Server Error');

      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue: any) => ({
          message: `${issue.path.join('.')} is ${issue.message}`,
        }));
        apiResponse = new APIResponse(StatusCodes.BAD_REQUEST, errorMessages?.[0]?.message);
      }

      if (error instanceof JsonWebTokenError) {
        apiResponse = new APIResponse(StatusCodes.BAD_REQUEST, 'JWT Error. Please verify.');
      }

      sendAPIResponse(apiResponse, res);
    }
  };
}
