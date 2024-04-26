import 'dotenv/config';

import bodyParser from 'body-parser';
import cors from 'cors';
import express, { Express, Request, Response } from 'express';
import helmet from 'helmet';

import createTableRouter from '@/api/createTable/createTableRouter';

const app: Express = express();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to My Food Street API');
});

app.get('/createTable', createTableRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
