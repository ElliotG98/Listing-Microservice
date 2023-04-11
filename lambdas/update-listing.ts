import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as AWS from 'aws-sdk';

const db = new AWS.DynamoDB.DocumentClient();

export const handler = async (
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
    console.log('EVENT: \n' + JSON.stringify(event, null, 2));

    const body = event.body;

    if (!body) {
        return {
            statusCode: 400,
            body: 'Error: you are missing the request body',
        };
    }

    const listingId = event.pathParameters?.id;

    if (!listingId) {
        return {
            statusCode: 400,
            body: 'Error: You are missing the listing id',
        };
    }

    const listingToUpdate: any =
        typeof body == 'object' ? body : JSON.parse(body);
    const listingProperties = Object.keys(listingToUpdate);
    if (!listingToUpdate || listingProperties.length < 1) {
        return { statusCode: 400, body: 'No arguments provided' };
    }

    const firstProperty = listingProperties.splice(0, 1);
    const params: any = {
        TableName: process.env.TABLE_NAME || '',
        Key: {
            [process.env.PRIMARY_KEY || '']: listingId,
        },
        UpdateExpression: `set ${firstProperty} = :${firstProperty}`,
        ExpressionAttributeValues: {},
        ReturnValues: 'UPDATED_NEW',
    };
    params.ExpressionAttributeValues[`:${firstProperty}`] =
        listingToUpdate[`${firstProperty}`];

    listingProperties.forEach((property) => {
        params.UpdateExpression += `, ${property} = :${property}`;
        params.ExpressionAttributeValues[`:${property}`] =
            listingToUpdate[property];
    });

    try {
        await db.update(params).promise();
        return { statusCode: 204, body: '' };
    } catch (e) {
        return { statusCode: 500, body: JSON.stringify(e) };
    }
};
