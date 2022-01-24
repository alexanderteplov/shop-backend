import {
  S3Client,
  GetObjectCommand,
  CopyObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import {
  SQSClient,
  SendMessageCommand,
} from '@aws-sdk/client-sqs';
import csv from 'csv-parser';

import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import stream from 'stream';
import { promisify } from 'util';
import { Handler, S3Event } from 'aws-lambda';
import createError from 'http-errors';

const importFileParser: Handler<S3Event> = async (event) => {
  for await (const { s3 } of event.Records) {
    const s3ObjectKey = s3.object.key;

    const BUCKET = 'magic-files';

    const client = new S3Client({ region: 'eu-west-1' });

    const getObject = new GetObjectCommand({
      Bucket: BUCKET,
      Key: s3ObjectKey,
    });

    const copyObject = new CopyObjectCommand({
      Bucket: BUCKET,
      Key: s3ObjectKey.replace('uploaded/', 'parsed/'),
      CopySource: `${BUCKET}/${s3ObjectKey}`,
    });

    const deleteObject = new DeleteObjectCommand({
      Bucket: BUCKET,
      Key: s3ObjectKey,
    });

    const pipeline = promisify(stream.pipeline);

    const sqs = new SQSClient({ region: 'eu-west-1' });

    const transformStream = new stream.Transform({
      transform: (json: Record<string, string>, _, callback) => {
        const sendMessage = new SendMessageCommand({
          QueueUrl: process.env.SQS_URL,
          MessageBody: JSON.stringify(json),
        });
        sqs.send(sendMessage)
        callback(null, json);
      },
      objectMode: true,
    });

    try {
      const { Body } = await client.send(getObject);

      await pipeline(
        Body,
        csv(),
        transformStream,
      );

      await client.send(copyObject);
      await client.send(deleteObject);
    } catch (error) {
      console.error(error);
      throw createError(500);
    }
  }

  return formatJSONResponse();
}

export const main = middyfy(importFileParser);
