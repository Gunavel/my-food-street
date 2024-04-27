import express, { Request, Response } from 'express';

import { USER_ROLE } from '@/api/constants';
import { authN, authZ } from '@/common/middleware/auth';
import { validate } from '@/common/middleware/schemaValidator';
import { sendAPIResponse } from '@/common/utils/httpHandlers';

import {
  AddCartItemRequestSchema,
  CartIdRequestSchema,
  DeleteCartItemRequestSchema,
  SaveCartRequestSchema,
  UpdateCartItemRequestSchema,
} from './cartModel';
import {
  addUserCartItem,
  deleteUserCart,
  deleteUserCartItem,
  getUserCart,
  getUserCarts,
  saveUserCart,
  updateUserCartItem,
} from './cartService';

const cartRouter = express.Router();

cartRouter.delete(
  '/:cartId',
  authN,
  authZ(USER_ROLE.CUSTOMER),
  validate(CartIdRequestSchema),
  async (req: Request, res: Response) => {
    const input = CartIdRequestSchema.parse({ params: req.params });
    const response = await deleteUserCart({
      userId: req.userId,
      cartId: decodeURIComponent(input.params.cartId),
    });

    return sendAPIResponse(response, res);
  }
);

cartRouter.delete(
  '/:cartId/items/:itemId',
  authN,
  authZ(USER_ROLE.CUSTOMER),
  validate(DeleteCartItemRequestSchema),
  async (req: Request, res: Response) => {
    const input = DeleteCartItemRequestSchema.parse({ params: req.params });
    const response = await deleteUserCartItem({
      userId: req.userId,
      cartId: decodeURIComponent(input.params.cartId),
      itemId: input.params.itemId,
    });

    return sendAPIResponse(response, res);
  }
);

cartRouter.patch(
  '/:cartId/items/:itemId',
  authN,
  authZ(USER_ROLE.CUSTOMER),
  validate(UpdateCartItemRequestSchema),
  async (req: Request, res: Response) => {
    const cartItemInput = UpdateCartItemRequestSchema.parse({ body: req.body, params: req.params });
    const response = await updateUserCartItem({
      cartItemInput: cartItemInput.body,
      userId: req.userId,
      itemId: cartItemInput.params.itemId,
      cartId: decodeURIComponent(cartItemInput.params.cartId),
    });

    return sendAPIResponse(response, res);
  }
);

cartRouter.put(
  '/:cartId/items',
  authN,
  authZ(USER_ROLE.CUSTOMER),
  validate(AddCartItemRequestSchema),
  async (req: Request, res: Response) => {
    const cartItemInput = AddCartItemRequestSchema.parse({ body: req.body, params: req.params });
    const response = await addUserCartItem({
      cartItemInput: cartItemInput.body,
      userId: req.userId,
      cartId: decodeURIComponent(cartItemInput.params.cartId),
    });

    return sendAPIResponse(response, res);
  }
);

cartRouter.get(
  '/:cartId',
  authN,
  authZ(USER_ROLE.CUSTOMER),
  validate(CartIdRequestSchema),
  async (req: Request, res: Response) => {
    const input = CartIdRequestSchema.parse({ params: req.params });
    const response = await getUserCart({
      cartId: decodeURIComponent(input.params.cartId),
      userId: req.userId,
    });

    return sendAPIResponse(response, res);
  }
);

cartRouter.post(
  '/',
  authN,
  authZ(USER_ROLE.CUSTOMER),
  validate(SaveCartRequestSchema),
  async (req: Request, res: Response) => {
    const cartInput = SaveCartRequestSchema.parse({ body: req.body });
    const response = await saveUserCart({ cartInput: cartInput.body, userId: req.userId });

    return sendAPIResponse(response, res);
  }
);

cartRouter.get('/', authN, authZ(USER_ROLE.CUSTOMER), async (req: Request, res: Response) => {
  const response = await getUserCarts({ userId: req.userId });
  return sendAPIResponse(response, res);
});

export default cartRouter;
