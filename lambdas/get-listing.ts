import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { GetCommand } from '@aws-sdk/lib-dynamodb';
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
        const response = await ddbDocClient.send(new GetCommand(params));
        if (response?.Item) {
            return { statusCode: 200, body: JSON.stringify(response.Item) };
        } else {
            return {
                statusCode: 404,
                body: `There is no listing with ID: ${listingId}`,
            };
        }
    } catch (e) {
        console.log(e);
        return { statusCode: 500, body: JSON.stringify(e) };
    }
};
