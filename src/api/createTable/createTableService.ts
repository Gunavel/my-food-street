import { StatusCodes } from 'http-status-codes';

import { APIResponse } from '@/common/models/apiResponse';
import { getLogger } from '@/common/utils/logger';

import { create } from './createTableRepository';

const logger = getLogger({ name: 'create table service' });

export const createTable = async () => {
  try {
    await create();

    const res = {
      message: 'Table created successfully',
    };
    return new APIResponse(StatusCodes.CREATED, res);
  } catch (error) {
    logger.error(error);
    return new APIResponse(StatusCodes.INTERNAL_SERVER_ERROR, 'Unknown error occured. Please try again.');
  }
};
