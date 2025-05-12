import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('patients', t => {
    t.text('note').alter().nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('patients', t => {
    t.text('note').alter().notNullable();
  });
}
