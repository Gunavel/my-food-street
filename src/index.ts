import bodyParser from 'body-parser';
import cors from 'cors';
import express, { Express } from 'express';
import helmet from 'helmet';

const app: Express = express();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
