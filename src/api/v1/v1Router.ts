import express from 'express';

import authRouter from '@/api/v1/auth/authRouter';
const v1Router = express.Router();

v1Router.use('/auth', authRouter);

export default v1Router;
