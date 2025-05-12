import knexConfig from '../../knexfile';
import knex, { Knex } from 'knex';
import { overrideTypeParser } from '@/utils/pg';
import { getNowTime } from '@cbct/utils/moment';

overrideTypeParser();

const db: Knex = knex(knexConfig);
db.on('start', builder => console.log(`${getNowTime()} SQL: ${builder.toQuery()}`));

export default db;
