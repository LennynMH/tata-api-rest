import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

const USER_ROLE_ID = 'f8aa1f2a-16f1-4a1d-9e22-d28f9924bd3e';

export class CreateUsersTable1706660010000 implements MigrationInterface {
  name = 'CreateUsersTable1706660010000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Crear tabla users con role_id (FK a roles)
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'email',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'password_hash',
            type: 'varchar',
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'role_id',
            type: 'uuid',
            default: `'${USER_ROLE_ID}'`,
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // 2. Agregar FK role_id -> roles
    await queryRunner.createForeignKey(
      'users',
      new TableForeignKey({
        columnNames: ['role_id'],
        referencedTableName: 'roles',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 1. Eliminar FK
    const table = await queryRunner.getTable('users');
    const fk = table?.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('role_id') !== -1,
    );
    if (fk) {
      await queryRunner.dropForeignKey('users', fk);
    }

    // 2. Eliminar tabla users
    await queryRunner.dropTable('users');
  }
}
