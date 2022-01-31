import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { Handler, SQSEvent } from 'aws-lambda';
import createError from 'http-errors';
import { Client as PgClient } from 'pg';

import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

type CatalogBatchProcessParameters = {
  dbClient: PgClient,
  snsClient: SNSClient,
  event: SQSEvent,
};

const getValues = (fieldsNum: number, rowsNum: number) => {
  let values = '';
  for (let i = 1; i <= rowsNum; i++) {
    values += '(';
    for (let j = (i - 1) * fieldsNum + 1; j <= i * fieldsNum; j++) {
      values += `$${j}${j < i * fieldsNum ? ',' : ''}`
    }
    values += `)${i < rowsNum ? ',' : ''}`;
  }
  return values;
};

const getProductsFromEvent = (event: SQSEvent) => event.Records.reduce((acc, { body }) => {
  const { title, description, price, count } = JSON.parse(body);
  acc.productFieldsList.push(title, description, price);
  acc.countList.push(count);
  return acc;
}, { productFieldsList: [], countList: [] });

const catalogBatchProcess = async ({ dbClient, snsClient, event }: CatalogBatchProcessParameters) => {
  const { productFieldsList, countList } = getProductsFromEvent(event);

  await dbClient.query('BEGIN;');
  try {
    const { rows: productList } = await dbClient.query(
      `INSERT INTO products (title, description, price) VALUES ${getValues(3, event.Records.length)} RETURNING id,title,price;`,
      productFieldsList
    );

    const countFieldsList = countList.reduce((acc, count, i) => {
      acc.push(count ?? 0, productList[i].id);
      return acc;
    }, []);
    await dbClient.query(
      `INSERT INTO stocks ("count", product_id) VALUES ${getValues(2, event.Records.length)};`,
      countFieldsList
    );

    await dbClient.query('COMMIT;');

    const promises = productList.map(({ id, price, title }) => {
      const publishCommandInput = {
        Subject: 'New product has been created',
        Message: `Id: ${id}`,
        TopicArn: process.env.SNS_ARN,
        MessageAttributes: {
          price: {
            DataType: 'Number',
            StringValue: String(price),
          },
          title: {
            DataType: 'String',
            StringValue: title,
          },
        },
      };
      const publishCommand = new PublishCommand(publishCommandInput);
      return snsClient.send(publishCommand);
    });
    await Promise.allSettled(promises);
  } catch (error) {
    console.error('Database transaction error. Rolling back.', error);
    await dbClient.query('ROLLBACK;');
    throw createError(500);
  }
}

const handler: Handler<SQSEvent> = async (event, context) => {
  const { dbClient } = context.clientContext.Custom;
  const snsClient = new SNSClient({ region: 'eu-west-1' });

  await catalogBatchProcess({ dbClient, snsClient, event });

  return formatJSONResponse();
}

export const main = middyfy(handler);
