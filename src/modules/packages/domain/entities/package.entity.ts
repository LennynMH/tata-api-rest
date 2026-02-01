import { StatePackage } from './state-package.entity';

/** Datos del propietario del paquete (HU-05) */
export interface PackageOwner {
  id: string;
  email: string;
  name: string;
}

export interface PackageDomain {
  id: string;
  userId: string;
  owner?: PackageOwner;
  trackingNumber: string;
  statePackage: StatePackage;
  origin: string;
  destination: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Package implements PackageDomain {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly trackingNumber: string,
    public readonly statePackage: StatePackage,
    public readonly origin: string,
    public readonly destination: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly owner?: PackageOwner,
  ) {}

  static create(
    id: string,
    userId: string,
    trackingNumber: string,
    statePackage: StatePackage,
    origin: string,
    destination: string,
  ): Package {
    const now = new Date();
    return new Package(
      id,
      userId,
      trackingNumber,
      statePackage,
      origin,
      destination,
      now,
      now,
    );
  }

  withState(newState: StatePackage): Package {
    return new Package(
      this.id,
      this.userId,
      this.trackingNumber,
      newState,
      this.origin,
      this.destination,
      this.createdAt,
      new Date(), // updatedAt actualizado
      this.owner,
    );
  }
}
