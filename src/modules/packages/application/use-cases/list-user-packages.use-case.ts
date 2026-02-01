import { Injectable, Inject } from '@nestjs/common';
import { IPackageRepository, PACKAGE_REPOSITORY } from '../ports/package.repository.port';
import { IUserFinder, USER_FINDER } from '../../../../common/contracts/user-finder.contract';
import { Package } from '../../domain/entities/package.entity';
import { UserNotFoundException } from '../../../../common/exceptions/user-not-found.exception';
import { ILoggerFactory, LOGGER_FACTORY } from '../../../../common/contracts/logger.contract';

@Injectable()
export class ListUserPackagesUseCase {
  private readonly logger: ReturnType<ILoggerFactory['create']>;

  constructor(
    @Inject(USER_FINDER)
    private readonly userFinder: IUserFinder,
    @Inject(PACKAGE_REPOSITORY)
    private readonly packageRepository: IPackageRepository,
    @Inject(LOGGER_FACTORY)
    private readonly loggerFactory: ILoggerFactory,
  ) {
    this.logger = loggerFactory.create(ListUserPackagesUseCase.name);
  }

  async execute(userId: string, authHeader?: string): Promise<Package[]> {
    this.logger.debug(`ListUserPackages: userId=${userId}`);

    const user = await this.userFinder.findById(userId, authHeader);
    if (!user) {
      throw new UserNotFoundException(userId);
    }

    const packages = await this.packageRepository.findByUserId(userId);
    this.logger.log(`Paquetes encontrados para userId=${userId}: ${packages.length}`);
    return packages;
  }
}
