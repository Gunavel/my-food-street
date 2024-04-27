import { TransactWriteCommand } from '@aws-sdk/lib-dynamodb';

import { ENTITY_TYPES } from '@/api/constants';
import getDBClient from '@/common/utils/dbClient';

import { CreateUserInput } from './authModel';

export const createUserAccount = async ({
  userInput,
  userId,
  hashPassword,
}: {
  userInput: CreateUserInput;
  userId: string;
  hashPassword: string;
}) => {
  const dbClient = getDBClient();

  const params = new TransactWriteCommand({
    TransactItems: [
      {
        Put: {
          TableName: process.env.DYNAMODB_TABLE_NAME,
          Item: {
            PK: userId,
            SK: userId,
            EntityType: ENTITY_TYPES.USER,
            UserId: userId,
            Name: userInput.name,
            Email: userInput.email,
            Password: hashPassword,
            Role: userInput.role,
          },
          ConditionExpression: 'attribute_not_exists(PK)',
        },
      },
      {
        Put: {
          TableName: process.env.DYNAMODB_TABLE_NAME,
          Item: {
            PK: userInput.email,
            SK: userInput.email,
            EntityType: ENTITY_TYPES.USER,
            UserId: userId,
            Name: userInput.name,
            Email: userInput.email,
            Password: hashPassword,
            Role: userInput.role,
          },
          ConditionExpression: 'attribute_not_exists(PK)',
        },
      },
    ],
  });

  return dbClient.send(params);
};

export const getUserByEmail = async ({ email }: { email: string }) => {
  const dbClient = getDBClient();

  const params = {
    TableName: process.env.DYNAMODB_TABLE_NAME,
    Key: {
      PK: email,
      SK: email,
    },
  };

  return dbClient.get(params);
};
