import { getProductById } from '../handler';

describe('Test products/{productId} url', () => {
  const productList = [
    {
      id: '1',
      name: 'product 1',
    },
    {
      id: '2',
      name: 'product 2',
    },
  ];

  const pathParameters = {
    productId: '2',
  };

  test('Should return product by giving productId', () => {
    console.log(getProductById({ productList, pathParameters }));
    const { statusCode, body } = getProductById({ productList, pathParameters });
    expect(statusCode).toBe(200);
    expect(body).toEqual('{"id":"2","name":"product 2"}');
  });

  test('Should return 404 when no productList was provided', () => {
    const { statusCode, body } = getProductById({ productList: undefined, pathParameters });
    expect(statusCode).toBe(404);
    expect(body).toBe(undefined);
  });

  test('Should return 404 with incorrect productId', () => {
    const incorrectPathParameters = { productId: '7' };
    const { statusCode, body } = getProductById({ productList, pathParameters: incorrectPathParameters });
    expect(statusCode).toBe(404);
    expect(body).toBe(undefined);
  });
});
