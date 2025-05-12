import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('cbct_ai_outputs', t => {
    t.string('treatmentImageUrl').nullable();
    t.string('treatmentDescription').nullable();
    t.string('phenotypeImageUrl').nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('cbct_ai_outputs', t => {
    t.dropColumn('treatmentImageUrl');
    t.dropColumn('treatmentDescription');
    t.dropColumn('phenotypeImageUrl');
  });
}
