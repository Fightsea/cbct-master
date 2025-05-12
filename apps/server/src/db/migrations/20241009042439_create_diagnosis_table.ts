import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema
    .createTable('diagnoses', t => {
      t.uuid('id', { primaryKey: true }).defaultTo(knex.raw('uuid_generate_v4()'));
      t.datetime('datetime', { useTz: false }).notNullable();
      t.text('note').notNullable();
      t.uuid('patientId').references('patients.id').notNullable().onDelete('CASCADE');
      t.uuid('doctorId').references('users.id').notNullable().onDelete('CASCADE');
      t.timestamps(true, true, true);
    })
    .createTable('diagnosis_tags', t => {
      t.uuid('id', { primaryKey: true }).defaultTo(knex.raw('uuid_generate_v4()'));
      t.uuid('diagnosisId').references('diagnoses.id').notNullable().onDelete('CASCADE');
      t.uuid('tagId').references('tags.id').notNullable().onDelete('CASCADE');
      t.timestamps(true, true, true);
    });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema
    .dropTable('diagnosis_tags')
    .dropTable('diagnoses');
}
