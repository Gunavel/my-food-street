import { z } from 'zod';

const CreateRestaurantSchema = z
  .object({
    name: z.string(),
    email: z.string().email(),
    phoneNumber: z.string(),
  })
  .required();
export const CreateRestaurantRequestSchema = z
  .object({
    body: CreateRestaurantSchema,
  })
  .required();
export type CreateRestaurantInput = z.infer<typeof CreateRestaurantSchema>;

const GetRestaurantSchema = z
  .object({
    restaurantId: z.string(),
  })
  .required();
export const GetRestaurantRequestSchema = z.object({
  params: GetRestaurantSchema,
});

const GetRestaurantMenuSchema = z
  .object({
    restaurantId: z.string(),
  })
  .required();
export const GetRestaurantMenuRequestSchema = z.object({
  params: GetRestaurantMenuSchema,
});

const MenuItemSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string(),
  category: z.enum(['appetizer', 'mainCourse', 'dessert']),
  price: z.string(),
});
export type TMenuItem = z.infer<typeof MenuItemSchema>;
const AddMenuSchema = z
  .object({
    menu: z.array(MenuItemSchema),
  })
  .required();
export const AddMenuRequestSchema = z.object({
  body: AddMenuSchema,
  params: GetRestaurantSchema,
});
export type AddMenuInput = z.infer<typeof AddMenuSchema>;

const AddMenuItemSchema = z.object({
  menuItem: MenuItemSchema,
});
export const AddMenuItemRequestSchema = z.object({
  body: AddMenuItemSchema,
  params: GetRestaurantSchema,
});
export type AddMenuItemInput = z.infer<typeof AddMenuItemSchema>;

const UpdateMenuItemSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string(),
  category: z.enum(['appetizer', 'mainCourse', 'dessert']),
  price: z.string(),
});
const RestaurantIdAndMenuItemIdSchema = z
  .object({
    restaurantId: z.string(),
    itemId: z.string(),
  })
  .required();
export const UpdateMenuItemRequestSchema = z.object({
  body: UpdateMenuItemSchema,
  params: RestaurantIdAndMenuItemIdSchema,
});
export type UpdateMenuItemInput = z.infer<typeof UpdateMenuItemSchema>;

export const DeleteMenuItemRequestSchema = z.object({
  params: RestaurantIdAndMenuItemIdSchema,
});
