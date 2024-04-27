import { QueryCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';

import { ENTITY_TYPES } from '@/api/constants';
import getDBClient from '@/common/utils/dbClient';

import { TAddCartItem, TCartRestaurant, TSaveCart, TUpdateCartItem } from './cartModel';

export const saveCart = async ({
  cartInput,
  userId,
  cartId,
}: {
  cartInput: TSaveCart;
  userId: string;
  cartId: string;
}) => {
  const dbClient = getDBClient();

  const timestamp = Date.now();
  const params = {
    TableName: process.env.DYNAMODB_TABLE_NAME,
    Item: {
      PK: cartId,
      SK: userId,
      USIPK: userId,
      USISK: cartId,
      EntityType: ENTITY_TYPES.CART,
      TimeStamp: timestamp,
      UserId: userId,
      CartId: cartId,
      CartDetails: cartInput,
    },
    ConditionExpression: 'attribute_not_exists(PK)',
  };

  return dbClient.put(params);
};

export const getCarts = async ({ userId }: { userId: string }) => {
  const dbClient = getDBClient();

  const command = new QueryCommand({
    TableName: process.env.DYNAMODB_TABLE_NAME,
    IndexName: 'UserSecondaryIndex',
    KeyConditionExpression: 'USIPK = :userId And begins_with(USISK, :cartIdPrefix)',
    ExpressionAttributeValues: {
      ':userId': userId,
      ':cartIdPrefix': 'ca#',
    },
  });

  return dbClient.send(command);
};

export const getCart = async ({ cartId, userId }: { cartId: string; userId: string }) => {
  const dbClient = getDBClient();

  const params = {
    TableName: process.env.DYNAMODB_TABLE_NAME,
    Key: {
      PK: cartId,
      SK: userId,
    },
  };

  return dbClient.get(params);
};

export const deleteCart = async ({ cartId, userId }: { cartId: string; userId: string }) => {
  const dbClient = getDBClient();

  const params = {
    TableName: process.env.DYNAMODB_TABLE_NAME,
    Key: {
      PK: cartId,
      SK: userId,
    },
  };

  return dbClient.delete(params);
};

export const updateCartDetails = async ({
  userId,
  cartId,
  cartDetails,
}: {
  userId: string;
  cartId: string;
  cartDetails: TSaveCart;
}) => {
  const dbClient = getDBClient();

  const command = new UpdateCommand({
    TableName: process.env.DYNAMODB_TABLE_NAME,
    Key: {
      PK: cartId,
      SK: userId,
    },
    UpdateExpression: 'SET CartDetails = :cartDetails',
    ExpressionAttributeValues: {
      ':cartDetails': cartDetails,
    },
    ConditionExpression: 'attribute_exists(PK) And attribute_exists(SK)',
  });

  return dbClient.send(command);
};

export const addCartItem = async ({
  userId,
  cartItemInput,
  cartId,
}: {
  userId: string;
  cartItemInput: TAddCartItem;
  cartId: string;
}) => {
  const cart = await getCart({ userId, cartId });
  const cartDetails = cart.Item?.CartDetails;

  let existingRes = false;
  cartDetails?.restaurants?.forEach((res: TCartRestaurant) => {
    if (res.id === cartItemInput.restaurantId) {
      res.items.push({
        id: cartItemInput.itemId,
        quantity: cartItemInput.quantity,
      });
      existingRes = true;
    }
  });

  if (!existingRes) {
    cartDetails?.restaurants?.push({
      id: cartItemInput.restaurantId,
      items: [
        {
          id: cartItemInput.itemId,
          quantity: cartItemInput.quantity,
        },
      ],
    });
  }

  return updateCartDetails({ userId, cartId, cartDetails });
};

export const deleteCartItem = async ({
  userId,
  itemId,
  cartId,
}: {
  userId: string;
  itemId: string;
  cartId: string;
}) => {
  const cart = await getCart({ userId, cartId });
  const cartDetails = cart.Item?.CartDetails;

  let itemIndex = -1;
  let resIndex = -1;
  for (let i = 0; i < cartDetails?.restaurants?.length; i++) {
    const res: TCartRestaurant = cartDetails?.restaurants?.[i];
    for (let j = 0; j < res?.items?.length; j++) {
      const item = res?.items?.[j];
      if (item.id === itemId) {
        itemIndex = j;
        resIndex = i;
        break;
      }
    }

    if (itemIndex !== -1) {
      break;
    }
  }

  if (resIndex !== -1 && itemIndex !== -1) {
    cartDetails?.restaurants?.[resIndex].items?.splice(itemIndex, 1);
  }

  return updateCartDetails({ userId, cartId, cartDetails });
};

export const updateCartItem = async ({
  userId,
  itemId,
  cartId,
  cartItemInput,
}: {
  userId: string;
  itemId: string;
  cartId: string;
  cartItemInput: TUpdateCartItem;
}) => {
  const cart = await getCart({ userId, cartId });
  const cartDetails = cart.Item?.CartDetails;

  let updated = false;
  for (let i = 0; i < cartDetails?.restaurants?.length; i++) {
    const res: TCartRestaurant = cartDetails?.restaurants?.[i];
    for (let j = 0; j < res?.items?.length; j++) {
      const item = res?.items?.[j];
      if (item.id === itemId) {
        item.quantity = cartItemInput.quantity;
        updated = true;
        break;
      }
    }

    if (updated) {
      break;
    }
  }

  return updateCartDetails({ userId, cartId, cartDetails });
};
