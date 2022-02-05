import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
const importProductsFile = async ({ client, name }) => {
    const command = new PutObjectCommand({
        Bucket: 'magic-files',
        Key: `uploaded/${name}`,
        ContentType: 'text/csv',
    });
    return await getSignedUrl(client, command, { expiresIn: 60 });
};
const handler = async ({ queryStringParameters: { name } }) => {
    const client = new S3Client({ region: 'eu-west-1' });
    const signedUrl = await importProductsFile({ client, name });
    return formatJSONResponse(signedUrl);
};
export const main = middyfy(handler);
//# sourceMappingURL=handler.js.map