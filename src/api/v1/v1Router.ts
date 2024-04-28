import express from 'express';

import authRouter from '@/api/v1/auth/authRouter';
import cartRouter from '@/api/v1/cart/cartRouter';
import restaurantRouter from '@/api/v1/restaurant/restaurantRouter';
import userRouter from '@/api/v1/user/userRouter';

const v1Router = express.Router();

v1Router.use('/auth', authRouter);
v1Router.use('/restaurants', restaurantRouter);
v1Router.use('/carts', cartRouter);
v1Router.use('/users', userRouter);

export default v1Router;
