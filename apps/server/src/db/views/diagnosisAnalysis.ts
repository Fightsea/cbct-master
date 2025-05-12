import { Model as ObjModel } from 'objection';
import { softDelete } from '@/utils/objection';
import Tag from '@/db/models/tag';

interface DiagnosisAnalysis extends View.DiagnosisAnalysis {}

class DiagnosisAnalysis extends softDelete(ObjModel) {
  static tableName = 'vw_diagnosis_analysis';

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      date: { type: 'string' },
      type: { type: 'string' },
      subject: { type: 'string' },
      description: { type: 'string' },
      patientId: { type: 'string' }
    }
  };

  static relationMappings = () => ({
    tags: {
      relation: ObjModel.ManyToManyRelation,
      modelClass: Tag,
      join: {
        from: 'vw_diagnosis_analysis.id',
        through: {
          from: 'diagnosis_tags.diagnosisId',
          to: 'diagnosis_tags.tagId'
        },
        to: 'tags.id'
      }
    }
  });
}

export default DiagnosisAnalysis;
