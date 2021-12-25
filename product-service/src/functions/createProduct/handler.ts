import createError from 'http-errors';
import { formatJSONResponse, ValidatedEventAPIGatewayProxyEvent } from 'src/libs/apiGateway';
import { middyfy } from 'src/libs/lambda';

import schema from './schema';

type GetProductByIdParamsType = {
  productId: string,
}

export function createProduct({ productId }: GetProductByIdParamsType) {
  if (!productId) {
    throw createError(404);
  }

  return formatJSONResponse(productId);
}

const handler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event, context) => {
  const { body: { title, description, price, count } } = event;
  const { dbClient } = context.clientContext.Custom;

  await dbClient.query('BEGIN;');
  try {
    const { rows: [{ id: productId }] } = await dbClient.query(
      'INSERT INTO products (title, description, price) VALUES ($1, $2, $3) RETURNING id;',
      [title, description ?? 'NULL', price]
    );

    await dbClient.query(
      'INSERT INTO stocks ("count", product_id) VALUES ($1, $2);',
      [count ?? 0, productId]
    );

    await dbClient.query('COMMIT;');

    const response = createProduct({ productId });

    return response;
  } catch (error) {
    console.error('Database transaction error. Rolling back.', error);
    await dbClient.query('ROLLBACK;');
    throw createError(500);
  }
}

export const main = middyfy(handler, schema);
