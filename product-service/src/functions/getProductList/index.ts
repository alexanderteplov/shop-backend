import { handlerPath } from 'src/libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'products',
        cors: true,
        documentation: {
          summary: 'Return a list of products',
          methodResponses: [
            {
              statusCode: 200,
              responseModels: {
                'application/json': 'ProductListResponse'
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
