import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IStatePackageRepository } from '../../../application/ports/state-package.repository.port';
import { StatePackage } from '../../../domain/entities/state-package.entity';
import { StatePackageSchema } from './state-package-schema.entity';

@Injectable()
export class TypeOrmStatePackageRepository implements IStatePackageRepository {
  constructor(
    @InjectRepository(StatePackageSchema)
    private readonly repo: Repository<StatePackageSchema>,
  ) {}

  async findByCode(code: string): Promise<StatePackage | null> {
    const schema = await this.repo.findOne({ where: { codigo: code } });
    return schema ? this.toDomain(schema) : null;
  }

  async findById(id: string): Promise<StatePackage | null> {
    const schema = await this.repo.findOne({ where: { id } });
    return schema ? this.toDomain(schema) : null;
  }

  async findAll(): Promise<StatePackage[]> {
    const schemas = await this.repo.find({ order: { orden: 'ASC' } });
    return schemas.map((s) => this.toDomain(s));
  }

  private toDomain(schema: StatePackageSchema): StatePackage {
    return StatePackage.create(schema.id, schema.codigo, schema.descripcion, schema.orden);
  }
}
