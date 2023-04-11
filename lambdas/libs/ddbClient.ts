import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

const ddbClient = new DynamoDBClient({ region: process.env.region });

export { ddbClient };
