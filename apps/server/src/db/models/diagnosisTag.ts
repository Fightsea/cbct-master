import { Model as ObjModel } from 'objection';
import Diagnosis from './diagnosis';
import Tag from './tag';

interface DiagnosisTag extends Model.DiagnosisTag {}

class DiagnosisTag extends ObjModel {
  static tableName = 'diagnosis_tags';

  static jsonSchema = {
    type: 'object',
    required: ['diagnosisId', 'tagId'],
    properties: {
      id: { type: 'string' },
      diagnosisId: { type: 'string' },
      tagId: { type: 'string' }
    }
  };

  static relationMappings = () => ({
    diagnosis: {
      relation: ObjModel.BelongsToOneRelation,
      modelClass: Diagnosis,
      join: {
        from: 'diagnosis_tags.diagnosisId',
        to: 'diagnoses.id'
      }
    },
    tag: {
      relation: ObjModel.BelongsToOneRelation,
      modelClass: Tag,
      join: {
        from: 'diagnosis_tags.tagId',
        to: 'tags.id'
      }
    }
  });

  $beforeUpdate(): void | Promise<any> {
    this.updatedAt = new Date().toISOString();
  }
}

export default DiagnosisTag;
