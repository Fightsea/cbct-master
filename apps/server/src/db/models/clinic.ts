import { Model as ObjModel } from 'objection';
import { softDelete } from '@/utils/objection';
import ClinicMember from './clinicMember';
import Patient from './patient';

interface Clinic extends Model.Clinic {}

class Clinic extends softDelete(ObjModel) {
  static tableName = 'clinics';

  static jsonSchema = {
    type: 'object',
    required: ['name', 'taxId', 'phone', 'address'],
    properties: {
      id: { type: 'string' },
      name: { type: 'string' },
      taxId: { type: 'string' },
      phone: { type: 'string' },
      address: { type: 'string' }
    }
  };

  static relationMappings = () => ({
    members: {
      relation: ObjModel.HasManyRelation,
      modelClass: ClinicMember,
      join: {
        from: 'clinics.id',
        to: 'clinic_members.clinicId'
      }
    },
    patients: {
      relation: ObjModel.HasManyRelation,
      modelClass: Patient,
      join: {
        from: 'clinics.id',
        to: 'patients.clinicId'
      }
    }
  });

  $beforeUpdate(): void | Promise<any> {
    this.updatedAt = new Date().toISOString();
  }
}

export default Clinic;
