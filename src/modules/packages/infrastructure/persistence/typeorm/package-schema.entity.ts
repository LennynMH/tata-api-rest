import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { UserSchema } from '../../../../users/infrastructure/persistence/typeorm/user-schema.entity';
import { StatePackageSchema } from './state-package-schema.entity';

/**
 * Schema TypeORM para la tabla packages.
 *
 * NOTA: Esta entidad importa UserSchema para definir la relación ManyToOne.
 * Esto es aceptable porque:
 * 1. Ambos módulos comparten la misma base de datos
 * 2. La relación es solo a nivel de infraestructura (TypeORM), no de dominio
 * 3. Permite hacer JOINs eficientes cuando el dato principal es package
 *
 * La comunicación de negocio entre módulos se hace via IUserFinder (HTTP),
 * esta relación es solo para consultas de lectura optimizadas.
 */
@Entity('packages')
export class PackageSchema {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  /** Relación con User para consultas package + owner (TypeORM join) */
  @ManyToOne(() => UserSchema)
  @JoinColumn({ name: 'user_id' })
  owner: UserSchema;

  @Column({ name: 'state_package_id' })
  statePackageId: string;

  @ManyToOne(() => StatePackageSchema, { eager: true })
  @JoinColumn({ name: 'state_package_id' })
  statePackage: StatePackageSchema;

  @Column({ name: 'tracking_number', length: 50, unique: true })
  trackingNumber: string;

  @Column({ length: 255 })
  origin: string;

  @Column({ length: 255 })
  destination: string;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
