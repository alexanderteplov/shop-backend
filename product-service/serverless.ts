import type { AWS } from '@serverless/typescript';

import { getProductById, getProductList } from '@functions';

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
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
    lambdaHashingVersion: '20201221',
    region: 'eu-west-1',
  },
  // import the function via paths
  functions: { getProductList, getProductById },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: true,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    documentation: {
      version: '1',
      title: 'Magic Shop API',
      description: 'Magic Shop Open API Documentation',
      models: [
        {
          name: 'ProductByIdResponse',
          description: 'product',
          contentType: 'application/json',
          schema: {
            type: 'object',
            properties: {
              count: { type: 'number' },
              description: { type: 'string' },
              id: { type: 'string' },
              price: { type: 'number' },
              title: { type: 'string' },
            },
          },
        },
        {
          name: 'ProductListResponse',
          description: 'product list',
          contentType: 'application/json',
          schema: {
            type: 'array',
            items: '#/components/schemas/ProductByIdResponse',
          },
        },
        {
          name: 'ErrorResponse',
          description: 'common error',
          contentType: 'application/json',
          schema: {},
        },
      ],
    },
  },
};

module.exports = serverlessConfiguration;
