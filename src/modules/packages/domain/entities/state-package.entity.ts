export class StatePackage {
  constructor(
    public readonly id: string,
    public readonly code: string,
    public readonly description: string,
    public readonly order: number,
  ) {}

  static create(id: string, code: string, description: string, order: number = 0): StatePackage {
    return new StatePackage(id, code, description, order);
  }
}
