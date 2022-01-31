import middy from '@middy/core';
import { APIGatewayProxyEvent, APIGatewayProxyResult, S3Event, SQSEvent } from 'aws-lambda';

function isSqsEvent(event: SQSEvent | S3Event | APIGatewayProxyEvent): event is SQSEvent {
  if (!('Records' in event)) return false;
  return (event as SQSEvent).Records[0].body !== undefined;
}

function isS3Event(event: SQSEvent | S3Event | APIGatewayProxyEvent): event is S3Event {
  if (!('Records' in event)) return false;
  return (event as S3Event).Records[0].s3 !== undefined;
}

export const loggingMiddleware = (): middy.MiddlewareObj<APIGatewayProxyEvent | SQSEvent, APIGatewayProxyResult> => {
  const before: middy.MiddlewareFn<APIGatewayProxyEvent | SQSEvent | S3Event, APIGatewayProxyResult> = async (request) => {
    console.log('Incoming request:', request);
    const { event } = request;
    if (isSqsEvent(event)) {
      console.log('Record body list:', event.Records.map(({ body }) => body));
    };
    if (isS3Event(event)) {
      console.log('Record key list:', event.Records.map(({ s3 }) => s3.object.key));
    };
  };
  const after: middy.MiddlewareFn<APIGatewayProxyEvent | SQSEvent, APIGatewayProxyResult> = async (request) => {
    console.log('Outcoming response:', request.response);
  };

  return {
    before,
    after,
  };
};
