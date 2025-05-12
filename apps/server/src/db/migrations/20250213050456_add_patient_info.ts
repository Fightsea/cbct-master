import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('patients', t => {
    t.float('height').notNullable().defaultTo(0);
    t.float('weight').notNullable().defaultTo(0);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('patients', t => {
    t.dropColumn('height');
    t.dropColumn('weight');
  });
}

