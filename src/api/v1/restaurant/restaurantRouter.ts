import express, { Request, Response } from 'express';

import { USER_ROLE } from '@/api/constants';
import { authN, authZ } from '@/common/middleware/auth';
import { validate } from '@/common/middleware/schemaValidator';
import { sendAPIResponse } from '@/common/utils/httpHandlers';

import {
  AddMenuItemRequestSchema,
  AddMenuRequestSchema,
  CreateRestaurantRequestSchema,
  DeleteMenuItemRequestSchema,
  GetRestaurantRequestSchema,
  UpdateMenuItemRequestSchema,
} from './restaurantModel';
import {
  addRestaurantMenu,
  addRestaurantMenuItem,
  createRestaurant,
  deleteRestaurantMenuItem,
  getRestaurantMenu,
  getUserRestaurant,
  getUserRestaurants,
  updateMenuItemDetails,
} from './restaurantService';

const restaurantRouter = express.Router();

restaurantRouter.delete(
  '/:restaurantId/menu/items/:itemId',
  authN,
  authZ(USER_ROLE.RESTAURANT_ADMIN),
  validate(DeleteMenuItemRequestSchema),
  async (req: Request, res: Response) => {
    const deleteItemInput = DeleteMenuItemRequestSchema.parse({ params: req.params });
    const response = await deleteRestaurantMenuItem({
      userId: req.userId,
      itemId: decodeURIComponent(deleteItemInput.params.itemId),
      restaurantId: decodeURIComponent(deleteItemInput.params.restaurantId),
    });

    return sendAPIResponse(response, res);
  }
);

restaurantRouter.patch(
  '/:restaurantId/menu/items/:itemId',
  authN,
  authZ(USER_ROLE.RESTAURANT_ADMIN),
  validate(UpdateMenuItemRequestSchema),
  async (req: Request, res: Response) => {
    const menuItemInput = UpdateMenuItemRequestSchema.parse({ body: req.body, params: req.params });
    const response = await updateMenuItemDetails({
      menuItemInput: menuItemInput.body,
      userId: req.userId,
      itemId: decodeURIComponent(menuItemInput.params.itemId),
      restaurantId: decodeURIComponent(menuItemInput.params.restaurantId),
    });

    return sendAPIResponse(response, res);
  }
);

restaurantRouter.post(
  '/:restaurantId/menu/items',
  authN,
  authZ(USER_ROLE.RESTAURANT_ADMIN),
  validate(AddMenuRequestSchema),
  async (req: Request, res: Response) => {
    const menuInput = AddMenuRequestSchema.parse({ body: req.body, params: req.params });
    const response = await addRestaurantMenu({
      menuInput: menuInput.body,
      userId: req.userId,
      restaurantId: decodeURIComponent(menuInput.params.restaurantId),
    });

    return sendAPIResponse(response, res);
  }
);

restaurantRouter.put(
  '/:restaurantId/menu/items',
  authN,
  authZ(USER_ROLE.RESTAURANT_ADMIN),
  validate(AddMenuItemRequestSchema),
  async (req: Request, res: Response) => {
    const menuItemInput = AddMenuItemRequestSchema.parse({ body: req.body, params: req.params });
    const response = await addRestaurantMenuItem({
      menuItemInput: menuItemInput.body,
      userId: req.userId,
      restaurantId: decodeURIComponent(menuItemInput.params.restaurantId),
    });

    return sendAPIResponse(response, res);
  }
);

restaurantRouter.get(
  '/:restaurantId/menu/items',
  authN,
  validate(GetRestaurantRequestSchema),
  async (req: Request, res: Response) => {
    const input = GetRestaurantRequestSchema.parse({ params: req.params });
    const response = await getRestaurantMenu({
      restaurantId: decodeURIComponent(input.params.restaurantId),
      userId: req.userId,
      userRole: req.userRole,
    });

    return sendAPIResponse(response, res);
  }
);

restaurantRouter.get(
  '/:restaurantId',
  authN,
  validate(GetRestaurantRequestSchema),
  async (req: Request, res: Response) => {
    const input = GetRestaurantRequestSchema.parse({ params: req.params });
    const response = await getUserRestaurant({
      restaurantId: decodeURIComponent(input.params.restaurantId),
      userId: req.userId,
      userRole: req.userRole,
    });

    return sendAPIResponse(response, res);
  }
);

restaurantRouter.post(
  '/',
  authN,
  authZ(USER_ROLE.RESTAURANT_ADMIN),
  validate(CreateRestaurantRequestSchema),
  async (req: Request, res: Response) => {
    const restaurantInput = CreateRestaurantRequestSchema.parse({ body: req.body });
    const response = await createRestaurant({ restaurantInput: restaurantInput.body, userId: req.userId });

    return sendAPIResponse(response, res);
  }
);

restaurantRouter.get('/', authN, async (req: Request, res: Response) => {
  const response = await getUserRestaurants({ userId: req.userId, userRole: req.userRole });
  return sendAPIResponse(response, res);
});

export default restaurantRouter;
