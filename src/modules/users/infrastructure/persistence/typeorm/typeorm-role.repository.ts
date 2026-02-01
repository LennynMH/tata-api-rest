import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IRoleRepository } from '../../../application/ports/role.repository.port';
import { Role } from '../../../domain/entities/role.entity';
import { RoleSchema } from './role-schema.entity';

@Injectable()
export class TypeOrmRoleRepository implements IRoleRepository {
  constructor(
    @InjectRepository(RoleSchema)
    private readonly repository: Repository<RoleSchema>,
  ) {}

  async findById(id: string): Promise<Role | null> {
    const schema = await this.repository.findOne({ where: { id } });
    return schema ? this.toDomain(schema) : null;
  }

  async findByName(name: string): Promise<Role | null> {
    const schema = await this.repository.findOne({ where: { name } });
    return schema ? this.toDomain(schema) : null;
  }

  async findByCode(code: string): Promise<Role | null> {
    const schema = await this.repository.findOne({ where: { code } });
    return schema ? this.toDomain(schema) : null;
  }

  private toDomain(schema: RoleSchema): Role {
    return new Role(schema.id, schema.name, schema.code);
  }
}
