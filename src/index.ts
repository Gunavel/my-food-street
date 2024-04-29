import 'dotenv/config';

import bodyParser from 'body-parser';
import cors from 'cors';
import express, { Express, Request, Response } from 'express';
import helmet from 'helmet';

import createTableRouter from '@/api/createTable/createTableRouter';
import v1Router from '@/api/v1/v1Router';
import errorHandler from '@/common/middleware/errorHandler';
import requestLogger from '@/common/middleware/requestLogger';
import { getLogger } from '@/common/utils/logger';

const logger = getLogger({ name: 'Init server' });
const app: Express = express();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Request Logging
app.use(requestLogger);

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to MyFoodStreet API');
});

// API Routes
app.use('/createTable', createTableRouter);
app.use('/api/v1', v1Router);

// Error Handlers
app.use(errorHandler());

const port = process.env.PORT || 3000;
app.listen(port, () => {
  logger.info(`Server running on port: ${port}`);
});
