import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('roles')
export class RoleSchema {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 20, unique: true })
  code: string;

  @Column({ length: 100 })
  name: string;
}
