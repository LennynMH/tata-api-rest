import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IPackageRepository } from '../../../application/ports/package.repository.port';
import { Package, PackageOwner } from '../../../domain/entities/package.entity';
import { PackageSchema } from './package-schema.entity';

@Injectable()
export class TypeOrmPackageRepository implements IPackageRepository {
  constructor(
    @InjectRepository(PackageSchema)
    private readonly repo: Repository<PackageSchema>,
  ) {}

  async save(pkg: Package): Promise<Package> {
    const schema = this.toSchema(pkg);
    const saved = await this.repo.save(schema);
    return this.toDomain(saved);
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
      relations: ['owner'],
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
    schema.status = pkg.status;
    schema.origin = pkg.origin;
    schema.destination = pkg.destination;
    schema.createdAt = pkg.createdAt;
    schema.updatedAt = pkg.updatedAt;
    return schema;
  }

  private toDomain(schema: PackageSchema): Package {
    return new Package(
      schema.id,
      schema.userId,
      schema.trackingNumber,
      schema.status,
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
      schema.status,
      schema.origin,
      schema.destination,
      schema.createdAt,
      schema.updatedAt,
      owner,
    );
  }
}
