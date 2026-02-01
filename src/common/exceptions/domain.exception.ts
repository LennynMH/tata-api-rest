/**
 * Excepción base de dominio
 * El Exception Filter la traduce a respuesta HTTP
 */
export interface DomainExceptionParams {
  code: string;
  message: string;
  httpStatus: number;
  details?: string[];
  cause?: Error;
}

export class DomainException extends Error {
  public readonly code: string;
  public readonly httpStatus: number;
  public readonly details: string[];

  constructor(params: DomainExceptionParams) {
    super(params.message);
    this.name = 'DomainException';
    this.code = params.code;
    this.httpStatus = params.httpStatus;
    this.details = params.details ?? [];
    Object.setPrototypeOf(this, DomainException.prototype);
  }
}
