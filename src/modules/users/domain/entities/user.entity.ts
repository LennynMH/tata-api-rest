import { Role } from './role.entity';

export type UserRoleName = 'admin' | 'user';

export interface UserDomain {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: Role;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class User implements UserDomain {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly passwordHash: string,
    public readonly name: string,
    public readonly role: Role,
    public readonly isActive: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(
    id: string,
    email: string,
    passwordHash: string,
    name: string,
    role: Role,
  ): User {
    const now = new Date();
    return new User(id, email, passwordHash, name, role, true, now, now);
  }
}
