export const LOGGER_FACTORY = Symbol('LOGGER_FACTORY');

export interface ILogger {
  log(message: string, ...optionalParams: unknown[]): void;
  error(message: string, ...optionalParams: unknown[]): void;
  warn(message: string, ...optionalParams: unknown[]): void;
  debug(message: string, ...optionalParams: unknown[]): void;
}

export interface ILoggerFactory {
  create(context: string): ILogger;
}
