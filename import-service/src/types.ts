import { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';

export type GetHandlerType = Handler<Omit<APIGatewayProxyEvent, 'body'>, APIGatewayProxyResult>;

export type GetQueryStringHandlerType<QueryParams> = Handler<
  Omit<APIGatewayProxyEvent, 'body' | 'queryStringParameters'> & { queryStringParameters: QueryParams },
  APIGatewayProxyResult
  >;
