export class StateUser {
  constructor(
    public readonly id: string,
    public readonly code: string,
    public readonly description: string,
  ) {}

  static create(id: string, code: string, description: string): StateUser {
    return new StateUser(id, code, description);
  }
}
