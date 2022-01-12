import { getProduct } from '../handler';

describe('Test products/{productId} url', () => {
  const product = {
    id: '2',
    name: 'product 2',
  };

  test('Should return product by giving productId', () => {
    console.log(getProduct({ product }));
    const { statusCode, body } = getProduct({ product });
    expect(statusCode).toBe(200);
    expect(body).toEqual('{"id":"2","name":"product 2"}');
  });

  test('Should return 404 when no productList was provided', () => {
    const { statusCode, body } = getProduct({ product: undefined });
    expect(statusCode).toBe(404);
    expect(body).toBe(undefined);
  });
});
