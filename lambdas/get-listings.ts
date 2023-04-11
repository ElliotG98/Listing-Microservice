import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as AWS from 'aws-sdk';

const db = new AWS.DynamoDB.DocumentClient();

export const handler = async (
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
    console.log('EVENT: \n' + JSON.stringify(event, null, 2));

    const params = {
        TableName: process.env.TABLE_NAME || '',
    };

    try {
        const response = await db.scan(params).promise();
        return { statusCode: 200, body: JSON.stringify(response.Items) };
    } catch (e) {
        return { statusCode: 500, body: JSON.stringify(e) };
    }
};
