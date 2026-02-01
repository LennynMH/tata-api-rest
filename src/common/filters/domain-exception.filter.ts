import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { Response } from 'express';
import { DomainException } from '../exceptions/domain.exception';
import { ERROR_GENERICO, ERROR_CODE_TO_HTTP_STATUS } from '../constants/error.constants';
import { ILoggerFactory, LOGGER_FACTORY } from '../contracts/logger.contract';

@Catch()
export class DomainExceptionFilter implements ExceptionFilter {
  private readonly logger: ReturnType<ILoggerFactory['create']>;

  constructor(
    @Inject(LOGGER_FACTORY)
    private readonly loggerFactory: ILoggerFactory,
  ) {
    this.logger = loggerFactory.create(DomainExceptionFilter.name);
  }

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof DomainException) {
      this.logger.warn(
        `DomainException [${exception.code}]: ${exception.message}`,
      );
      const httpStatus =
        ERROR_CODE_TO_HTTP_STATUS[exception.code] ?? ERROR_GENERICO.httpStatus;
      response.status(httpStatus).json({
        statusCode: httpStatus,
        code: exception.code,
        message: exception.message,
        details: exception.details.length > 0 ? exception.details : undefined,
      });
      return;
    }

    // Excepciones NestJS (ValidationPipe, etc.)
    if (exception && typeof exception === 'object' && 'getStatus' in exception) {
      const status =
        typeof (exception as { getStatus: () => number }).getStatus ===
        'function'
          ? (exception as { getStatus: () => number }).getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;
      const message =
        (exception as { message?: string }).message || ERROR_GENERICO.message;
      const details =
        (exception as { response?: { message?: string | string[] } }).response
          ?.message ?? undefined;

      this.logger.warn(`HTTP Exception [${status}]: ${message}`);
      response.status(status).json({
        statusCode: status,
        code: ERROR_GENERICO.code,
        message: Array.isArray(details) ? details.join(', ') : message,
        details: Array.isArray(details) ? details : undefined,
      });
      return;
    }

    // Error genérico
    this.logger.error(
      `Unhandled exception: ${exception instanceof Error ? exception.message : String(exception)}`,
      exception instanceof Error ? exception.stack : undefined,
    );
    response.status(ERROR_GENERICO.httpStatus).json({
      statusCode: ERROR_GENERICO.httpStatus,
      code: ERROR_GENERICO.code,
      message: ERROR_GENERICO.message,
    });
  }
}
