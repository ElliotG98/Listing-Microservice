#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { ListingStack } from '../lib/listing-stack';

const app = new cdk.App();
new ListingStack(
    app,
    'ListingStack',
    {
        env: {
            region: process.env.AWS_REGION,
            account: process.env.AWS_ACCOUNT,
        },
    },
    { userPoolId: process.env.USER_POOL_ID as string }
);
