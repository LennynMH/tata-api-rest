/**
 * Contrato para invocación genérica de APIs
 * Patrón invokeEndpointApigateway
 */
export interface RequestApiGatewayDto {
  host: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  data?: object;
  headers?: Record<string, string>;
  timeoutMs?: number;
}

export const API_GATEWAY = Symbol('API_GATEWAY');

export interface IApiGateway {
  invokeEndpoint<R>(request: RequestApiGatewayDto): Promise<R>;
}
