import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('cbct_display_views', t => {
    t.uuid('id', { primaryKey: true }).defaultTo(knex.raw('uuid_generate_v4()'));
    t.string('resource').notNullable();
    t.uuid('recordId').unique().references('cbct_records.id').notNullable().onDelete('CASCADE');
    t.timestamps(true, true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('cbct_display_views');
}
