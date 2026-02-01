import { Injectable, Inject } from '@nestjs/common';
import { IPackageRepository, PACKAGE_REPOSITORY } from '../ports/package.repository.port';
import { Package } from '../../domain/entities/package.entity';
import { PackageNotFoundException } from '../../../../common/exceptions/package-not-found.exception';
import { ILoggerFactory, LOGGER_FACTORY } from '../../../../common/contracts/logger.contract';

/**
 * Consulta paquete por ID con datos del propietario.
 * Usa TypeORM (join) porque el dato principal es package.
 * NO usa IUserFinder (HTTP) - eso es solo para validaciones.
 */
@Injectable()
export class GetPackageByIdUseCase {
  private readonly logger: ReturnType<ILoggerFactory['create']>;

  constructor(
    @Inject(PACKAGE_REPOSITORY)
    private readonly packageRepository: IPackageRepository,
    @Inject(LOGGER_FACTORY)
    private readonly loggerFactory: ILoggerFactory,
  ) {
    this.logger = loggerFactory.create(GetPackageByIdUseCase.name);
  }

  async execute(packageId: string): Promise<Package> {
    this.logger.debug(`GetPackageById: id=${packageId}`);

    // Consulta package + owner via TypeORM (join)
    const pkg = await this.packageRepository.findByIdWithOwner(packageId);
    if (!pkg) {
      throw new PackageNotFoundException(packageId);
    }

    this.logger.log(`Paquete encontrado: id=${pkg.id}, tracking=${pkg.trackingNumber}`);
    return pkg;
  }
}
