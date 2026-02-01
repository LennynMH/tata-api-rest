import * as Joi from 'joi';

export interface AppConfig {
  port: number;
  nodeEnv: string;
  apiPrefix: string;
}

export interface SwaggerConfig {
  enabled: boolean;
  path: string;
  title: string;
  description: string;
  version: string;
}

export interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  migrationsRun: boolean;
  logging: boolean;
}

export interface HealthConfig {
  dbTimeoutMs: number;
}

export const configuration = () => ({
  // Server
  port: parseInt(process.env.PORT ?? '2000', 10),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  apiPrefix: process.env.API_PREFIX ?? 'api',

  // Swagger
  swagger: {
    enabled: process.env.SWAGGER_ENABLED !== 'false',
    path: process.env.SWAGGER_PATH ?? 'api/docs',
    title: process.env.SWAGGER_TITLE ?? 'API Gestión de Envíos',
    description:
      process.env.SWAGGER_DESCRIPTION ??
      'API REST para sistema de gestión de envíos logísticos',
    version: process.env.SWAGGER_VERSION ?? '1.0',
  },

  // Database
  database: {
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT ?? '5432', 10),
    username: process.env.DB_USER ?? 'postgres',
    password: process.env.DB_PASSWORD ?? 'postgres',
    database: process.env.DB_NAME ?? 'logistics_db',
    migrationsRun: process.env.RUN_MIGRATIONS === 'true',
    logging: process.env.NODE_ENV === 'development',
  },

  // Health
  health: {
    dbTimeoutMs: parseInt(process.env.HEALTH_DB_TIMEOUT_MS ?? '1500', 10),
  },

  // Microservicios - URL de users-api (para packages-api)
  usersApiUrl: process.env.USERS_API_URL ?? 'http://localhost:2001',
});

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(2000),
  API_PREFIX: Joi.string().default('api'),

  SWAGGER_ENABLED: Joi.boolean().default(true),
  SWAGGER_PATH: Joi.string().default('api/docs'),
  SWAGGER_TITLE: Joi.string().default('API Gestión de Envíos'),
  SWAGGER_DESCRIPTION: Joi.string().optional(),
  SWAGGER_VERSION: Joi.string().default('1.0'),

  DB_HOST: Joi.string().default('localhost'),
  DB_PORT: Joi.number().default(5432),
  DB_USER: Joi.string().default('postgres'),
  DB_PASSWORD: Joi.string().default('postgres'),
  DB_NAME: Joi.string().default('logistics_db'),

  RUN_MIGRATIONS: Joi.string().valid('true', 'false').default('false'),
  HEALTH_DB_TIMEOUT_MS: Joi.number().default(1500),
  USERS_API_URL: Joi.string().uri().default('http://localhost:2001'),
});
