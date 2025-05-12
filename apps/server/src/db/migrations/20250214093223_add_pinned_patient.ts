import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('patients', t => {
    t.boolean('pinned').notNullable().defaultTo(false);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('patients', t => {
    t.dropColumn('pinned');
  });
}

