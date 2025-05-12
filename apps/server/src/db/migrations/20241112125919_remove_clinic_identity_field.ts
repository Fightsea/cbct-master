import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('clinics', t => {
    t.dropColumn('identity');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('clinics', t => {
    t.string('identity', 20).nullable();
  });
}
