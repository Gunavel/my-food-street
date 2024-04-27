import { z } from 'zod';

const CartItemSchema = z
  .object({
    id: z.string(),
    quantity: z.string(),
  })
  .required();
const RestaurantCartSchema = z
  .object({
    id: z.string(),
    items: z.array(CartItemSchema),
  })
  .required();
const SaveCartSchema = z
  .object({
    restaurants: z.array(RestaurantCartSchema),
  })
  .required();
export type TSaveCart = z.infer<typeof SaveCartSchema>;
export type TCartRestaurant = z.infer<typeof RestaurantCartSchema>;
export const SaveCartRequestSchema = z.object({
  body: SaveCartSchema,
});

const CartIdSchema = z
  .object({
    cartId: z.string(),
  })
  .required();
export const CartIdRequestSchema = z.object({
  params: CartIdSchema,
});

const AddCartItemSchema = z
  .object({
    restaurantId: z.string(),
    itemId: z.string(),
    quantity: z.string(),
  })
  .required();
export const AddCartItemRequestSchema = z.object({
  body: AddCartItemSchema,
  params: CartIdSchema,
});
export type TAddCartItem = z.infer<typeof AddCartItemSchema>;

export const CartIdItemIdSchema = z
  .object({
    cartId: z.string(),
    itemId: z.string(),
  })
  .required();
export const DeleteCartItemRequestSchema = z.object({
  params: CartIdItemIdSchema,
});

const UpdateCartItem = z
  .object({
    itemId: z.string(),
    quantity: z.string(),
  })
  .required();
export const UpdateCartItemRequestSchema = z.object({
  params: CartIdItemIdSchema,
  body: UpdateCartItem,
});
export type TUpdateCartItem = z.infer<typeof UpdateCartItem>;
