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
  status: string;
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
    public readonly status: string,
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
    status: string,
    origin: string,
    destination: string,
  ): Package {
    const now = new Date();
    return new Package(
      id,
      userId,
      trackingNumber,
      status,
      origin,
      destination,
      now,
      now,
    );
  }
}
