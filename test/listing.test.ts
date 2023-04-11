// import * as AWSMock from 'aws-sdk-mock';
// import * as AWS from 'aws-sdk';
// import { handler as getListingFunction } from '../lambdas/get-listing';

// test('GET listing', () => {
//     beforeAll(() => {
//         AWSMock.setSDKInstance(AWS);
//     });

//     afterEach(() => {
//         AWSMock.restore();
//     });

//     test('returns the requested item', async () => {
//         const event = { id: '123' };
//         const expectedItem = { id: '123', title: 'Test listing' };

//         AWSMock.mock('DynamoDB.DocumentClient', 'get', (params: unknown, callback: any) => {
//             callback(null, { Item: expectedItem });
//         });

//         const result = await getListingFunction(event);

//         expect(result).toEqual(expectedItem);
//     });

//     test('returns an error when the event payload is missing required fields', async () => {
//         const event = { invalidKey: '123' };

//         const result = await getListingFunction.handler(event);

//         expect(result.statusCode).toBe(400);
//         expect(result.body).toBe('Invalid request payload');
//     });

//     test('returns an error when the requested item is not found', async () => {
//         const event = { id: '123' };

//         AWSMock.mock('DynamoDB.DocumentClient', 'get', (params, callback) => {
//             expect(params).toEqual({
//                 TableName: 'my-table',
//                 Key: { id: '123' }
//             });
//             callback(null, {});
//         });

//         const result = await getListingFunction.handler(event);

//         expect(result.statusCode).toBe(404);
//         expect(result.body).toBe('Item not found');
//     });
// });
