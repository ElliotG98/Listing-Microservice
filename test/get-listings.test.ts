import { mockClient } from 'aws-sdk-client-mock';
import { handler as getListingFunction } from '../lambdas/get-listing';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { QueryCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { eventJSON } from './lib';

const ddbMock = mockClient(DynamoDBDocumentClient);

const getListingEvent: APIGatewayProxyEvent = eventJSON;

describe('GET listings', () => {
    beforeAll(() => {
        process.env = {
            PRIMARY_KEY: 'listingId',
            TABLE_NAME: 'table',
        };
    });

    afterEach(() => {
        ddbMock.reset();
    });

    test('returns the requested items', async () => {
        const event = {
            ...getListingEvent,
        };
        const expectedItems = [
            { id: '1', title: 'Test listings' },
            { id: '2', title: 'Test listings' },
        ];

        ddbMock.on(QueryCommand).resolves({ Items: expectedItems });

        const result = await getListingFunction(event);

        expect(result).toEqual(expectedItems);
    });
});
