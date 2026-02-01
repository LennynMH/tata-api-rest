export type GetPackageOwnerResult =
  | { ownerId: string }
  | { status: 404 }
  | { status: 403 };

export interface IPackageFinder {
  existsById(packageId: string): Promise<boolean>;
  getPackageOwnerId(packageId: string, authHeader: string): Promise<GetPackageOwnerResult>;
}

export const PACKAGE_FINDER = Symbol('PACKAGE_FINDER');
