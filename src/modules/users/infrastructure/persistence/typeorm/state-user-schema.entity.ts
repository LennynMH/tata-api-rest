import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('state_users')
export class StateUserSchema {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'codigo', length: 20, unique: true })
  code: string;

  @Column({ name: 'descripcion', length: 100 })
  description: string;
}
