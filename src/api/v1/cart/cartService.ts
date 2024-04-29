import { StatusCodes } from 'http-status-codes';

import { APIResponse } from '@/common/models/apiResponse';
import { getLogger } from '@/common/utils/logger';

import { TAddCartItem, TSaveCart, TUpdateCartItem } from './cartModel';
import { addCartItem, deleteCart, deleteCartItem, getCart, getCarts, saveCart, updateCartItem } from './cartRepository';

const logger = getLogger({ name: 'cart service' });

export const saveUserCart = async ({ cartInput, userId }: { cartInput: TSaveCart; userId: string }) => {
  try {
    const cartId = `ca#${crypto.randomUUID()}`;
    await saveCart({ cartInput, userId, cartId });

    const res = {
      message: `Cart successfully saved`,
    };
    return new APIResponse(StatusCodes.CREATED, res);
  } catch (error) {
    logger.error(error);
    return new APIResponse(StatusCodes.INTERNAL_SERVER_ERROR, 'Unknown error occured. Please try again.');
  }
};

export const getUserCarts = async ({ userId }: { userId: string }) => {
  try {
    const dbResponse = await getCarts({ userId });
    const res = {
      data: {
        carts: dbResponse.Items,
      },
    };
    return new APIResponse(StatusCodes.OK, res);
  } catch (error) {
    logger.error(error);
    return new APIResponse(StatusCodes.INTERNAL_SERVER_ERROR, 'Unknown error occured. Please try again.');
  }
};

export const getUserCart = async ({ cartId, userId }: { userId: string; cartId: string }) => {
  try {
    const dbResponse = await getCart({ userId, cartId });

    const res = {
      data: dbResponse.Item,
    };
    return new APIResponse(StatusCodes.OK, res);
  } catch (error) {
    logger.error(error);
    return new APIResponse(StatusCodes.INTERNAL_SERVER_ERROR, 'Unknown error occured. Please try again.');
  }
};

export const deleteUserCart = async ({ userId, cartId }: { userId: string; cartId: string }) => {
  try {
    await deleteCart({ userId, cartId });

    const res = {
      message: 'Cart deleted successfully',
    };
    return new APIResponse(StatusCodes.CREATED, res);
  } catch (error) {
    logger.error(error);
    return new APIResponse(StatusCodes.INTERNAL_SERVER_ERROR, 'Unknown error occured. Please try again.');
  }
};

export const addUserCartItem = async ({
  userId,
  cartId,
  cartItemInput,
}: {
  userId: string;
  cartId: string;
  cartItemInput: TAddCartItem;
}) => {
  try {
    await addCartItem({ userId, cartItemInput, cartId });

    const res = {
      message: 'Cart item added successfully',
    };
    return new APIResponse(StatusCodes.CREATED, res);
  } catch (error) {
    logger.error(error);
    return new APIResponse(StatusCodes.INTERNAL_SERVER_ERROR, 'Unknown error occured. Please try again.');
  }
};

export const deleteUserCartItem = async ({
  userId,
  cartId,
  itemId,
}: {
  userId: string;
  cartId: string;
  itemId: string;
}) => {
  try {
    await deleteCartItem({ userId, itemId, cartId });

    const res = {
      message: 'Cart item deleted successfully',
    };
    return new APIResponse(StatusCodes.CREATED, res);
  } catch (error) {
    logger.error(error);
    return new APIResponse(StatusCodes.INTERNAL_SERVER_ERROR, 'Unknown error occured. Please try again.');
  }
};

export const updateUserCartItem = async ({
  cartItemInput,
  userId,
  itemId,
  cartId,
}: {
  cartItemInput: TUpdateCartItem;
  userId: string;
  itemId: string;
  cartId: string;
}) => {
  try {
    await updateCartItem({ userId, itemId, cartId, cartItemInput });

    const res = {
      message: 'Cart item updated successfully',
    };
    return new APIResponse(StatusCodes.CREATED, res);
  } catch (error) {
    logger.error(error);
    return new APIResponse(StatusCodes.INTERNAL_SERVER_ERROR, 'Unknown error occured. Please try again.');
  }
};
