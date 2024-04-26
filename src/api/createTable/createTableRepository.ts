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
      {
        AttributeName: 'USIPK',
        AttributeType: ScalarAttributeType.S,
      },
      {
        AttributeName: 'USISK',
        AttributeType: ScalarAttributeType.S,
      },
      {
        AttributeName: 'RSIPK',
        AttributeType: ScalarAttributeType.S,
      },
      {
        AttributeName: 'RSISK',
        AttributeType: ScalarAttributeType.S,
      },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5,
    },
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
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5,
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
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5,
        },
      },
    ],
  });

  return dbClient.send(createTableCommand);
};
