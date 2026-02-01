import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUserRepository } from '../../../application/ports/user.repository.port';
import { User } from '../../../domain/entities/user.entity';
import { Role } from '../../../domain/entities/role.entity';
import { StateUser } from '../../../domain/entities/state-user.entity';
import { UserSchema } from './user-schema.entity';
import { RoleSchema } from './role-schema.entity';
import { StateUserSchema } from './state-user-schema.entity';

@Injectable()
export class TypeOrmUserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserSchema)
    private readonly repo: Repository<UserSchema>,
  ) {}

  async save(user: User): Promise<User> {
    const schema = this.toSchema(user);
    const saved = await this.repo.save(schema);
    return this.toDomain(saved);
  }

  async findByEmail(email: string): Promise<User | null> {
    const schema = await this.repo.findOne({ where: { email } });
    return schema ? this.toDomain(schema) : null;
  }

  async findById(id: string): Promise<User | null> {
    const schema = await this.repo.findOne({ where: { id } });
    return schema ? this.toDomain(schema) : null;
  }

  private toSchema(user: User): UserSchema {
    const schema = new UserSchema();
    schema.id = user.id;
    schema.email = user.email;
    schema.passwordHash = user.passwordHash;
    schema.name = user.name;
    // Relaciones: solo necesitamos el ID para que TypeORM haga la FK
    schema.role = { id: user.role.id } as RoleSchema;
    schema.state = { id: user.state.id } as StateUserSchema;
    schema.createdAt = user.createdAt;
    schema.updatedAt = user.updatedAt;
    return schema;
  }

  private toDomain(schema: UserSchema): User {
    const role = new Role(schema.role.id, schema.role.code, schema.role.name);
    const state = StateUser.create(schema.state.id, schema.state.code, schema.state.description);
    return new User(
      schema.id,
      schema.email,
      schema.passwordHash,
      schema.name,
      role,
      state,
      schema.createdAt,
      schema.updatedAt,
    );
  }
}
