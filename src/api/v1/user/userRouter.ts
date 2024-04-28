import express, { Request, Response } from 'express';

import { USER_ROLE } from '@/api/constants';
import { authN, authZ } from '@/common/middleware/auth';
import { validate } from '@/common/middleware/schemaValidator';
import { sendAPIResponse } from '@/common/utils/httpHandlers';

import { PlaceOrderRequestSchema, UserIdOrderIdRequestSchema, UserIdRequestSchema } from '../order/orderModel';
import { getUserOrder, getUserOrders, placeUserOrder } from '../order/orderService';

const userRouter = express.Router();

userRouter.post(
  '/:userId/orders',
  authN,
  authZ(USER_ROLE.CUSTOMER),
  validate(PlaceOrderRequestSchema),
  async (req: Request, res: Response) => {
    const placeOrderInput = PlaceOrderRequestSchema.parse({ body: req.body, params: req.params });
    const response = await placeUserOrder({ placeOrderInput: placeOrderInput.body, userId: req.userId });

    return sendAPIResponse(response, res);
  }
);

userRouter.get(
  '/:userId/orders',
  authN,
  authZ(USER_ROLE.CUSTOMER),
  validate(UserIdRequestSchema),
  async (req: Request, res: Response) => {
    const response = await getUserOrders({ userId: req.userId });
    return sendAPIResponse(response, res);
  }
);

userRouter.get(
  '/:userId/orders/:orderId',
  authN,
  authZ(USER_ROLE.CUSTOMER),
  validate(UserIdOrderIdRequestSchema),
  async (req: Request, res: Response) => {
    const response = await getUserOrder({ userId: req.userId, orderId: decodeURIComponent(req.params.orderId) });
    return sendAPIResponse(response, res);
  }
);

export default userRouter;
