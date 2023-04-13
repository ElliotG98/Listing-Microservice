import { handler as getListingsFunction } from '../lambdas/get-listings';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { eventJSON } from './lib';

const getListingEvent: APIGatewayProxyEvent = eventJSON;
const expectedItems = [
    { id: '1', title: 'Test listings' },
    { id: '2', title: 'Test listings' },
];
jest.mock('../lambdas/libs/ddbDocClient', () => {
    return {
        ddbDocClient: {
            send: jest.fn().mockImplementation((command) => {
                console.log(command);
                return Promise.resolve({ Items: expectedItems });
            }),
        },
    };
});

describe('GET listings', () => {
    beforeAll(() => {
        process.env = {
            PRIMARY_KEY: 'listingId',
            TABLE_NAME: 'table',
        };
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test('returns the requested items', async () => {
        const event = {
            ...getListingEvent,
        };

        const result = await getListingsFunction(event);

        expect(JSON.parse(result.body)).toEqual(expectedItems);
    });
});
