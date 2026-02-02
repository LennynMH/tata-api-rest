import { StateUser } from '../../../../../src/modules/users/domain/entities/state-user.entity';
import { IStateUserRepository } from '../../../../../src/modules/users/application/ports/state-user.repository.port';

export class MockStateUserRepository implements IStateUserRepository {
  findByCode = jest.fn();
  findById = jest.fn();
}
