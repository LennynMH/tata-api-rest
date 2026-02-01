import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './modules/users/users.module';
import { HealthModule } from './common/health/health.module';
import { UserSchema } from './modules/users/infrastructure/persistence/typeorm/user-schema.entity';
import { RoleSchema } from './modules/users/infrastructure/persistence/typeorm/role-schema.entity';
import {
  configuration,
  validationSchema,
} from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema,
      validationOptions: { allowUnknown: true },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('database.host'),
        port: config.get<number>('database.port'),
        username: config.get<string>('database.username'),
        password: config.get<string>('database.password'),
        database: config.get<string>('database.database'),
        entities: [UserSchema, RoleSchema],
        migrations: ['dist/database/migrations/*.js'],
        migrationsRun: config.get<boolean>('database.migrationsRun'),
        synchronize: false,
        logging: config.get<boolean>('database.logging'),
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    HealthModule,
  ],
})
export class AppModule {}
