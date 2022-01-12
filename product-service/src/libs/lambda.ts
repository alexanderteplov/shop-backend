import middy from '@middy/core';
import cors from '@middy/http-cors';
import httpErrorHandler from '@middy/http-error-handler';

import { dbMiddleware } from './dbMiddleware';
import { loggingMiddleware } from './loggingMiddleware';
import { validationMiddleware } from './validationMiddleware';

export const middyfy = (handler: any, schema?: object) => {
  return middy(handler)
    .use(loggingMiddleware())
    .use(validationMiddleware(schema))
    .use(dbMiddleware())
    .use(cors({
      credentials: true,
      headers: 'GET, OPTIONS, POST, PUT, DELETE',
    }))
    .use(httpErrorHandler());
};
