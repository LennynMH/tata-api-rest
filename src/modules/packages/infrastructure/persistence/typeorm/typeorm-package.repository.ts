import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IPackageRepository } from '../../../application/ports/package.repository.port';
import { Package, PackageOwner } from '../../../domain/entities/package.entity';
import { StatePackage } from '../../../domain/entities/state-package.entity';
import { PackageSchema } from './package-schema.entity';
import { StatePackageSchema } from './state-package-schema.entity';

@Injectable()
export class TypeOrmPackageRepository implements IPackageRepository {
  constructor(
    @InjectRepository(PackageSchema)
    private readonly repo: Repository<PackageSchema>,
  ) {}

  async save(pkg: Package): Promise<Package> {
    const schema = this.toSchema(pkg);
    const saved = await this.repo.save(schema);
    // Recargar con relaciones
    const reloaded = await this.repo.findOne({ where: { id: saved.id } });
    return this.toDomain(reloaded!);
  }

  async update(pkg: Package): Promise<Package> {
    await this.repo.update(pkg.id, {
      statePackageId: pkg.statePackage.id,
      updatedAt: pkg.updatedAt,
    });
    const updated = await this.repo.findOne({ where: { id: pkg.id } });
    return this.toDomain(updated!);
  }

  async findById(id: string): Promise<Package | null> {
    const schema = await this.repo.findOne({ where: { id } });
    return schema ? this.toDomain(schema) : null;
  }

  /**
   * Consulta package + owner via TypeORM join.
   * Usado cuando el dato principal es package y necesita datos de user.
   */
  async findByIdWithOwner(id: string): Promise<Package | null> {
    const schema = await this.repo.findOne({
      where: { id },
      relations: ['owner', 'statePackage'],
    });
    return schema ? this.toDomainWithOwner(schema) : null;
  }

  async findByUserId(userId: string): Promise<Package[]> {
    const schemas = await this.repo.find({ where: { userId } });
    return schemas.map((s) => this.toDomain(s));
  }

  async findByTrackingNumber(trackingNumber: string): Promise<Package | null> {
    const schema = await this.repo.findOne({ where: { trackingNumber } });
    return schema ? this.toDomain(schema) : null;
  }

  private toSchema(pkg: Package): PackageSchema {
    const schema = new PackageSchema();
    schema.id = pkg.id;
    schema.userId = pkg.userId;
    schema.trackingNumber = pkg.trackingNumber;
    schema.statePackageId = pkg.statePackage.id;
    schema.statePackage = { id: pkg.statePackage.id } as StatePackageSchema;
    schema.origin = pkg.origin;
    schema.destination = pkg.destination;
    schema.createdAt = pkg.createdAt;
    schema.updatedAt = pkg.updatedAt;
    return schema;
  }

  private toStatePackage(schema: StatePackageSchema): StatePackage {
    return StatePackage.create(schema.id, schema.codigo, schema.descripcion, schema.orden);
  }

  private toDomain(schema: PackageSchema): Package {
    return new Package(
      schema.id,
      schema.userId,
      schema.trackingNumber,
      this.toStatePackage(schema.statePackage),
      schema.origin,
      schema.destination,
      schema.createdAt,
      schema.updatedAt,
    );
  }

  /** Mapeo con owner incluido (para consultas con join) */
  private toDomainWithOwner(schema: PackageSchema): Package {
    let owner: PackageOwner | undefined;
    if (schema.owner) {
      owner = {
        id: schema.owner.id,
        email: schema.owner.email,
        name: schema.owner.name,
      };
    }

    return new Package(
      schema.id,
      schema.userId,
      schema.trackingNumber,
      this.toStatePackage(schema.statePackage),
      schema.origin,
      schema.destination,
      schema.createdAt,
      schema.updatedAt,
      owner,
    );
  }
}
