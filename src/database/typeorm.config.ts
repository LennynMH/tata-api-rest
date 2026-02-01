import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { configuration } from '../config/configuration';

config();

const { database } = configuration();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: database.host,
  port: database.port,
  username: database.username,
  password: database.password,
  database: database.database,
  entities: ['dist/**/*.entity.js', 'dist/**/*-schema.entity.js'],
  migrations: ['dist/database/migrations/*.js'],
  synchronize: false,
  logging: database.logging,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
