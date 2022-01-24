import middy from '@middy/core';
import { APIGatewayProxyEvent, APIGatewayProxyResult, SQSEvent } from 'aws-lambda';

export const loggingMiddleware = (): middy.MiddlewareObj<APIGatewayProxyEvent | SQSEvent, APIGatewayProxyResult> => {
  const before: middy.MiddlewareFn<APIGatewayProxyEvent | SQSEvent, APIGatewayProxyResult> = async (request) => {
    console.log('Incoming request:', request);
    if ('Records' in request?.event) {
      console.log('Records:', request.event.Records.map(({ body }) => body));
    }
  };
  const after: middy.MiddlewareFn<APIGatewayProxyEvent | SQSEvent, APIGatewayProxyResult> = async (request) => {
    console.log('Outcoming response:', request.response);
  };

  return {
    before,
    after,
  };
};
