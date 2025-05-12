import { Model as ObjModel } from 'objection';
import Patient from './patient';
import XrayImage from './xrayImage';

interface XrayRecord extends Model.XrayRecord {}

class XrayRecord extends ObjModel {
  static tableName = 'xray_records';

  static jsonSchema = {
    type: 'object',
    required: ['date', 'patientId'],
    properties: {
      id: { type: 'string' },
      date: { type: 'string' },
      patientId: { type: 'string' }
    }
  };

  static relationMappings = () => ({
    patient: {
      relation: ObjModel.BelongsToOneRelation,
      modelClass: Patient,
      join: {
        from: 'xray_records.patientId',
        to: 'patients.id'
      }
    },
    images: {
      relation: ObjModel.HasManyRelation,
      modelClass: XrayImage,
      join: {
        from: 'xray_records.id',
        to: 'xray_images.recordId'
      }
    }
  });

  $beforeUpdate(): void | Promise<any> {
    this.updatedAt = new Date().toISOString();
  }
}

export default XrayRecord;
