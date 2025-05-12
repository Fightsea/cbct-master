import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema
    .createTable('patients', t => {
      t.uuid('id', { primaryKey: true }).defaultTo(knex.raw('uuid_generate_v4()'));
      t.string('serialNumber', 30).notNullable();
      t.string('email', 50).notNullable();
      t.string('idNumber', 50).notNullable();
      t.string('treatmentStatus', 20).notNullable();
      t.string('firstName', 30).notNullable();
      t.string('lastName', 30).notNullable();
      t.string('gender', 10).notNullable();
      t.date('birthday').notNullable();
      t.string('phone', 20).notNullable();
      t.text('note').notNullable();
      t.uuid('clinicId').references('clinics.id').notNullable().onDelete('CASCADE');
      t.timestamps(true, true, true);
      t.datetime('deletedAt');
    })
    .createTable('tags', t => {
      t.uuid('id', { primaryKey: true }).defaultTo(knex.raw('uuid_generate_v4()'));
      t.string('name').notNullable();
      t.uuid('clinicId').references('clinics.id').notNullable().onDelete('CASCADE');
      t.timestamps(true, true, true);
    })
    .createTable('patient_tags', t => {
      t.uuid('id', { primaryKey: true }).defaultTo(knex.raw('uuid_generate_v4()'));
      t.uuid('patientId').references('patients.id').notNullable().onDelete('CASCADE');
      t.uuid('tagId').references('tags.id').notNullable().onDelete('CASCADE');
      t.timestamps(true, true, true);
    });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema
    .dropTable('patient_tags')
    .dropTable('tags')
    .dropTable('patients');
}
