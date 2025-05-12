import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema
    .createTable('users', t => {
      t.uuid('id', { primaryKey: true }).defaultTo(knex.raw('uuid_generate_v4()'));
      t.string('name', 30).notNullable();
      t.string('email', 50).notNullable();
      t.text('password').notNullable();
      t.string('position', 20).notNullable();
      t.string('idNumber', 50).notNullable();
      t.string('gender', 10).notNullable();
      t.date('birthday').notNullable();
      t.timestamps(true, true, true);
      t.datetime('deletedAt');
    })
    .createTable('clinic_members', t => {
      t.uuid('id', { primaryKey: true }).defaultTo(knex.raw('uuid_generate_v4()'));
      t.string('role', 20).notNullable();
      t.uuid('clinicId').references('clinics.id').notNullable().onDelete('CASCADE');
      t.uuid('userId').references('users.id').notNullable().onDelete('CASCADE');
      t.timestamps(true, true, true);
    });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('clinic_members')
    .dropTable('users');
}
