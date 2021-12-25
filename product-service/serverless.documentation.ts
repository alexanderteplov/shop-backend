export const documentation = {
  version: '1',
  title: 'Magic Shop API',
  description: 'Magic Shop Open API Documentation',
  models: [
    {
      name: 'Product',
      description: 'product',
      contentType: 'application/json',
      schema: {
        type: 'object',
        properties: {
          count: { type: 'number' },
          description: { type: 'string' },
          id: { type: 'string' },
          price: { type: 'number' },
          title: { type: 'string' },
        },
      },
    },
    {
      name: 'ProductListResponse',
      description: 'product list',
      contentType: 'application/json',
      schema: {
        type: 'array',
        items: '#/components/schemas/Product',
      },
    },
    {
      name: 'ErrorResponse',
      description: 'common error',
      contentType: 'application/json',
      schema: {},
    },
  ],
};
