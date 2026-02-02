import { Role } from '../../../../../src/modules/users/domain/entities/role.entity';
import { IRoleRepository } from '../../../../../src/modules/users/application/ports/role.repository.port';

export class MockRoleRepository implements IRoleRepository {
  findByCode = jest.fn();
  findById = jest.fn();
}
