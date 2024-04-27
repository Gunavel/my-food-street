import { QueryCommand, ScanCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';

import { ENTITY_TYPES } from '@/api/constants';
import getDBClient from '@/common/utils/dbClient';

import { AddMenuInput, CreateRestaurantInput, TMenuItem, UpdateMenuItemInput } from './restaurantModel';

export const createNewRestaurant = async ({
  restaurantInput,
  restaurantId,
  userId,
}: {
  restaurantInput: CreateRestaurantInput;
  restaurantId: string;
  userId: string;
}) => {
  const dbClient = getDBClient();

  const params = {
    TableName: process.env.DYNAMODB_TABLE_NAME,
    Item: {
      PK: restaurantId,
      SK: userId,
      USIPK: userId,
      USISK: restaurantId,
      EntityType: ENTITY_TYPES.RESTAURANT,
      UserId: userId,
      RestaurantId: restaurantId,
      Name: restaurantInput.name,
      Email: restaurantInput.email,
      PhoneNumber: restaurantInput.phoneNumber,
    },
    ConditionExpression: 'attribute_not_exists(PK)',
  };

  return dbClient.put(params);
};

export const getAllCustomerRestaurants = async () => {
  const dbClient = getDBClient();

  const command = new ScanCommand({
    TableName: process.env.DYNAMODB_TABLE_NAME,
    FilterExpression: 'EntityType = :entityType',
    ExpressionAttributeValues: {
      ':entityType': ENTITY_TYPES.RESTAURANT,
    },
  });

  return dbClient.send(command);
};

export const getAllAdminRestaurants = async ({ userId }: { userId: string }) => {
  const dbClient = getDBClient();

  const command = new QueryCommand({
    TableName: process.env.DYNAMODB_TABLE_NAME,
    IndexName: 'UserSecondaryIndex',
    KeyConditionExpression: 'USIPK = :userId And begins_with(USISK, :restaurantIdPrefix)',
    ExpressionAttributeValues: {
      ':userId': userId,
      ':restaurantIdPrefix': 'r#',
    },
  });

  return dbClient.send(command);
};

export const getRestaurantById = async ({ restaurantId }: { restaurantId: string }) => {
  const dbClient = getDBClient();

  const command = new QueryCommand({
    TableName: process.env.DYNAMODB_TABLE_NAME,
    KeyConditionExpression: 'PK = :restaurantId',
    ExpressionAttributeValues: {
      ':restaurantId': restaurantId,
    },
  });

  return dbClient.send(command);
};

export const getAdminRestaurant = async ({ userId, restaurantId }: { userId: string; restaurantId: string }) => {
  const dbClient = getDBClient();

  const params = {
    TableName: process.env.DYNAMODB_TABLE_NAME,
    Key: {
      PK: restaurantId,
      SK: userId,
    },
  };

  return dbClient.get(params);
};

export const addMenu = async ({
  userId,
  restaurantId,
  menuWithIds,
}: {
  userId: string;
  restaurantId: string;
  menuWithIds: AddMenuInput;
}) => {
  const dbClient = getDBClient();

  const command = new UpdateCommand({
    TableName: process.env.DYNAMODB_TABLE_NAME,
    Key: {
      PK: restaurantId,
      SK: userId,
    },
    UpdateExpression: 'SET Menu = :menu',
    ExpressionAttributeValues: {
      ':menu': menuWithIds.menu,
    },
    ConditionExpression: 'attribute_exists(PK) And attribute_exists(SK)',
  });

  return dbClient.send(command);
};

export const addMenuItem = async ({
  userId,
  restaurantId,
  newMenuItem,
}: {
  userId: string;
  restaurantId: string;
  newMenuItem: TMenuItem;
}) => {
  const dbClient = getDBClient();

  const command = new UpdateCommand({
    TableName: process.env.DYNAMODB_TABLE_NAME,
    Key: {
      PK: restaurantId,
      SK: userId,
    },
    UpdateExpression: 'SET Menu = list_append(Menu, :menu)',
    ExpressionAttributeValues: {
      ':menu': [newMenuItem],
    },
    ConditionExpression: 'attribute_exists(PK) And attribute_exists(SK)',
  });

  return dbClient.send(command);
};

export const updateMenuItem = async ({
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
  const dbResponse = await getAdminRestaurant({ userId, restaurantId });
  const menu: TMenuItem[] = dbResponse.Item?.Menu;
  const index = menu.findIndex((i) => i.id === itemId);
  if (index === -1) {
    throw new Error('not found');
  }
  menu.splice(index, 1);
  menu.push({
    ...menuItemInput,
    id: itemId,
  });

  const menuWithIds = {
    menu,
  };

  return addMenu({ userId, restaurantId, menuWithIds });
};

export const deleteMenuItem = async ({
  userId,
  restaurantId,
  itemId,
}: {
  userId: string;
  restaurantId: string;
  itemId: string;
}) => {
  const dbResponse = await getAdminRestaurant({ userId, restaurantId });
  const menu: TMenuItem[] = dbResponse.Item?.Menu;
  const index = menu.findIndex((i) => i.id === itemId);
  menu.splice(index, 1);

  const menuWithIds = {
    menu,
  };

  return addMenu({ userId, restaurantId, menuWithIds });
};
