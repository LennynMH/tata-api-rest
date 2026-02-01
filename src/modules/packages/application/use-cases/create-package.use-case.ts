import { Injectable, Inject } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { IUserFinder, USER_FINDER } from '../../../../common/contracts/user-finder.contract';
import { IPackageRepository, PACKAGE_REPOSITORY } from '../ports/package.repository.port';
import { IStatePackageRepository, STATE_PACKAGE_REPOSITORY } from '../ports/state-package.repository.port';
import { Package } from '../../domain/entities/package.entity';
import { UserNotFoundException } from '../../../../common/exceptions/user-not-found.exception';
import { PackageTrackingDuplicateException } from '../../../../common/exceptions/package-tracking-duplicate.exception';
import { InvalidStatePackageException } from '../../../../common/exceptions/invalid-state-package.exception';
import { ILoggerFactory, LOGGER_FACTORY } from '../../../../common/contracts/logger.contract';
import { STATE_PACKAGE_CODE_DEFAULT } from '../../../../common/constants/state-package.constants';

export interface CreatePackageInput {
  userId: string;
  trackingNumber: string;
  origin: string;
  destination: string;
  status?: string;
  authHeader?: string;
}

@Injectable()
export class CreatePackageUseCase {
  private readonly logger: ReturnType<ILoggerFactory['create']>;

  constructor(
    @Inject(USER_FINDER)
    private readonly userFinder: IUserFinder,
    @Inject(PACKAGE_REPOSITORY)
    private readonly packageRepository: IPackageRepository,
    @Inject(STATE_PACKAGE_REPOSITORY)
    private readonly statePackageRepository: IStatePackageRepository,
    @Inject(LOGGER_FACTORY)
    private readonly loggerFactory: ILoggerFactory,
  ) {
    this.logger = loggerFactory.create(CreatePackageUseCase.name);
  }

  async execute(input: CreatePackageInput): Promise<Package> {
    this.logger.debug(`CreatePackage: userId=${input.userId}, tracking=${input.trackingNumber}`);

    const user = await this.userFinder.findById(input.userId, input.authHeader);
    if (!user) {
      throw new UserNotFoundException(input.userId);
    }

    const existing = await this.packageRepository.findByTrackingNumber(input.trackingNumber);
    if (existing) {
      throw new PackageTrackingDuplicateException(input.trackingNumber);
    }

    const statusCode = input.status ?? STATE_PACKAGE_CODE_DEFAULT;
    const statePackage = await this.statePackageRepository.findByCode(statusCode);
    if (!statePackage) {
      throw new InvalidStatePackageException(statusCode);
    }

    const pkg = Package.create(
      randomUUID(),
      input.userId,
      input.trackingNumber.trim(),
      statePackage,
      input.origin.trim(),
      input.destination.trim(),
    );

    const saved = await this.packageRepository.save(pkg);
    this.logger.log(`Paquete creado: id=${saved.id}, tracking=${saved.trackingNumber}`);
    return saved;
  }
}
