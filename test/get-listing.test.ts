import { handler as getListingFunction } from '../lambdas/get-listing';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { eventJSON } from './lib';

const getListingEvent: APIGatewayProxyEvent = eventJSON;
const expectedItem = { id: '123', title: 'Test listing' };

jest.mock('../lambdas/libs/ddbDocClient', () => {
    return {
        ddbDocClient: {
            send: jest.fn().mockImplementation((command) => {
                console.log(command);
                return Promise.resolve({ Item: expectedItem });
            }),
        },
    };
});

describe('GET listing', () => {
    beforeAll(() => {
        process.env = {
            PRIMARY_KEY: 'listingId',
            TABLE_NAME: 'table',
        };
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test('returns the requested item', async () => {
        const event = {
            ...getListingEvent,
            pathParameters: {
                id: '123',
            },
        };

        try {
            const result = await getListingFunction(event);

            expect(JSON.parse(result.body)).toEqual(expectedItem);
        } catch (e) {
            console.log(e);
        }
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

        const result = await getListingFunction(event);

        expect(result.statusCode).toBe(404);
    });
});
