import { StatusCodes } from 'http-status-codes';

import { APIResponse } from '@/common/models/apiResponse';
import { getLogger } from '@/common/utils/logger';

import { getAdminRestaurant } from '../restaurant/restaurantRepository';
import { TPlaceOrderInput } from './orderModel';
import {
  getOrderForRestaurant,
  getOrderForUser,
  placeOrder,
  queryRestaurantOrders,
  queryUserOrders,
  updateOrderStatus,
} from './orderRepository';

const logger = getLogger({ name: 'order service' });

export const placeUserOrder = async ({
  placeOrderInput,
  userId,
}: {
  placeOrderInput: TPlaceOrderInput;
  userId: string;
}) => {
  try {
    let orderDetails;
    const promises: any[] = [];

    placeOrderInput.restaurants.forEach((res) => {
      const orderId = `o#${crypto.randomUUID()}`;
      orderDetails = {
        userId: userId,
        restaurantId: res.restaurantId,
        items: res.items,
      };

      promises.push(placeOrder({ orderDetails, userId, orderId }));
    });

    await Promise.all(promises);

    const res = {
      message: `Order(s) successfully placed`,
    };
    return new APIResponse(StatusCodes.CREATED, res);
  } catch (error) {
    logger.error(error);
    return new APIResponse(StatusCodes.INTERNAL_SERVER_ERROR, 'Unknown error occured. Please try again.');
  }
};

export const getUserOrders = async ({ userId }: { userId: string }) => {
  try {
    const dbResponse = await queryUserOrders({ userId });
    const res = {
      data: {
        orders: dbResponse.Items,
      },
    };
    return new APIResponse(StatusCodes.OK, res);
  } catch (error) {
    logger.error(error);
    return new APIResponse(StatusCodes.INTERNAL_SERVER_ERROR, 'Unknown error occured. Please try again.');
  }
};

export const getRestaurantOrders = async ({ restaurantId, userId }: { restaurantId: string; userId: string }) => {
  try {
    const dbRes = await getAdminRestaurant({ restaurantId, userId });
    if (!dbRes.Item) {
      return new APIResponse(StatusCodes.UNAUTHORIZED, 'User is not authorized.');
    }

    const dbResponse = await queryRestaurantOrders({ restaurantId });
    const res = {
      data: {
        orders: dbResponse.Items,
      },
    };
    return new APIResponse(StatusCodes.OK, res);
  } catch (error) {
    logger.error(error);
    return new APIResponse(StatusCodes.INTERNAL_SERVER_ERROR, 'Unknown error occured. Please try again.');
  }
};

export const getRestaurantOrder = async ({
  restaurantId,
  userId,
  orderId,
}: {
  restaurantId: string;
  orderId: string;
  userId: string;
}) => {
  try {
    const dbRes = await getAdminRestaurant({ restaurantId, userId });
    if (!dbRes.Item) {
      return new APIResponse(StatusCodes.UNAUTHORIZED, 'User is not authorized.');
    }

    const dbResponse = await getOrderForRestaurant({ restaurantId, orderId });
    const res = {
      data: {
        order: dbResponse.Items?.[0],
      },
    };
    return new APIResponse(StatusCodes.OK, res);
  } catch (error) {
    logger.error(error);
    return new APIResponse(StatusCodes.INTERNAL_SERVER_ERROR, 'Unknown error occured. Please try again.');
  }
};

export const updateRestaurantOrderStatus = async ({
  restaurantId,
  userId,
  orderId,
  status,
}: {
  restaurantId: string;
  orderId: string;
  userId: string;
  status: string;
}) => {
  try {
    const adminRes = await getAdminRestaurant({ restaurantId, userId });
    if (!adminRes.Item) {
      return new APIResponse(StatusCodes.UNAUTHORIZED, 'User is not authorized.');
    }

    const resOrder = await getOrderForRestaurant({ restaurantId, orderId });
    if (!resOrder.Items?.[0]) {
      return new APIResponse(StatusCodes.UNAUTHORIZED, 'User is not authorized.');
    }

    await updateOrderStatus({ orderedUserId: resOrder.Items?.[0].UserId, orderId, status });
    return new APIResponse(StatusCodes.CREATED, 'Order Status updated successfully.');
  } catch (error) {
    logger.error(error);
    return new APIResponse(StatusCodes.INTERNAL_SERVER_ERROR, 'Unknown error occured. Please try again.');
  }
};

export const getUserOrder = async ({ userId, orderId }: { userId: string; orderId: string }) => {
  try {
    const dbResponse = await getOrderForUser({ userId, orderId });
    const res = {
      data: dbResponse.Item,
    };
    return new APIResponse(StatusCodes.OK, res);
  } catch (error) {
    logger.error(error);
    return new APIResponse(StatusCodes.INTERNAL_SERVER_ERROR, 'Unknown error occured. Please try again.');
  }
};
