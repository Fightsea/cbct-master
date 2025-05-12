import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('cbct_ai_outputs', t => {
    t.uuid('id', { primaryKey: true }).defaultTo(knex.raw('uuid_generate_v4()'));
    t.date('date').notNullable();
    t.string('model').notNullable();
    t.string('status').notNullable();
    t.boolean('result').nullable();
    t.text('description').nullable();
    t.uuid('recordId').unique().references('cbct_records.id').notNullable().onDelete('CASCADE');
    t.timestamps(true, true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('cbct_ai_outputs');
}
