import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

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

    return { statusCode: 200, body: JSON.stringify('Hello, world!') };
};
