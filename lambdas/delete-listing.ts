import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { ddbDocClient } from './libs/ddbDocClient';

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
        await ddbDocClient.send(new DeleteCommand(params));
        return { statusCode: 200, body: 'Success' };
    } catch (e) {
        return { statusCode: 500, body: JSON.stringify(e) };
    }
};
