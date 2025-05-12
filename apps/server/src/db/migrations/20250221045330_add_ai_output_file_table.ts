import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('cbct_ai_output_files', t => {
    t.uuid('id', { primaryKey: true }).defaultTo(knex.raw('uuid_generate_v4()'));
    t.string('filename').notNullable();
    t.string('originalname').notNullable();
    t.string('mimetype').notNullable();
    t.bigint('size').notNullable();
    t.string('path').notNullable();
    t.uuid('outputId').references('cbct_ai_outputs.id').notNullable().onDelete('CASCADE');
    t.timestamps(true, true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('cbct_ai_output_files');
}
