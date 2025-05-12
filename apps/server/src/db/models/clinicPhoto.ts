import { Model as ObjModel } from 'objection';
import Clinic from './clinic';

interface ClinicPhoto extends Model.ClinicPhoto {}

class ClinicPhoto extends ObjModel {
  static tableName = 'clinic_photos';

  static jsonSchema = {
    type: 'object',
    required: ['filename', 'originalname', 'mimetype', 'size', 'path', 'clinicId'],
    properties: {
      id: { type: 'string' },
      filename: { type: 'string' },
      originalname: { type: 'string' },
      mimetype: { type: 'string' },
      size: { type: 'number' },
      path: { type: 'string' },
      clinicId: { type: 'string' }
    }
  };

  static relationMappings = () => ({
    clinic: {
      relation: ObjModel.BelongsToOneRelation,
      modelClass: Clinic,
      join: {
        from: 'clinic_photos.clinicId',
        to: 'clinics.id'
      }
    }
  });

  $beforeUpdate(): void | Promise<any> {
    this.updatedAt = new Date().toISOString();
  }
}

export default ClinicPhoto;
