import { readFileSync } from 'fs';
import { Client } from 'pg';
import { environment as env } from '../../serverless.environment';

export const initDatabase = async () => {
  const file = './initDatabase.sql';
  const sql = readFileSync(file, 'utf8');

  const clientConfig = {
    host: env.DB_HOST,
    port: +env.DB_PORT,
    database: env.DB_NAME,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    ssl: {
      rejectUnauthorized: false,
    },
    connectionTimeoutMillis: 5000,
  };

  try {
    const client = new Client(clientConfig);
    await client.connect();
    await client.query(sql)
    client.end();
    console.log('Database initiated successfully.');
  } catch (error) {
    console.error('Database error:', error);
  }
};
