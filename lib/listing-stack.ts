import {
    type IResource,
    LambdaIntegration,
    MockIntegration,
    PassthroughBehavior,
    RestApi,
} from 'aws-cdk-lib/aws-apigateway';
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { App, Stack, RemovalPolicy, StackProps } from 'aws-cdk-lib';
import {
    NodejsFunction,
    type NodejsFunctionProps,
} from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';

export class ListingStack extends Stack {
    constructor(app: App, id: string, props?: StackProps) {
        super(app, id, props);

        const dynamoTable = new Table(this, 'listing', {
            partitionKey: {
                name: 'listingId',
                type: AttributeType.STRING,
            },
            sortKey: {
                name: 'title',
                type: AttributeType.STRING,
            },
            tableName: 'listing',
            removalPolicy: RemovalPolicy.DESTROY,
        });

        const nodeJsFunctionProps: NodejsFunctionProps = {
            bundling: {
                externalModules: [
                    'aws-sdk', // Use the 'aws-sdk' available in the Lambda runtime
                ],
            },
            depsLockFilePath: join(__dirname, 'lambdas', 'package-lock.json'),
            environment: {
                PRIMARY_KEY: 'listingId',
                TABLE_NAME: dynamoTable.tableName,
                region: process.env.region || '',
            },
            runtime: Runtime.NODEJS_18_X,
        };

        const getListing = new NodejsFunction(this, 'getListingLambda', {
            entry: join(__dirname, 'lambdas', 'get-listing.ts'),
            ...nodeJsFunctionProps,
        });
        const getListings = new NodejsFunction(this, 'getListingsLambda', {
            entry: join(__dirname, 'lambdas', 'get-listings.ts'),
            ...nodeJsFunctionProps,
        });
        const createListing = new NodejsFunction(this, 'createListingLambda', {
            entry: join(__dirname, 'lambdas', 'create-listing.ts'),
            ...nodeJsFunctionProps,
        });
        const updateListing = new NodejsFunction(this, 'updateListingLambda', {
            entry: join(__dirname, 'lambdas', 'update-listing.ts'),
            ...nodeJsFunctionProps,
        });
        const deleteListing = new NodejsFunction(this, 'deleteListingLambda', {
            entry: join(__dirname, 'lambdas', 'delete-listing.ts'),
            ...nodeJsFunctionProps,
        });

        dynamoTable.grantReadWriteData(getListing);
        dynamoTable.grantReadWriteData(getListings);
        dynamoTable.grantReadWriteData(createListing);
        dynamoTable.grantReadWriteData(updateListing);
        dynamoTable.grantReadWriteData(deleteListing);

        const getListingsIntegration = new LambdaIntegration(getListings);
        const createListingIntegration = new LambdaIntegration(createListing);
        const getListingIntegration = new LambdaIntegration(getListing);
        const updateListingIntegration = new LambdaIntegration(updateListing);
        const deleteListingIntegration = new LambdaIntegration(deleteListing);

        const api = new RestApi(this, 'listingsApi', {
            restApiName: 'Listings Service',
        });

        const listings = api.root.addResource('listings');
        listings.addMethod('GET', getListingsIntegration);
        listings.addMethod('POST', createListingIntegration);
        addCorsOptions(listings);

        const listing = listings.addResource('{id}');
        listing.addMethod('GET', getListingIntegration);
        listing.addMethod('PATCH', updateListingIntegration);
        listing.addMethod('DELETE', deleteListingIntegration);
        addCorsOptions(listing);
    }
}

export function addCorsOptions(apiResource: IResource) {
    apiResource.addMethod(
        'OPTIONS',
        new MockIntegration({
            integrationResponses: [
                {
                    statusCode: '200',
                    responseParameters: {
                        'method.response.header.Access-Control-Allow-Headers':
                            "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
                        'method.response.header.Access-Control-Allow-Origin':
                            "'*'", //TODO: change to specific domains
                        'method.response.header.Access-Control-Allow-Credentials':
                            "'false'",
                        'method.response.header.Access-Control-Allow-Methods':
                            "'OPTIONS,GET,PUT,POST,DELETE'",
                    },
                },
            ],
            passthroughBehavior: PassthroughBehavior.NEVER,
            requestTemplates: {
                'application/json': '{"statusCode": 200}',
            },
        }),
        {
            methodResponses: [
                {
                    statusCode: '200',
                    responseParameters: {
                        'method.response.header.Access-Control-Allow-Headers':
                            true,
                        'method.response.header.Access-Control-Allow-Methods':
                            true,
                        'method.response.header.Access-Control-Allow-Credentials':
                            true,
                        'method.response.header.Access-Control-Allow-Origin':
                            true,
                    },
                },
            ],
        }
    );
}
