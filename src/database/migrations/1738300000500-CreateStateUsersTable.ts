import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateStateUsersTable1738300000500 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'state_users',
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
        ],
      }),
      true,
    );

    await queryRunner.query(`
      INSERT INTO state_users (id, codigo, descripcion) VALUES
        (uuid_generate_v4(), 'ACT', 'Activo'),
        (uuid_generate_v4(), 'INA', 'Inactivo')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('state_users', true);
  }
}
