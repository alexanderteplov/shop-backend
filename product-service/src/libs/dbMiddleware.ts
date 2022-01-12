import middy from '@middy/core';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Client } from 'pg';
import createError from 'http-errors';

export const dbMiddleware = (): middy.MiddlewareObj<APIGatewayProxyEvent, APIGatewayProxyResult> => {
  const {
    DB_HOST,
    DB_PORT,
    DB_NAME,
    DB_USER,
    DB_PASSWORD,
  } = process.env;

  const clientConfig = {
    host: DB_HOST,
    port: +DB_PORT,
    database: DB_NAME,
    user: DB_USER,
    password: DB_PASSWORD,
    ssl: {
      rejectUnauthorized: false,
    },
    connectionTimeoutMillis: 5000,
  };

  const before: middy.MiddlewareFn<APIGatewayProxyEvent, APIGatewayProxyResult> = async (request) => {
    const client = new Client(clientConfig);
    await client.connect();
    request.context.clientContext = {
      ...request.context.clientContext,
      Custom: {
        ...request.context.clientContext?.Custom,
        dbClient: client,
      },
    };
  };

  const after: middy.MiddlewareFn<APIGatewayProxyEvent, APIGatewayProxyResult> = async (request) => {
    const { dbClient } = request.context.clientContext.Custom;
    dbClient.end();
  };

  const onError: middy.MiddlewareFn<APIGatewayProxyEvent, APIGatewayProxyResult> = async (request) => {
    // @ts-ignore
    if (request.error.statusCode) {
      throw request.error;
    }
    console.error('Database error: ', request.error);
    throw createError(500);
  };

  return {
    before,
    after,
    onError,
  };
};
