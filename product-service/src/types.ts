import { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';

export type GetHandlerType = Handler<Omit<APIGatewayProxyEvent, 'body'>, APIGatewayProxyResult>;
export type GetPathParamsHandlerType<PathParam> = Handler<
  Omit<APIGatewayProxyEvent, 'body' | 'pathParameters'> & { pathParameters: PathParam },
  APIGatewayProxyResult
>;

export type UnknownObjectType = Record<string, unknown>;
