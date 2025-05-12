import { Model as ObjModel } from 'objection';
import { softDelete } from '@/utils/objection';
import ClinicMember from './clinicMember';

interface User extends Model.User {}

class User extends softDelete(ObjModel) {
  static tableName = 'users';

  static jsonSchema = {
    type: 'object',
    required: [
      'name',
      'email',
      'password',
      'position',
      'idNumber',
      'gender',
      'birthday'
    ],
    properties: {
      id: { type: 'string' },
      name: { type: 'string' },
      email: { type: 'string' },
      password: { type: 'string' },
      position: { type: 'string' },
      idNumber: { type: 'string' },
      gender: { type: 'string' },
      birthday: { type: 'string' }
    }
  };

  static relationMappings = () => ({
    clinics: {
      relation: ObjModel.HasManyRelation,
      modelClass: ClinicMember,
      join: {
        from: 'users.id',
        to: 'clinic_members.userId'
      }
    }
  });

  $beforeUpdate(): void | Promise<any> {
    this.updatedAt = new Date().toISOString();
  }
}

export default User;
