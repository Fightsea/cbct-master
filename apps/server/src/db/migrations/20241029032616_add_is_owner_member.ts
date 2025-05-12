import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('clinic_members', t => {
    t.boolean('isOwner').notNullable().defaultTo(false);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('clinic_members', t => {
    t.dropColumn('isOwner');
  });
}
