import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('clinics', t => {
    t.uuid('id', { primaryKey: true }).defaultTo(knex.raw('uuid_generate_v4()'));
    t.string('identity', 20).notNullable();
    t.string('name', 30).notNullable();
    t.string('taxId', 30).notNullable();
    t.string('phone', 20).notNullable();
    t.text('address').notNullable();
    t.timestamps(true, true, true);
    t.datetime('deletedAt');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('clinics');
}
