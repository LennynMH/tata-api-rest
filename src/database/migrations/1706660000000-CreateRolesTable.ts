import { MigrationInterface, QueryRunner, Table } from 'typeorm';

const ADMIN_ROLE_ID = '4728f4a4-292b-460d-a685-2bea0807e6d4';
const USER_ROLE_ID = 'f8aa1f2a-16f1-4a1d-9e22-d28f9924bd3e';
const ROLE_CODE_ADM = 'ADM';
const ROLE_CODE_USU = 'USU';

export class CreateRolesTable1706660000000 implements MigrationInterface {
  name = 'CreateRolesTable1706660000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Crear tabla roles (id, name, code)
    await queryRunner.createTable(
      new Table({
        name: 'roles',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'name',
            type: 'varchar',
            length: '20',
            isUnique: true,
          },
          {
            name: 'code',
            type: 'varchar',
            length: '10',
            isUnique: true,
          },
        ],
      }),
      true,
    );

    // 2. Seed: insertar roles iniciales (admin/ADM, user/USU)
    await queryRunner.query(
      `INSERT INTO roles (id, name, code) VALUES 
        ('${ADMIN_ROLE_ID}', 'admin', '${ROLE_CODE_ADM}'),
        ('${USER_ROLE_ID}', 'user', '${ROLE_CODE_USU}')`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('roles');
  }
}
