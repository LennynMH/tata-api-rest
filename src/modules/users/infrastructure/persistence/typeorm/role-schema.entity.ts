import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('roles')
export class RoleSchema {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ unique: true, length: 20 })
  name: string;

  @Column({ name: 'code', unique: true, length: 10 })
  code: string;
}
