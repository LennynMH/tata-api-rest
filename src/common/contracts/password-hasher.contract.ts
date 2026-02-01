export const PASSWORD_HASHER = Symbol('PASSWORD_HASHER');

export interface IPasswordHasher {
  hash(password: string): Promise<string>;
  compare(plainPassword: string, hashedPassword: string): Promise<boolean>;
}
