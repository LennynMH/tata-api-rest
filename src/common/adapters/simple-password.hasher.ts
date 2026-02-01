import { Injectable } from '@nestjs/common';
import { IPasswordHasher } from '../contracts/password-hasher.contract';

@Injectable()
export class SimplePasswordHasher implements IPasswordHasher {
  async hash(password: string): Promise<string> {
    return Buffer.from(password, 'utf-8').toString('base64');
  }
}
