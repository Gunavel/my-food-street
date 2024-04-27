import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ZodError } from 'zod';

import { AuthNSchema } from '@/api/v1/auth/authModel';
import { APIResponse } from '@/common/models/apiResponse';
import { sendAPIResponse } from '@/common/utils/httpHandlers';

import { Token } from '../utils/token';

export function authN(req: Request, res: Response, next: NextFunction) {
  try {
    const data = AuthNSchema.parse({ headers: req.headers });
    const payload = Token.verifyToken(data?.headers?.authorization.split('Bearer ')[1]);
    if (payload) {
      req.userId = payload.userId;
      req.userRole = payload.userRole;
      next();
    } else {
      const apiResponse = new APIResponse(StatusCodes.BAD_REQUEST, 'errorMessages');
      sendAPIResponse(apiResponse, res);
    }
  } catch (error) {
    let apiResponse;
    if (error instanceof ZodError) {
      const errorMessages = error.errors.map((issue: any) => ({
        message: `${issue.path.join('.')} is ${issue.message}`,
      }));
      apiResponse = new APIResponse(StatusCodes.BAD_REQUEST, errorMessages);
      sendAPIResponse(apiResponse, res);
    } else {
      apiResponse = new APIResponse(StatusCodes.INTERNAL_SERVER_ERROR, 'Internal Server Error');
    }
  }
}

export function authZ(userRole: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.userRole === userRole) {
        next();
      } else {
        const apiResponse = new APIResponse(
          StatusCodes.UNAUTHORIZED,
          'This user is not authorized to perform the operation'
        );
        sendAPIResponse(apiResponse, res);
      }
    } catch (error) {
      const apiResponse = new APIResponse(StatusCodes.INTERNAL_SERVER_ERROR, 'Internal Server Error');
      sendAPIResponse(apiResponse, res);
    }
  };
}
