import { Role } from 'src/auth/enum/role.enum';

export class User {
  id: string;
  name: string;
  roles: Role[];
}
