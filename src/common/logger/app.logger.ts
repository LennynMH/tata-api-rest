import { LoggerService } from '@nestjs/common';

export class AppLogger implements LoggerService {
  constructor(private readonly context: string) {}

  log(message: string, ...optionalParams: unknown[]): void {
    console.log(`[${this.context}] ${message}`, ...optionalParams);
  }

  error(message: string, ...optionalParams: unknown[]): void {
    console.error(`[${this.context}] ${message}`, ...optionalParams);
  }

  warn(message: string, ...optionalParams: unknown[]): void {
    console.warn(`[${this.context}] ${message}`, ...optionalParams);
  }

  debug(message: string, ...optionalParams: unknown[]): void {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[${this.context}] ${message}`, ...optionalParams);
    }
  }
}
