import { Injectable } from '@nestjs/common';
import { IPasswordHasher } from '../../contracts/password-hasher.contract';

/**
 * Adaptador simple para desarrollo
 * En producción usar BcryptPasswordHasher con bcrypt
 */
@Injectable()
export class SimplePasswordHasher implements IPasswordHasher {
  async hash(password: string): Promise<string> {
    return Buffer.from(password, 'utf-8').toString('base64');
  }
}
