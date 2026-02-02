import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateStatePackagesTable1738300001500 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'state_packages',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'codigo',
            type: 'varchar',
            length: '20',
            isUnique: true,
          },
          {
            name: 'descripcion',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'orden',
            type: 'int',
            default: 0,
          },
        ],
      }),
      true,
    );

    // Seed: estados de paquete según HU-06
    await queryRunner.query(`
      INSERT INTO state_packages (id, codigo, descripcion, orden) VALUES
        (uuid_generate_v4(), 'pendiente', 'Pendiente', 1),
        (uuid_generate_v4(), 'en_tránsito', 'En tránsito', 2),
        (uuid_generate_v4(), 'entregado', 'Entregado', 3)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('state_packages', true);
  }
}
