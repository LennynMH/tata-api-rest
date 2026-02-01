import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUserRepository } from '../../../application/ports/user.repository.port';
import { User } from '../../../domain/entities/user.entity';
import { Role } from '../../../domain/entities/role.entity';
import { UserSchema } from './user-schema.entity';
import { RoleSchema } from './role-schema.entity';

@Injectable()
export class TypeOrmUserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserSchema)
    private readonly repository: Repository<UserSchema>,
  ) {}

  async save(user: User): Promise<User> {
    const schema = this.toSchema(user);
    const saved = await this.repository.save(schema);
    return this.toDomain(saved);
  }

  async findByEmail(email: string): Promise<User | null> {
    const schema = await this.repository.findOne({
      where: { email },
      relations: ['role'],
    });
    return schema ? this.toDomain(schema) : null;
  }

  async findById(id: string): Promise<User | null> {
    const schema = await this.repository.findOne({
      where: { id },
      relations: ['role'],
    });
    return schema ? this.toDomain(schema) : null;
  }

  private toSchema(user: User): UserSchema {
    const schema = new UserSchema();
    schema.id = user.id;
    schema.email = user.email;
    schema.passwordHash = user.passwordHash;
    schema.name = user.name;
    schema.role = { id: user.role.id, name: user.role.name, code: user.role.code } as RoleSchema;
    schema.isActive = user.isActive;
    schema.createdAt = user.createdAt;
    schema.updatedAt = user.updatedAt;
    return schema;
  }

  private toDomain(schema: UserSchema): User {
    const role = new Role(schema.role.id, schema.role.name, schema.role.code);
    return new User(
      schema.id,
      schema.email,
      schema.passwordHash,
      schema.name,
      role,
      schema.isActive,
      schema.createdAt,
      schema.updatedAt,
    );
  }
}
