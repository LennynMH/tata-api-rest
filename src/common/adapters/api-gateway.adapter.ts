import { Injectable } from '@nestjs/common';
import axios, { AxiosRequestConfig } from 'axios';
import { IApiGateway, RequestApiGatewayDto } from '../contracts/api-gateway.contract';

@Injectable()
export class ApiGatewayAdapter implements IApiGateway {
  async invokeEndpoint<R>(request: RequestApiGatewayDto): Promise<R> {
    const { host, path, method, data, headers = {}, timeoutMs = 5000 } = request;

    const url = path.startsWith('http') ? path : `${host}${path}`;

    const config: AxiosRequestConfig = {
      method,
      url,
      data: data ?? undefined,
      timeout: timeoutMs,
      headers: { 'Content-Type': 'application/json', ...headers },
      validateStatus: (status) => status >= 200 && status < 500,
    };

    const response = await axios(config);

    if (response.status >= 400) {
      const err = response.data as { message?: string };
      throw new Error(err?.message ?? `HTTP ${response.status}: ${url}`);
    }

    return response.data as R;
  }
}
