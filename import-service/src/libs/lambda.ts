import middy from '@middy/core';
import cors from '@middy/http-cors';
import httpErrorHandler from '@middy/http-error-handler';
import { loggingMiddleware } from './loggingMiddleware';

export const middyfy = (handler: any) => {
  return middy(handler)
    .use(loggingMiddleware())
    .use(cors({
      credentials: true,
      headers: 'GET, OPTIONS, POST, PUT, DELETE',
    }))
    .use(httpErrorHandler());
}
