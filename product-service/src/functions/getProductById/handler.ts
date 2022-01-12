import createError from 'http-errors';

import { formatJSONResponse } from 'src/libs/apiGateway';
import { middyfy } from 'src/libs/lambda';

import { GetPathParamsHandlerType, UnknownObjectType } from 'src/types';

type PathParamsType = { productId: string };

type GetProductByIdParamsType = {
  product: UnknownObjectType,
}

export function getProduct({ product }: GetProductByIdParamsType) {
  if (!product) {
    throw createError(404);
  }

  return formatJSONResponse(product);
}

const handler: GetPathParamsHandlerType<PathParamsType> = async (event, context) => {
  const { pathParameters: { productId } } = event;
  const { dbClient } = context.clientContext.Custom;

  const { rows: product } = await dbClient.query(
    'SELECT p.id, p.title, p.description, p.price, s."count" FROM products as p INNER JOIN stocks as s ON p.id=s.product_id WHERE p.id = $1',
    [productId]
  );

  const response = getProduct({ product });
  return response;
}

export const main = middyfy(handler);
