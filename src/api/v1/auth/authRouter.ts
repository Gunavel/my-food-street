import express, { Request, Response } from 'express';

import { authN } from '@/common/middleware/auth';
import { validate } from '@/common/middleware/schemaValidator';
import { sendAPIResponse } from '@/common/utils/httpHandlers';

import { CreateUserRequestSchema, UserLoginRequestSchema } from './authModel';
import { login, logout, registerUser } from './authService';

const authRouter = express.Router();

authRouter.post('/register', validate(CreateUserRequestSchema), async (req: Request, res: Response) => {
  const userInput = CreateUserRequestSchema.parse({ body: req.body });
  const response = await registerUser({ userInput: userInput.body });

  return sendAPIResponse(response, res);
});

authRouter.post('/login', validate(UserLoginRequestSchema), async (req: Request, res: Response) => {
  const userInput = UserLoginRequestSchema.parse({ body: req.body });
  const response = await login({ userInput: userInput.body });

  return sendAPIResponse(response, res);
});

authRouter.post('/logout', authN, async (req: Request, res: Response) => {
  const response = await logout({ userId: req.userId });
  return sendAPIResponse(response, res);
});

export default authRouter;
