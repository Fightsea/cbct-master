import { Knex } from 'knex';
import db from '@/db';
import { Patient } from '@/db/models';

export const generateSerialNumber = async (trx?: Knex.Transaction) => {
  const count = await Patient.query(trx || db)
    .count('id')
    .first()
    .castTo<{ count: number }>()
    .then(result => +result.count);

  return String(count + 1).padStart(8, '0');
};
