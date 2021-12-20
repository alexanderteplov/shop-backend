// import schema from './schema';
import { handlerPath } from 'src/libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'products/{productId}',
        cors: true,
        request: {
          parameters: {
            paths: {
              productId: true,
            },
          },
        },
        documentation: {
          summary: 'Return a list of products',
          pathParams: [{
            name: 'productId',
            schema: {
              type: 'string',
            },
          }],
          methodResponses: [
            {
              statusCode: 200,
              responseModels: {
                'application/json': 'ProductByIdResponse'
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
