import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { ddbDocClient } from './libs/ddbDocClient';

export const handler = async (
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
    console.log('EVENT: \n' + JSON.stringify(event, null, 2));

    if (!event.body) {
        return {
            statusCode: 400,
            body: 'invalid request, you are missing the parameter body',
        };
    }

    const listing =
        typeof event.body == 'object' ? event.body : JSON.parse(event.body);

    console.log('LISTING: \n' + JSON.stringify(listing, null, 2));

    listing[process.env.PRIMARY_KEY || ''] = uuidv4();
    const params = {
        TableName: process.env.TABLE_NAME || '',
        Item: listing,
    };

    try {
        await ddbDocClient.send(new PutCommand(params));
        return { statusCode: 201, body: 'Success' };
    } catch (e) {
        return { statusCode: 500, body: JSON.stringify(e) };
    }
};
