import { handlerPath } from 'src/libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: '/products',
      }
    }
  ]
}
