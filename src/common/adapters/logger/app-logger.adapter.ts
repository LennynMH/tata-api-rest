import { Injectable } from '@nestjs/common';
import { ILogger } from '../../contracts/logger.contract';

@Injectable()
export class AppLoggerAdapter implements ILogger {
  constructor(private readonly context: string) {}

  log(message: string, ...optionalParams: unknown[]): void {
    const output = this.formatLog('INFO', message, ...optionalParams);
    process.stdout.write(output);
  }

  error(message: string, ...optionalParams: unknown[]): void {
    const output = this.formatLog('ERROR', message, ...optionalParams);
    process.stderr.write(output);
  }

  warn(message: string, ...optionalParams: unknown[]): void {
    const output = this.formatLog('WARN', message, ...optionalParams);
    process.stdout.write(output);
  }

  debug(message: string, ...optionalParams: unknown[]): void {
    if (process.env.NODE_ENV === 'development') {
      const output = this.formatLog('DEBUG', message, ...optionalParams);
      process.stdout.write(output);
    }
  }

  private formatLog(
    level: string,
    message: string,
    ...optionalParams: unknown[]
  ): string {
    const timestamp = new Date().toISOString();
    const ctx = this.context ? `[${this.context}] ` : '';
    const requestId = process.env.AWS_REQUEST_ID ?? '';
    const reqIdStr = requestId ? `${requestId} ` : '';
    const optionalStr = optionalParams
      .map((p) => (typeof p === 'object' ? JSON.stringify(p) : String(p)))
      .join(' ');
    const fullMessage = optionalStr ? `${message} ${optionalStr}` : message;
    return `${timestamp} ${reqIdStr}${level} - ${ctx}${fullMessage}\n`;
  }
}
