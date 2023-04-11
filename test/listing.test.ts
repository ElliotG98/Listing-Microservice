import { mockClient } from 'aws-sdk-client-mock';
import { handler as getListingFunction } from '../lambdas/get-listing';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { GetCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const ddbMock = mockClient(DynamoDBDocumentClient);

const getListingEvent: APIGatewayProxyEvent = {
    httpMethod: 'GET',
    path: '/get-listing',
    headers: {
        'Content-Type': 'application/json',
    },
    body: null,
    isBase64Encoded: false,
    pathParameters: null,
    stageVariables: null,
    multiValueHeaders: {
        accept: [
            'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        ],
        'accept-encoding': ['gzip, deflate, br'],
    },
    resource: '/',
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    requestContext: {
        accountId: '123456789012',
        authorizer: null,
        resourcePath: '/',
        apiId: '70ixmpl4fl',
        protocol: 'HTTP/1.1',
        httpMethod: 'GET',
        path: '/Prod/',
        resourceId: '2gxmpl',
        stage: 'Prod',
        requestTimeEpoch: 1583798639428,
        requestId: '77375676-xmpl-4b79-853a-f982474efe18',
        identity: {
            cognitoIdentityPoolId: null,
            accountId: null,
            cognitoIdentityId: null,
            caller: null,
            sourceIp: '52.255.255.12',
            principalOrgId: null,
            accessKey: null,
            cognitoAuthenticationType: null,
            cognitoAuthenticationProvider: null,
            userArn: null,
            userAgent:
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36',
            user: null,
            apiKey: '123',
            apiKeyId: '123',
            clientCert: null,
        },
    },
};

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
