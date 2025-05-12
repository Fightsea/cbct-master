import { Role } from '@cbct/enum/clinicMember';
import { Position } from '@cbct/enum/user';

export type AffiliatedClinic = {
  id: uuid;
  name: string;
  role: Role;
};

export type LoginResponse = {
  user: {
    id: uuid;
    name: string;
    email: string;
    position: Position;
    clinics: AffiliatedClinic[];
  };
  accessToken: string;
  refreshToken: string;
};

export type RefreshTokenResponse = LoginResponse;
