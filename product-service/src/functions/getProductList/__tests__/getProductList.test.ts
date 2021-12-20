import { getProductList } from '../handler';

describe('Test products/ url', () => {
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

  test('Should return product by giving productId', () => {
    const { statusCode, body } = getProductList({ productList });
    expect(statusCode).toBe(200);
    expect(body).toEqual('[{"id":"1","name":"product 1"},{"id":"2","name":"product 2"}]');
  });

  test('Should return 404 when no productList was provided', () => {
    const { statusCode, body } = getProductList({ productList: undefined });
    expect(statusCode).toBe(404);
    expect(body).toBe(undefined);
  });
});
