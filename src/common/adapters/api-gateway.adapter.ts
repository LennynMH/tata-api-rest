import { Injectable } from '@nestjs/common';
import axios, { AxiosRequestConfig } from 'axios';
import { IApiGateway, RequestApiGatewayDto } from '../contracts/api-gateway.contract';
import { DEFAULT_HTTP_TIMEOUT_MS } from '../constants/http.constants';

@Injectable()
export class ApiGatewayAdapter implements IApiGateway {
  async invokeEndpoint<R>(request: RequestApiGatewayDto): Promise<R> {
    const { host, path, method, data, headers = {}, timeoutMs = DEFAULT_HTTP_TIMEOUT_MS } = request;

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
      const err = new Error(
        (response.data as { message?: string })?.message ?? `HTTP ${response.status}: ${url}`,
      ) as Error & { status?: number };
      err.status = response.status;
      throw err;
    }

    return response.data as R;
  }
}
