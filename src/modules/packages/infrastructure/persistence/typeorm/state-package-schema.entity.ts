import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('state_packages')
export class StatePackageSchema {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 20, unique: true })
  codigo: string;

  @Column({ length: 100 })
  descripcion: string;

  @Column({ type: 'int', default: 0 })
  orden: number;
}
