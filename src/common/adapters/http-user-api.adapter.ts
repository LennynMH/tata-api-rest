import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IApiGateway, API_GATEWAY } from '../contracts/api-gateway.contract';
import { IUserFinder, UserFinderResult } from '../contracts/user-finder.contract';
import { UserApiResponse } from '../contracts/user-api.contract';

@Injectable()
export class HttpUserApiAdapter implements IUserFinder {
  constructor(
    @Inject(API_GATEWAY)
    private readonly apiGateway: IApiGateway,
    private readonly config: ConfigService,
  ) {}

  async findById(id: string): Promise<UserFinderResult | null> {
    const baseUrl = this.config.get<string>('usersApiUrl', 'http://localhost:2001');
    try {
      const response = await this.apiGateway.invokeEndpoint<UserApiResponse>({
        host: baseUrl,
        path: `/api/users/${id}`,
        method: 'GET',
        timeoutMs: 5000,
      });
      return {
        id: response.id,
        email: response.email,
        name: response.name,
      };
    } catch {
      return null;
    }
  }
}
