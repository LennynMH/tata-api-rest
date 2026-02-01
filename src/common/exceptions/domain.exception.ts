export interface DomainExceptionParams {
  code: string;
  message: string;
  details?: string[];
  cause?: Error;
}

export class DomainException extends Error {
  public readonly code: string;
  public readonly details: string[];

  constructor(params: DomainExceptionParams) {
    super(params.message);
    this.name = 'DomainException';
    this.code = params.code;
    this.details = params.details ?? [];
    Object.setPrototypeOf(this, DomainException.prototype);
  }
}
