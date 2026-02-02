import { User } from '../../../../../src/modules/users/domain/entities/user.entity';
import { IUserRepository } from '../../../../../src/modules/users/application/ports/user.repository.port';

export class MockUserRepository implements IUserRepository {
  save = jest.fn();
  findByEmail = jest.fn();
  findById = jest.fn();
}
