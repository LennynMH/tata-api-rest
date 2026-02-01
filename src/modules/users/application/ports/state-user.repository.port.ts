import { StateUser } from '../../domain/entities/state-user.entity';

export const STATE_USER_REPOSITORY = Symbol('STATE_USER_REPOSITORY');

export interface IStateUserRepository {
  findByCode(code: string): Promise<StateUser | null>;
  findById(id: string): Promise<StateUser | null>;
}
