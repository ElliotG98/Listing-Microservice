import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { ddbDocClient } from './libs/ddbDocClient';

export const handler = async (
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
    console.log('EVENT: \n' + JSON.stringify(event, null, 2));

    const params = {
        TableName: process.env.TABLE_NAME || '',
    };

    try {
        const response = await ddbDocClient.send(new QueryCommand(params));
        if (response?.Items) {
            return { statusCode: 200, body: JSON.stringify(response.Items) };
        } else {
            return {
                statusCode: 404,
                body: `There are no listings`,
            };
        }
    } catch (e) {
        return { statusCode: 500, body: JSON.stringify(e) };
    }
};
