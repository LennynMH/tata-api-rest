
export interface IPackageFinder {
  existsById(packageId: string): Promise<boolean>;
}

export const PACKAGE_FINDER = Symbol('PACKAGE_FINDER');
