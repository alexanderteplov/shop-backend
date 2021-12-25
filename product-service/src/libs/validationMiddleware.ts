import middy from '@middy/core';
import Ajv from 'ajv';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import createError from 'http-errors';

const mimePattern = /^application\/(.+\+)?json(;.*)?$/;

export const validationMiddleware = (schema: object): middy.MiddlewareObj<APIGatewayProxyEvent, APIGatewayProxyResult> => {
  const before: middy.MiddlewareFn<APIGatewayProxyEvent, APIGatewayProxyResult> = async (request) => {
    if (!schema) {
      return;
    }

    try {
      const event = typeof request.event === 'string' ? JSON.parse(request.event) : request.event;
      const { headers } = event;
      const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
      const contentTypeHeader = headers?.['Content-Type'] ?? headers?.['content-type'];

      if (mimePattern.test(contentTypeHeader)) {
        const ajv = new Ajv();
        const validate = ajv.compile(schema);
        const valid = validate(body);
        if (!valid) {
          console.error('Invalid json: ', validate.errors);
          throw createError(400);
        }
        request.event.body = body;
      }
    } catch (error) {
      console.error('Validation error:', error);
      throw createError(400);
    }
  };

  return {
    before,
  };
};
