export class Role {
  constructor(
    public readonly id: string,
    public readonly code: string,
    public readonly name: string,
  ) {}

  static create(id: string, code: string, name: string): Role {
    return new Role(id, code.toUpperCase(), name);
  }
}
