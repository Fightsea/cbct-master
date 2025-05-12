import { Model as ObjModel } from 'objection';
import Patient from './patient';
import OralScanFile from './oralScanFile';

interface OralScanRecord extends Model.OralScanRecord {}

class OralScanRecord extends ObjModel {
  static tableName = 'oral_scan_records';

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
        from: 'oral_scan_records.patientId',
        to: 'patients.id'
      }
    },
    files: {
      relation: ObjModel.HasManyRelation,
      modelClass: OralScanFile,
      join: {
        from: 'oral_scan_records.id',
        to: 'oral_scan_files.recordId'
      }
    }
  });

  $beforeUpdate(): void | Promise<any> {
    this.updatedAt = new Date().toISOString();
  }
}

export default OralScanRecord;
