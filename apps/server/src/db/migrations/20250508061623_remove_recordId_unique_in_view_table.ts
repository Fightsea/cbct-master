import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw('ALTER TABLE cbct_display_views DROP CONSTRAINT IF EXISTS cbct_display_views_recordid_unique;');
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw('ALTER TABLE cbct_display_views ADD CONSTRAINT cbct_display_views_recordid_unique UNIQUE ("recordId");');
}
