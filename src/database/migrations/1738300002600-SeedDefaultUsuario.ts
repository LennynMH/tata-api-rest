import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedDefaultUsuario1738300002600 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const passwordHash = Buffer.from('password123', 'utf-8').toString('base64');
    await queryRunner.query(`
      INSERT INTO users (id, email, password_hash, name, role_id, state_user_id, created_at, updated_at)
      SELECT
        uuid_generate_v4(),
        'usuario@ejemplo.com',
        '${passwordHash}',
        'Usuario Demo',
        (SELECT id FROM roles WHERE code = 'USU' LIMIT 1),
        (SELECT id FROM state_users WHERE codigo = 'ACT' LIMIT 1),
        NOW(),
        NOW()
      WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'usuario@ejemplo.com')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "DELETE FROM users WHERE email = 'usuario@ejemplo.com'",
    );
  }
}
