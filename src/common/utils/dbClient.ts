import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';

let client: DynamoDBDocument | null = null;

const getDBClient = () => {
  if (!client) {
    const dbClient = new DynamoDB({ endpoint: process.env.DYNAMODB_URL });
    client = DynamoDBDocument.from(dbClient);
  }

  return client;
};

export default getDBClient;
