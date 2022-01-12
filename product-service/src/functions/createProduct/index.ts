// import schema from './schema';
import { handlerPath } from 'src/libs/handlerResolver';
import schema from './schema';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'post',
        path: 'products',
        cors: true,
        request: {
          schemas: {
            'application/json': schema,
          },
        },
        documentation: {
          summary: 'Create a new product',
          requestBody: { description: 'A product object' },
          requstModels: {
            'application/json': schema,
          },
          methodResponses: [
            {
              statusCode: 200,
              responseModels: {
                'application/json': 'Product'
              },
            },
            {
              statusCode: 404,
              responseModels: {
                'application/json': 'ErrorResponse',
              },
            },
          ],
        },
      }
    }
  ]
}
