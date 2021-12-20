import { formatJSONResponse, notFoundResponse } from 'src/libs/apiGateway';
import { middyfy } from 'src/libs/lambda';

import { GetHandlerType, UnknownObjectType } from 'src/types';
import productList from 'src/mocks/productList.json';

type GetProductListType = {
  productList: UnknownObjectType[],
}

export function getProductList({ productList }: GetProductListType) {
  if (!productList) {
    return notFoundResponse;
  }

  return formatJSONResponse(productList);
}
const handler: GetHandlerType = async () => {
  const response = getProductList({ productList });
  return response;
}

export const main = middyfy(handler);
