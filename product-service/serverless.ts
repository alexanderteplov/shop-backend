import type { AWS } from '@serverless/typescript';

import { getProductById, getProductList, createProduct } from '@functions';

import { documentation } from 'serverless.documentation';
import { environment } from '../serverless.environment';

const serverlessConfiguration: AWS = {
  service: 'product-service',
  frameworkVersion: '2',
  plugins: [
    'serverless-esbuild',
    'serverless-openapi-documentation',
  ],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment,
    lambdaHashingVersion: '20201221',
    region: 'eu-west-1',
  },
  // import the function via paths
  functions: { getProductList, getProductById, createProduct },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: true,
      sourcemap: true,
      exclude: ['aws-sdk', 'pg-native'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    documentation,
  },
};

module.exports = serverlessConfiguration;
