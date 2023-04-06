import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

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

    return { statusCode: 200, body: JSON.stringify('Hello, world!') };
};
