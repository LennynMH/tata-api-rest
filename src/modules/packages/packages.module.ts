import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PACKAGE_REPOSITORY } from './application/ports/package.repository.port';
import { STATE_PACKAGE_REPOSITORY } from './application/ports/state-package.repository.port';
import { CreatePackageUseCase } from './application/use-cases/create-package.use-case';
import { ListUserPackagesUseCase } from './application/use-cases/list-user-packages.use-case';
import { GetPackageByIdUseCase } from './application/use-cases/get-package-by-id.use-case';
import { UpdatePackageStatusUseCase } from './application/use-cases/update-package-status.use-case';
import { PackageSchema } from './infrastructure/persistence/typeorm/package-schema.entity';
import { StatePackageSchema } from './infrastructure/persistence/typeorm/state-package-schema.entity';
import { TypeOrmPackageRepository } from './infrastructure/persistence/typeorm/typeorm-package.repository';
import { TypeOrmStatePackageRepository } from './infrastructure/persistence/typeorm/typeorm-state-package.repository';
import { PackagesController } from './infrastructure/http/packages.controller';

/**
 * PackagesModule: no importa UsersModule.
 * Dependencias globales (LOGGER_FACTORY, USER_FINDER) provistas por SharedInfraModule.
 */
@Module({
  imports: [TypeOrmModule.forFeature([PackageSchema, StatePackageSchema])],
  controllers: [PackagesController],
  providers: [
    CreatePackageUseCase,
    ListUserPackagesUseCase,
    GetPackageByIdUseCase,
    UpdatePackageStatusUseCase,
    {
      provide: PACKAGE_REPOSITORY,
      useClass: TypeOrmPackageRepository,
    },
    {
      provide: STATE_PACKAGE_REPOSITORY,
      useClass: TypeOrmStatePackageRepository,
    },
  ],
  exports: [CreatePackageUseCase, ListUserPackagesUseCase, GetPackageByIdUseCase, UpdatePackageStatusUseCase],
})
export class PackagesModule {}
