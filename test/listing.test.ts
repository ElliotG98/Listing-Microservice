import * as AWSMock from 'aws-sdk-mock';
import * as AWS from 'aws-sdk';
import { handler as getListingFunction } from '../lambdas/get-listing';
import { APIGatewayProxyEvent } from 'aws-lambda';

const getListingEvent: Partial<APIGatewayProxyEvent> = {
    httpMethod: 'GET',
    path: '/get-listing',
    headers: {
        'Content-Type': 'application/json',
    },
    isBase64Encoded: false,
    pathParameters: null,
    stageVariables: null,
};

test('GET listing', () => {
    beforeAll(() => {
        AWSMock.setSDKInstance(AWS);
    });

    afterEach(() => {
        AWSMock.restore();
    });

    test('returns the requested item', async () => {
        const event = {
            ...getListingEvent,
            queryStringParameters: {
                id: '123',
            },
        };
        const expectedItem = { id: '123', title: 'Test listing' };

        AWSMock.mock(
            'DynamoDB.DocumentClient',
            'get',
            (params: unknown, callback: any) => {
                callback(null, { Item: expectedItem });
            }
        );

        const result = await getListingFunction(event);

        expect(result).toEqual(expectedItem);
    });

    test('returns an error when the event payload is missing required fields', async () => {
        const event = {
            ...getListingEvent,
        };

        const result = await getListingFunction(event);

        expect(result.statusCode).toBe(400);
    });

    test('returns an error when the requested item is not found', async () => {
        const event = {
            ...getListingEvent,
            queryStringParameters: {
                id: '123',
            },
        };

        AWSMock.mock(
            'DynamoDB.DocumentClient',
            'get',
            (params: unknown, callback: any) => {
                callback(null, {});
            }
        );

        const result = await getListingFunction(event);

        expect(result.statusCode).toBe(404);
    });
});
