import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'import',
        cors: true,
        request: {
          parameters: {
            querystrings: {
              name: true,
            },
            queryStringParameters: {
              name: 'string',
            },
          },
        },
        authorizer: {
          name: 'BasicAuthorizer',
          arn: 'arn:aws:lambda:eu-west-1:728045493148:function:authorization-service-dev-basicAuthorizer',
          resultTtlInSeconds: 0,
          identitySource: 'method.request.header.Authorization',
          type: 'token',
        }
      }
    }
  ]
}
