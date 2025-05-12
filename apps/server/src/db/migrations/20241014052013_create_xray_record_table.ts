import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema
    .createTable('xray_records', t => {
      t.uuid('id', { primaryKey: true }).defaultTo(knex.raw('uuid_generate_v4()'));
      t.date('date').notNullable();
      t.uuid('patientId').references('patients.id').notNullable().onDelete('CASCADE');
      t.timestamps(true, true, true);
    })
    .createTable('xray_images', t => {
      t.uuid('id', { primaryKey: true }).defaultTo(knex.raw('uuid_generate_v4()'));
      t.string('filename').notNullable();
      t.string('originalname').notNullable();
      t.string('mimetype').notNullable();
      t.bigint('size').notNullable();
      t.string('path').notNullable();
      t.uuid('recordId').references('xray_records.id').notNullable().onDelete('CASCADE');
      t.timestamps(true, true, true);
    });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema
    .dropTable('xray_images')
    .dropTable('xray_records');
}
