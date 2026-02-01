import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  GetPackageOwnerResult,
  IPackageFinder,
} from '../contracts/package-finder.contract';
import { IApiGateway, API_GATEWAY } from '../contracts/api-gateway.contract';
import { ILoggerFactory, LOGGER_FACTORY } from '../contracts/logger.contract';

@Injectable()
export class HttpPackageApiAdapter implements IPackageFinder {
  private readonly logger: ReturnType<ILoggerFactory['create']>;
  private readonly baseUrl: string;

  constructor(
    @Inject(API_GATEWAY) private readonly apiGateway: IApiGateway,
    @Inject(LOGGER_FACTORY) private readonly loggerFactory: ILoggerFactory,
    private readonly config: ConfigService,
  ) {
    this.logger = loggerFactory.create(HttpPackageApiAdapter.name);
    this.baseUrl = this.config.get<string>('packagesApiUrl', 'http://localhost:2002');
  }

  async existsById(packageId: string): Promise<boolean> {
    this.logger.log(`Verificando existencia de paquete: ${packageId}`);

    try {
      const response = await this.apiGateway.invokeEndpoint<{ id: string }>({
        host: this.baseUrl,
        path: `/api/packages/${packageId}`,
        method: 'GET',
      });
      const exists = !!response?.id;
      this.logger.log(`Paquete ${packageId} existe: ${exists}`);
      return exists;
    } catch (error: unknown) {
      // Si es 404, el paquete no existe
      if (error && typeof error === 'object' && 'status' in error && error.status === 404) {
        this.logger.log(`Paquete ${packageId} no encontrado (404)`);
        return false;
      }
      // 401 sin token - packages-api requiere JWT
      if (error && typeof error === 'object' && 'status' in error && error.status === 401) {
        this.logger.log(`Paquete ${packageId}: se requiere token para verificar`);
        throw error;
      }
      // Otro error, lo propagamos
      this.logger.error(`Error al verificar paquete ${packageId}: ${error}`);
      throw error;
    }
  }

  async getPackageOwnerId(
    packageId: string,
    authHeader: string,
  ): Promise<GetPackageOwnerResult> {
    this.logger.log(`Obteniendo propietario de paquete: ${packageId}`);

    try {
      const response = await this.apiGateway.invokeEndpoint<{ user_id: string }>({
        host: this.baseUrl,
        path: `/api/packages/${packageId}`,
        method: 'GET',
        headers: { Authorization: authHeader },
      });
      const ownerId = response?.user_id;
      if (ownerId) {
        this.logger.log(`Paquete ${packageId} - propietario: ${ownerId}`);
        return { ownerId };
      }
      return { status: 404 };
    } catch (error: unknown) {
      const status = error && typeof error === 'object' && 'status' in error
        ? (error as { status: number }).status
        : 500;
      if (status === 404) {
        this.logger.log(`Paquete ${packageId} no encontrado (404)`);
        return { status: 404 };
      }
      if (status === 403) {
        this.logger.log(`Paquete ${packageId}: sin permiso (403)`);
        return { status: 403 };
      }
      this.logger.error(`Error al obtener propietario de paquete ${packageId}: ${error}`);
      throw error;
    }
  }
}
