import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IStateUserRepository } from '../../../application/ports/state-user.repository.port';
import { StateUser } from '../../../domain/entities/state-user.entity';
import { StateUserSchema } from './state-user-schema.entity';

@Injectable()
export class TypeOrmStateUserRepository implements IStateUserRepository {
  constructor(
    @InjectRepository(StateUserSchema)
    private readonly repo: Repository<StateUserSchema>,
  ) {}

  async findByCode(code: string): Promise<StateUser | null> {
    const schema = await this.repo.findOne({ where: { code } });
    return schema ? this.toDomain(schema) : null;
  }

  async findById(id: string): Promise<StateUser | null> {
    const schema = await this.repo.findOne({ where: { id } });
    return schema ? this.toDomain(schema) : null;
  }

  private toDomain(schema: StateUserSchema): StateUser {
    return StateUser.create(schema.id, schema.code, schema.description);
  }
}
