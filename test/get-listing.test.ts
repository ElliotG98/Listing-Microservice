import { mockClient } from 'aws-sdk-client-mock';
import { handler as getListingFunction } from '../lambdas/get-listing';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { GetCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { eventJSON } from './lib';

const ddbMock = mockClient(DynamoDBDocumentClient);

const getListingEvent: APIGatewayProxyEvent = eventJSON;

describe('GET listing', () => {
    beforeAll(() => {
        process.env = {
            PRIMARY_KEY: 'listingId',
            TABLE_NAME: 'table',
        };
    });

    afterEach(() => {
        ddbMock.reset();
    });

    test('returns the requested item', async () => {
        const event = {
            ...getListingEvent,
            pathParameters: {
                id: '123',
            },
        };
        const expectedItem = { id: '123', title: 'Test listing' };

        ddbMock.on(GetCommand).resolves({ Item: expectedItem });

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
            pathParameters: {
                id: '123',
            },
        };

        ddbMock.on(GetCommand).resolves({ Item: {} });

        const result = await getListingFunction(event);

        expect(result.statusCode).toBe(404);
    });
});
