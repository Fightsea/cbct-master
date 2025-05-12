import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('tags', t => {
    t.string('color').notNullable().defaultTo('#000000');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('tags', t => {
    t.dropColumn('color');
  });
}
