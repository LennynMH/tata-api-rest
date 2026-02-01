export interface RoleDomain {
  id: string;
  name: string;
  code: string;
}

export class Role implements RoleDomain {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly code: string,
  ) {}

  static create(id: string, name: string, code: string): Role {
    return new Role(id, name, code);
  }
}
