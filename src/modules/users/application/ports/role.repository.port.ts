import { Role } from '../../domain/entities/role.entity';

export const ROLE_REPOSITORY = Symbol('ROLE_REPOSITORY');

export interface IRoleRepository {
  findByCode(code: string): Promise<Role | null>;
  findById(id: string): Promise<Role | null>;
}
