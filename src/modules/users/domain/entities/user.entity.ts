import { Role } from './role.entity';
import { StateUser } from './state-user.entity';

export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly passwordHash: string,
    public readonly name: string,
    public readonly role: Role,
    public readonly state: StateUser,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(
    id: string,
    email: string,
    passwordHash: string,
    name: string,
    role: Role,
    state: StateUser,
  ): User {
    const now = new Date();
    return new User(id, email, passwordHash, name, role, state, now, now);
  }
}
