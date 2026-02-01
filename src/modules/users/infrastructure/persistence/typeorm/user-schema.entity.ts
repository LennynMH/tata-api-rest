import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { RoleSchema } from './role-schema.entity';
import { StateUserSchema } from './state-user-schema.entity';

@Entity('users')
export class UserSchema {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255, unique: true })
  email: string;

  @Column({ name: 'password_hash', length: 255 })
  passwordHash: string;

  @Column({ length: 150 })
  name: string;

  @ManyToOne(() => RoleSchema, { eager: true })
  @JoinColumn({ name: 'role_id' })
  role: RoleSchema;

  @ManyToOne(() => StateUserSchema, { eager: true })
  @JoinColumn({ name: 'state_user_id' })
  state: StateUserSchema;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
