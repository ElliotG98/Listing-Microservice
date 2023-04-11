import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as AWS from 'aws-sdk';

const db = new AWS.DynamoDB.DocumentClient();

export const handler = async (
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
    console.log('EVENT: \n' + JSON.stringify(event, null, 2));

    const listingId = event.pathParameters?.id;

    if (!listingId) {
        return {
            statusCode: 400,
            body: 'Error: You are missing the listing id',
        };
    }

    const params = {
        TableName: process.env.TABLE_NAME || '',
        Key: {
            [process.env.PRIMARY_KEY || '']: listingId,
        },
    };

    try {
        await db.delete(params).promise();
        return { statusCode: 200, body: 'Success' };
    } catch (e) {
        return { statusCode: 500, body: JSON.stringify(e) };
    }
};
