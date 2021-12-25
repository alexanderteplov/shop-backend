import { createProduct } from '../handler';

describe('Test products/{productId} url', () => {
  const productId = "2";

  test('Should return productId by giving productId', () => {
    console.log(createProduct({ productId }));
    const { statusCode, body } = createProduct({ productId });
    expect(statusCode).toBe(200);
    expect(body).toEqual('2');
  });

  test('Should return 404 when no productList was provided', () => {
    const { statusCode, body } = createProduct({ productId: undefined });
    expect(statusCode).toBe(404);
    expect(body).toBe(undefined);
  });
});
