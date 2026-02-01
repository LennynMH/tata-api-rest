import { Injectable } from '@nestjs/common';
import { ILogger, ILoggerFactory } from '../../contracts/logger.contract';
import { AppLoggerAdapter } from './app-logger.adapter';

@Injectable()
export class LoggerFactoryAdapter implements ILoggerFactory {
  create(context: string): ILogger {
    return new AppLoggerAdapter(context);
  }
}
