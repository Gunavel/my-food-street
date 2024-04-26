import express, { Request, Response } from 'express';

import { sendAPIResponse } from '@/common/utils/httpHandlers';

import { createTable } from './createTableService';

const createTableRoute = express.Router();

createTableRoute.get('/', async (req: Request, res: Response) => {
  const response = await createTable();
  return sendAPIResponse(response, res);
});

export default createTableRoute;
