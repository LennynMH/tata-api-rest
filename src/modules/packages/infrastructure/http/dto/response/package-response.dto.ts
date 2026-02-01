import { ApiProperty } from '@nestjs/swagger';
import { Package } from '../../../../domain/entities/package.entity';

export class PackageResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  user_id: string;

  @ApiProperty({ description: 'Propietario del paquete (HU-05)', required: false })
  owner?: {
    id: string;
    email: string;
    name: string;
  };

  @ApiProperty()
  tracking_number: string;

  @ApiProperty({ description: 'Estado del paquete (HU-06)' })
  state: {
    id: string;
    codigo: string;
    descripcion: string;
  };

  @ApiProperty({ description: 'Código del estado (alias para compatibilidad)' })
  status: string;

  @ApiProperty()
  origin: string;

  @ApiProperty()
  destination: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  static fromDomain(pkg: Package): PackageResponseDto {
    return {
      id: pkg.id,
      user_id: pkg.userId,
      owner: pkg.owner ? { id: pkg.owner.id, email: pkg.owner.email, name: pkg.owner.name } : undefined,
      tracking_number: pkg.trackingNumber,
      state: {
        id: pkg.statePackage.id,
        codigo: pkg.statePackage.code,
        descripcion: pkg.statePackage.description,
      },
      status: pkg.statePackage.code,
      origin: pkg.origin,
      destination: pkg.destination,
      createdAt: pkg.createdAt,
      updatedAt: pkg.updatedAt,
    };
  }
}
