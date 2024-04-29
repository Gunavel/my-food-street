import { StatusCodes } from 'http-status-codes';

import { USER_ROLE } from '@/api/constants';
import { APIResponse } from '@/common/models/apiResponse';
import { getLogger } from '@/common/utils/logger';

import { AddMenuInput, AddMenuItemInput, CreateRestaurantInput, UpdateMenuItemInput } from './restaurantModel';
import {
  addMenu,
  addMenuItem,
  createNewRestaurant,
  deleteMenuItem,
  getAdminRestaurant,
  getAllAdminRestaurants,
  getAllCustomerRestaurants,
  getRestaurantById,
  updateMenuItem,
} from './restaurantRepository';

const logger = getLogger({ name: 'restaurant service' });

export const createRestaurant = async ({
  restaurantInput,
  userId,
}: {
  restaurantInput: CreateRestaurantInput;
  userId: string;
}) => {
  try {
    const restaurantId = `r#${crypto.randomUUID()}`;
    await createNewRestaurant({ restaurantInput, restaurantId, userId });

    const res = {
      message: `Restaurant ${restaurantInput.name} successfully created`,
    };
    return new APIResponse(StatusCodes.CREATED, res);
  } catch (error) {
    logger.error(error);
    return new APIResponse(StatusCodes.INTERNAL_SERVER_ERROR, 'res');
  }
};

export const getUserRestaurants = async ({ userId, userRole }: { userId: string; userRole: string }) => {
  try {
    let dbResponse;
    if (userRole === USER_ROLE.CUSTOMER) {
      dbResponse = await getAllCustomerRestaurants();
    } else {
      dbResponse = await getAllAdminRestaurants({ userId });
    }

    const res = {
      data: {
        restaurants: dbResponse.Items,
      },
    };
    return new APIResponse(StatusCodes.OK, res);
  } catch (error) {
    logger.error(error);
    return new APIResponse(StatusCodes.INTERNAL_SERVER_ERROR, 'res');
  }
};

export const getUserRestaurant = async ({
  restaurantId,
  userId,
  userRole,
}: {
  restaurantId: string;
  userId: string;
  userRole: string;
}) => {
  try {
    let dbResponse;
    let restaurant;
    if (userRole === USER_ROLE.CUSTOMER) {
      dbResponse = await getRestaurantById({ restaurantId });
      restaurant = dbResponse?.Items?.[0];
    } else {
      dbResponse = await getAdminRestaurant({ userId, restaurantId });
      restaurant = dbResponse.Item;
    }

    const res = {
      data: {
        restaurant,
      },
    };
    return new APIResponse(StatusCodes.OK, res);
  } catch (error) {
    logger.error(error);
    return new APIResponse(StatusCodes.INTERNAL_SERVER_ERROR, 'res');
  }
};

export const addRestaurantMenu = async ({
  userId,
  restaurantId,
  menuInput,
}: {
  userId: string;
  restaurantId: string;
  menuInput: AddMenuInput;
}) => {
  try {
    const withIds = menuInput.menu.map((item) => {
      return {
        ...item,
        id: crypto.randomUUID(),
      };
    });
    const menuWithIds = {
      menu: withIds,
    };
    await addMenu({ userId, menuWithIds, restaurantId });

    const res = {
      message: 'Menu added successfully',
    };
    return new APIResponse(StatusCodes.CREATED, res);
  } catch (error) {
    logger.error(error);
    return new APIResponse(StatusCodes.INTERNAL_SERVER_ERROR, 'res');
  }
};

export const addRestaurantMenuItem = async ({
  userId,
  restaurantId,
  menuItemInput,
}: {
  userId: string;
  restaurantId: string;
  menuItemInput: AddMenuItemInput;
}) => {
  try {
    const newMenuItem = {
      ...menuItemInput.menuItem,
      id: crypto.randomUUID(),
    };
    await addMenuItem({ userId, newMenuItem, restaurantId });

    const res = {
      message: 'Menu item added successfully',
    };
    return new APIResponse(StatusCodes.CREATED, res);
  } catch (error) {
    logger.error(error);
    return new APIResponse(StatusCodes.INTERNAL_SERVER_ERROR, 'res');
  }
};

export const getRestaurantMenu = async ({
  restaurantId,
  userId,
  userRole,
}: {
  restaurantId: string;
  userId: string;
  userRole: string;
}) => {
  try {
    let dbResponse;
    let menuItems;
    if (userRole === USER_ROLE.CUSTOMER) {
      dbResponse = await getRestaurantById({ restaurantId });
      menuItems = dbResponse?.Items?.[0]?.Menu;
    } else {
      dbResponse = await getAdminRestaurant({ userId, restaurantId });
      menuItems = dbResponse.Item?.Menu;
    }

    const res = {
      data: {
        menuItems,
      },
    };
    return new APIResponse(StatusCodes.OK, res);
  } catch (error) {
    logger.error(error);
    return new APIResponse(StatusCodes.INTERNAL_SERVER_ERROR, 'res');
  }
};

export const updateMenuItemDetails = async ({
  userId,
  restaurantId,
  itemId,
  menuItemInput,
}: {
  userId: string;
  restaurantId: string;
  itemId: string;
  menuItemInput: UpdateMenuItemInput;
}) => {
  try {
    await updateMenuItem({ userId, itemId, menuItemInput, restaurantId });

    const res = {
      message: 'Menu item updated successfully',
    };
    return new APIResponse(StatusCodes.CREATED, res);
  } catch (error) {
    logger.error(error);
    return new APIResponse(StatusCodes.INTERNAL_SERVER_ERROR, 'res');
  }
};

export const deleteRestaurantMenuItem = async ({
  userId,
  restaurantId,
  itemId,
}: {
  userId: string;
  restaurantId: string;
  itemId: string;
}) => {
  try {
    await deleteMenuItem({ userId, itemId, restaurantId });

    const res = {
      message: 'Menu item deleted successfully',
    };
    return new APIResponse(StatusCodes.CREATED, res);
  } catch (error) {
    logger.error(error);
    return new APIResponse(StatusCodes.INTERNAL_SERVER_ERROR, 'res');
  }
};
