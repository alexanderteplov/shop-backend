import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from "aws-lambda"
import type { FromSchema } from "json-schema-to-ts";

import { UnknownObjectType } from 'src/types';

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & { body: FromSchema<S> }
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<ValidatedAPIGatewayProxyEvent<S>, APIGatewayProxyResult>

export const formatJSONResponse = (response: UnknownObjectType | UnknownObjectType[] ) => {
  return {
    statusCode: 200,
    body: JSON.stringify(response)
  }
}

export const notFoundResponse = {
  statusCode: 404,
  body: undefined,
};
