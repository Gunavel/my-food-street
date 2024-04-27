import express from 'express';

import authRouter from '@/api/v1/auth/authRouter';
import restaurantRouter from '@/api/v1/restaurant/restaurantRouter';

const v1Router = express.Router();

v1Router.use('/auth', authRouter);
v1Router.use('/restaurants', restaurantRouter);

export default v1Router;
