import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    CREATE OR REPLACE VIEW vw_diagnosis_analysis AS
    SELECT
      o.id AS id,
      o.date AS date,
      CONCAT('ANALYSIS') AS type,
      o.model AS subject,
      o.prescription AS description,
      r."patientId" AS "patientId",
      o."createdAt" AS "createdAt"
    FROM cbct_ai_outputs AS o
    JOIN cbct_records AS r ON o."recordId" = r.id
    UNION ALL
    SELECT
      d.id AS id,
      d.datetime::date AS date,
      CONCAT('DIAGNOSIS') AS type,
      u.name AS subject,
      d.note AS description,
      d."patientId" AS "patientId",
      d."createdAt" AS "createdAt"
    FROM diagnoses AS d
    JOIN users AS u ON d."doctorId" = u.id
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw('DROP VIEW IF EXISTS vw_diagnosis_analysis');
  await knex.raw(`
    CREATE VIEW vw_diagnosis_analysis AS
    SELECT
      o.id AS id,
      o.date AS date,
      CONCAT('ANALYSIS') AS type,
      o.model AS subject,
      o.prescription AS description,
      r."patientId" AS "patientId"
    FROM cbct_ai_outputs AS o
    JOIN cbct_records AS r ON o."recordId" = r.id
    UNION ALL
    SELECT
      d.id AS id,
      d.datetime::date AS date,
      CONCAT('DIAGNOSIS') AS type,
      u.name AS subject,
      d.note AS description,
      d."patientId" AS "patientId"
    FROM diagnoses AS d
    JOIN users AS u ON d."doctorId" = u.id
  `);
}
