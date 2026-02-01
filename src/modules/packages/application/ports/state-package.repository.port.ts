import { StatePackage } from '../../domain/entities/state-package.entity';

export const STATE_PACKAGE_REPOSITORY = Symbol('STATE_PACKAGE_REPOSITORY');

export interface IStatePackageRepository {
  findByCode(code: string): Promise<StatePackage | null>;
  findById(id: string): Promise<StatePackage | null>;
  findAll(): Promise<StatePackage[]>;
}
