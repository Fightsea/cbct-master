import type { Knex } from 'knex';
import dotenv from 'dotenv';
dotenv.config();

export default {
  client: process.env.DB_CLIENT,
  connection: {
    host: process.env.DB_HOST!,
    port: +process.env.DB_PORT!,
    user: process.env.DB_USERNAME!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!
  },
  pool: {
    min: 0,
    max: 3,
    propagateCreateError: false,
    afterCreate: (connection: any, cb: any) => {
      connection.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
      connection.query('SET timezone="Asia/Taipei";', (err: any) => cb(err, connection));
    }
  },
  migrations: {
    directory: __dirname + '/src/db/migrations',
    tableName: 'knex_migrations'
  }
} as Knex.Config;
