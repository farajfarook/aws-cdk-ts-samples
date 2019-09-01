#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { CdkSamStack } from '../lib/cdk-sam-stack';

const app = new cdk.App();
new CdkSamStack(app, 'CdkSamStack');
