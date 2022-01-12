import createError from 'http-errors';

import { formatJSONResponse } from 'src/libs/apiGateway';
import { middyfy } from 'src/libs/lambda';

import { GetHandlerType, UnknownObjectType } from 'src/types';

type GetProductListType = {
  productList: UnknownObjectType[],
}

export function getProductList({ productList }: GetProductListType) {
  if (!productList) {
    throw createError(404);
  }

  return formatJSONResponse(productList);
}

const handler: GetHandlerType = async (_, context) => {
  const { dbClient } = context.clientContext.Custom;

  const { rows: productList } = await dbClient.query(
    'SELECT p.id, title, description, price, s."count" FROM products as p INNER JOIN stocks as s ON p.id=s.product_id;'
  );

  const response = getProductList({ productList });
  return response;
}

export const main = middyfy(handler);
