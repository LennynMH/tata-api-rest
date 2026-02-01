import { User } from '../../domain/entities/user.entity';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export interface IUserRepository {
  save(user: User): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
}
