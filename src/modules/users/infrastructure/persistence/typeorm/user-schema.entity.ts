import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { RoleSchema } from './role-schema.entity';

/**
 * Schema TypeORM - Adaptador de persistencia
 * Mapea la entidad de dominio a la tabla SQL
 */
@Entity('users')
export class UserSchema {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Column()
  name: string;

  @ManyToOne(() => RoleSchema, { eager: true })
  @JoinColumn({ name: 'role_id' })
  role: RoleSchema;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
