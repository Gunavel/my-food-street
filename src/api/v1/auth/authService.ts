import bcrypt from 'bcrypt';
import { StatusCodes } from 'http-status-codes';

import { APIResponse } from '@/common/models/apiResponse';
import { getLogger } from '@/common/utils/logger';
import { Token } from '@/common/utils/token';

import { CreateUserInput, UserLoginInput } from './authModel';
import { createUserAccount, getUserByEmail } from './authRepository';

const logger = getLogger({ name: 'auth service' });

export const registerUser = async ({ userInput }: { userInput: CreateUserInput }) => {
  try {
    const userId = `u#${crypto.randomUUID()}`;
    const password = await bcrypt.hash(userInput.password, 8);

    await createUserAccount({ userInput, userId, hashPassword: password });

    const res = {
      message: `User account with ${userInput.name} successfully created`,
    };
    return new APIResponse(StatusCodes.CREATED, res);
  } catch (error) {
    logger.error(error);
    return new APIResponse(StatusCodes.INTERNAL_SERVER_ERROR, 'res');
  }
};

export const login = async ({ userInput }: { userInput: UserLoginInput }) => {
  try {
    const dbUser = await getUserByEmail({ email: userInput.email });
    const isValidPassword = await bcrypt.compare(userInput.password, dbUser?.Item?.Password);

    if (!isValidPassword) {
      return new APIResponse(StatusCodes.INTERNAL_SERVER_ERROR, 'res');
    }

    const payload = { userId: dbUser?.Item?.UserId, userRole: dbUser?.Item?.Role };

    return new APIResponse(StatusCodes.OK, {
      data: {
        authToken: Token.getOrIssueToken(payload),
      },
    });
  } catch (error) {
    logger.error(error);
    return new APIResponse(StatusCodes.INTERNAL_SERVER_ERROR, 'res');
  }
};

export const logout = async ({ userId }: { userId: string }) => {
  try {
    Token.invalidateToken(userId);

    return new APIResponse(StatusCodes.OK, {
      data: {
        authToken: '',
      },
    });
  } catch (error) {
    logger.error(error);
    return new APIResponse(StatusCodes.INTERNAL_SERVER_ERROR, 'res');
  }
};
