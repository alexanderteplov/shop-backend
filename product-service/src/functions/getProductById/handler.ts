import { formatJSONResponse, notFoundResponse } from 'src/libs/apiGateway';
import { middyfy } from 'src/libs/lambda';

import { GetPathParamsHandlerType, UnknownObjectType } from 'src/types';
import productList from 'src/mocks/productList.json';

type PathParamsType = { productId: string };

type GetProductByIdParamsType = {
  productList: UnknownObjectType[],
  pathParameters: PathParamsType,
}

export function getProductById({ pathParameters: { productId }, productList }: GetProductByIdParamsType) {
  const product = productList?.find(({ id }) => id === productId);

  if (!product) {
    return notFoundResponse;
  }

  return formatJSONResponse(product);
}

const handler: GetPathParamsHandlerType<PathParamsType> = async (event) => {
  const { pathParameters } = event;
  const response = getProductById({ pathParameters, productList });
  return response;
}

export const main = middyfy(handler);
