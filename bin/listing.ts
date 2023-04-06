#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { ListingStack } from '../lib/listing-stack';

const app = new cdk.App();
new ListingStack(app, 'ListingStack');
