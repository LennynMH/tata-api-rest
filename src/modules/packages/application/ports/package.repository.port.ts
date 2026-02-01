import { Package } from '../../domain/entities/package.entity';

export const PACKAGE_REPOSITORY = Symbol('PACKAGE_REPOSITORY');

export interface IPackageRepository {
  save(pkg: Package): Promise<Package>;
  update(pkg: Package): Promise<Package>;
  findById(id: string): Promise<Package | null>;
  findByIdWithOwner(id: string): Promise<Package | null>;
  findByUserId(userId: string): Promise<Package[]>;
  findByTrackingNumber(trackingNumber: string): Promise<Package | null>;
}
