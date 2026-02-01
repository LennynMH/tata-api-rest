import { Injectable, Inject } from '@nestjs/common';
import { IPackageFinder } from '../contracts/package-finder.contract';
import { IApiGateway, API_GATEWAY } from '../contracts/api-gateway.contract';
import { ILoggerFactory, LOGGER_FACTORY } from '../contracts/logger.contract';

@Injectable()
export class HttpPackageApiAdapter implements IPackageFinder {
  private readonly logger: ReturnType<ILoggerFactory['create']>;
  private readonly baseUrl: string;

  constructor(
    @Inject(API_GATEWAY) private readonly apiGateway: IApiGateway,
    @Inject(LOGGER_FACTORY) private readonly loggerFactory: ILoggerFactory,
  ) {
    this.logger = loggerFactory.create(HttpPackageApiAdapter.name);
    this.baseUrl = process.env.PACKAGES_API_URL || 'http://localhost:2002';
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
      // Otro error, lo propagamos
      this.logger.error(`Error al verificar paquete ${packageId}: ${error}`);
      throw error;
    }
  }
}
