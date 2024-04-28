import { QueryCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';

import { ENTITY_TYPES, ORDER_STATUS } from '@/api/constants';
import getDBClient from '@/common/utils/dbClient';

import { TSingleOrder } from './orderModel';

export const placeOrder = async ({
  orderDetails,
  userId,
  orderId,
}: {
  orderDetails: TSingleOrder;
  userId: string;
  orderId: string;
}) => {
  const dbClient = getDBClient();

  const timestamp = Date.now();
  const params = {
    TableName: process.env.DYNAMODB_TABLE_NAME,
    Item: {
      PK: orderId,
      SK: userId,
      USIPK: userId,
      USISK: orderId,
      RSIPK: orderDetails.restaurantId,
      RSISK: orderId,
      EntityType: ENTITY_TYPES.ORDER,
      TimeStamp: timestamp,
      Status: ORDER_STATUS.PLACED,
      OrderDetails: orderDetails,
      UserId: userId,
      RestaurantId: orderDetails.restaurantId,
      OrderId: orderId,
    },
    ConditionExpression: 'attribute_not_exists(PK)',
  };

  return dbClient.put(params);
};

export const queryUserOrders = async ({ userId }: { userId: string }) => {
  const dbClient = getDBClient();

  const command = new QueryCommand({
    TableName: process.env.DYNAMODB_TABLE_NAME,
    IndexName: 'UserSecondaryIndex',
    KeyConditionExpression: 'USIPK = :userId And begins_with(USISK, :orderIdPrefix)',
    ExpressionAttributeValues: {
      ':userId': userId,
      ':orderIdPrefix': 'o#',
    },
  });

  return dbClient.send(command);
};

export const getOrderForUser = async ({ orderId, userId }: { orderId: string; userId: string }) => {
  const dbClient = getDBClient();

  const params = {
    TableName: process.env.DYNAMODB_TABLE_NAME,
    Key: {
      PK: orderId,
      SK: userId,
    },
  };

  return dbClient.get(params);
};

export const queryRestaurantOrders = async ({ restaurantId }: { restaurantId: string }) => {
  const dbClient = getDBClient();

  const command = new QueryCommand({
    TableName: process.env.DYNAMODB_TABLE_NAME,
    IndexName: 'RestaurantSecondaryIndex',
    KeyConditionExpression: 'RSIPK = :restaurantId And begins_with(RSISK, :orderIdPrefix)',
    ExpressionAttributeValues: {
      ':restaurantId': restaurantId,
      ':orderIdPrefix': 'o#',
    },
  });

  return dbClient.send(command);
};

export const getOrderForRestaurant = async ({ restaurantId, orderId }: { restaurantId: string; orderId: string }) => {
  const dbClient = getDBClient();

  const command = new QueryCommand({
    TableName: process.env.DYNAMODB_TABLE_NAME,
    IndexName: 'RestaurantSecondaryIndex',
    KeyConditionExpression: 'RSIPK = :restaurantId And RSISK = :orderId',
    ExpressionAttributeValues: {
      ':restaurantId': restaurantId,
      ':orderId': orderId,
    },
  });

  return dbClient.send(command);
};

export const updateOrderStatus = async ({
  orderId,
  orderedUserId,
  status,
}: {
  orderId: string;
  orderedUserId: string;
  status: string;
}) => {
  const dbClient = getDBClient();

  const timestamp = Date.now();
  const command = new UpdateCommand({
    TableName: process.env.DYNAMODB_TABLE_NAME,
    Key: {
      PK: orderId,
      SK: orderedUserId,
    },
    UpdateExpression: 'SET #status = :status, CompletionTimeStamp = :timestamp',
    ExpressionAttributeNames: {
      '#status': 'Status',
    },
    ExpressionAttributeValues: {
      ':status': status,
      ':timestamp': timestamp,
    },
    ConditionExpression: 'attribute_exists(PK) And attribute_exists(SK)',
  });

  return dbClient.send(command);
};
