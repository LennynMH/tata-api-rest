import { Role } from '../../domain/entities/role.entity';

export const ROLE_REPOSITORY = Symbol('ROLE_REPOSITORY');

export interface IRoleRepository {
  findById(id: string): Promise<Role | null>;
  findByName(name: string): Promise<Role | null>;
  findByCode(code: string): Promise<Role | null>;
}
