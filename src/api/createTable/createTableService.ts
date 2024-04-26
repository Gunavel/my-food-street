import { StatusCodes } from 'http-status-codes';

import { APIResponse } from '@/common/models/apiResponse';

import { create } from './createTableRepository';

export const createTable = async () => {
  try {
    await create();

    const res = {
      message: 'Table created successfully',
    };
    return new APIResponse(StatusCodes.CREATED, res);
  } catch (error) {
    console.log(error);
    return new APIResponse(StatusCodes.INTERNAL_SERVER_ERROR, 'res');
  }
};
