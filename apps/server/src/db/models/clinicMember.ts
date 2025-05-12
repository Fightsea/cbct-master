import { Model as ObjModel } from 'objection';
import Clinic from './clinic';
import User from './user';

interface ClinicMember extends Model.ClinicMember {}

class ClinicMember extends ObjModel {
  static tableName = 'clinic_members';

  static jsonSchema = {
    type: 'object',
    required: ['clinicId', 'userId', 'role', 'isOwner'],
    properties: {
      id: { type: 'string' },
      clinicId: { type: 'string' },
      userId: { type: 'string' },
      role: { type: 'string' },
      isOwner: { type: 'boolean' }
    }
  };

  static relationMappings = () => ({
    clinic: {
      relation: ObjModel.BelongsToOneRelation,
      modelClass: Clinic,
      join: {
        from: 'clinic_members.clinicId',
        to: 'clinics.id'
      }
    },
    user: {
      relation: ObjModel.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: 'clinic_members.userId',
        to: 'users.id'
      }
    }
  });

  $beforeUpdate(): void | Promise<any> {
    this.updatedAt = new Date().toISOString();
  }
}

export default ClinicMember;
