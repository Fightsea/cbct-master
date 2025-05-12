import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('cbct_ai_outputs', t => {
    t.dropColumn('result');
    t.string('risk').nullable();
    t.string('phenotype').nullable();
    t.renameColumn('description', 'prescription');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('cbct_ai_outputs', t => {
    t.boolean('result').nullable();
    t.dropColumn('risk');
    t.dropColumn('phenotype');
    t.renameColumn('prescription', 'description');
  });
}
