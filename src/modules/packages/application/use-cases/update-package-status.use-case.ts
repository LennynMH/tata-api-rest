import { Injectable, Inject } from '@nestjs/common';
import { IPackageRepository, PACKAGE_REPOSITORY } from '../ports/package.repository.port';
import { IStatePackageRepository, STATE_PACKAGE_REPOSITORY } from '../ports/state-package.repository.port';
import { Package } from '../../domain/entities/package.entity';
import { PackageNotFoundException } from '../../../../common/exceptions/package-not-found.exception';
import { InvalidStatePackageException } from '../../../../common/exceptions/invalid-state-package.exception';
import { ILoggerFactory, LOGGER_FACTORY } from '../../../../common/contracts/logger.contract';

export interface UpdatePackageStatusInput {
  packageId: string;
  status: string;
}

@Injectable()
export class UpdatePackageStatusUseCase {
  private readonly logger: ReturnType<ILoggerFactory['create']>;

  constructor(
    @Inject(PACKAGE_REPOSITORY)
    private readonly packageRepository: IPackageRepository,
    @Inject(STATE_PACKAGE_REPOSITORY)
    private readonly statePackageRepository: IStatePackageRepository,
    @Inject(LOGGER_FACTORY)
    private readonly loggerFactory: ILoggerFactory,
  ) {
    this.logger = loggerFactory.create(UpdatePackageStatusUseCase.name);
  }

  async execute(input: UpdatePackageStatusInput): Promise<Package> {
    this.logger.debug(`UpdatePackageStatus: id=${input.packageId}, newStatus=${input.status}`);

    const pkg = await this.packageRepository.findById(input.packageId);
    if (!pkg) {
      throw new PackageNotFoundException(input.packageId);
    }

    const newState = await this.statePackageRepository.findByCode(input.status);
    if (!newState) {
      throw new InvalidStatePackageException(input.status);
    }

    const updatedPkg = pkg.withState(newState);
    const saved = await this.packageRepository.update(updatedPkg);

    this.logger.log(`Paquete actualizado: id=${saved.id}, estado=${saved.statePackage.code}`);
    return saved;
  }
}
