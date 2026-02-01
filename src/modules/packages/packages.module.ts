import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PACKAGE_REPOSITORY } from './application/ports/package.repository.port';
import { CreatePackageUseCase } from './application/use-cases/create-package.use-case';
import { ListUserPackagesUseCase } from './application/use-cases/list-user-packages.use-case';
import { GetPackageByIdUseCase } from './application/use-cases/get-package-by-id.use-case';
import { PackageSchema } from './infrastructure/persistence/typeorm/package-schema.entity';
import { TypeOrmPackageRepository } from './infrastructure/persistence/typeorm/typeorm-package.repository';
import { PackagesController } from './infrastructure/http/packages.controller';

/**
 * PackagesModule: no importa UsersModule.
 * Dependencias globales (LOGGER_FACTORY, USER_FINDER) provistas por SharedInfraModule.
 */
@Module({
  imports: [TypeOrmModule.forFeature([PackageSchema])],
  controllers: [PackagesController],
  providers: [
    CreatePackageUseCase,
    ListUserPackagesUseCase,
    GetPackageByIdUseCase,
    {
      provide: PACKAGE_REPOSITORY,
      useClass: TypeOrmPackageRepository,
    },
  ],
  exports: [CreatePackageUseCase, ListUserPackagesUseCase, GetPackageByIdUseCase],
})
export class PackagesModule {}
