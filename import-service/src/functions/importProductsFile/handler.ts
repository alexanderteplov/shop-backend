import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { GetQueryStringHandlerType } from 'src/types';

type QueryParamsType = {
  name: string,
};

const importProductsFile: GetQueryStringHandlerType<QueryParamsType> = async ({ queryStringParameters: { name } }) => {
  const client = new S3Client({ region: 'eu-west-1' });
  const command = new PutObjectCommand({
    Bucket: 'magic-files',
    Key: `uploaded/${name}`,
    ContentType: 'text/csv',
  });

  const signedUrl = await getSignedUrl(client, command, { expiresIn: 60 });

  return formatJSONResponse(signedUrl);
}

export const main = middyfy(importProductsFile);
