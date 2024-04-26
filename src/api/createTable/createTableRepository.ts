import { CreateTableCommand, KeyType, ProjectionType, ScalarAttributeType } from '@aws-sdk/client-dynamodb';

import getClient from '@/common/utils/dbClient';

const TABLE_NAME = 'MyFoodStreet';

export const create = async () => {
  const dbClient = getClient();

  const createTableCommand = new CreateTableCommand({
    TableName: TABLE_NAME,
    KeySchema: [
      {
        AttributeName: 'PK',
        KeyType: KeyType.HASH,
      },
      {
        AttributeName: 'SK',
        KeyType: KeyType.RANGE,
      },
    ],
    AttributeDefinitions: [
      {
        AttributeName: 'PK',
        AttributeType: ScalarAttributeType.S,
      },
      {
        AttributeName: 'SK',
        AttributeType: ScalarAttributeType.S,
      },
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'UserSecondaryIndex',
        KeySchema: [
          {
            AttributeName: 'USIPK',
            KeyType: KeyType.HASH,
          },
          {
            AttributeName: 'USISK',
            KeyType: KeyType.RANGE,
          },
        ],
        Projection: {
          ProjectionType: ProjectionType.ALL,
        },
      },
      {
        IndexName: 'RestaurantSecondaryIndex',
        KeySchema: [
          {
            AttributeName: 'RSIPK',
            KeyType: KeyType.HASH,
          },
          {
            AttributeName: 'RSISK',
            KeyType: KeyType.RANGE,
          },
        ],
        Projection: {
          ProjectionType: ProjectionType.ALL,
        },
      },
    ],
  });

  return dbClient.send(createTableCommand);
};
