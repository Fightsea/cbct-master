import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('clinic_photos', t => {
    t.uuid('id', { primaryKey: true }).defaultTo(knex.raw('uuid_generate_v4()'));
    t.string('filename').notNullable();
    t.string('originalname').notNullable();
    t.string('mimetype').notNullable();
    t.bigint('size').notNullable();
    t.string('path').notNullable();
    t.uuid('clinicId').references('clinics.id').notNullable();
    t.timestamps(true, true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('clinic_photos');
}
