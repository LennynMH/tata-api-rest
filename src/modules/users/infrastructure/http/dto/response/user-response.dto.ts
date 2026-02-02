import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../../../domain/entities/user.entity';
import { STATE_USER_CODE_ACTIVE } from '../../../../../../common/constants/state-user.constants';

export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  role: {
    id: string;
    code: string;
    name: string;
  };

  @ApiProperty({ description: 'Estado del usuario (HU-02)', example: { id: 'uuid', codigo: STATE_USER_CODE_ACTIVE, descripcion: 'Activo' } })
  state: {
    id: string;
    codigo: string;
    descripcion: string;
  };

  @ApiProperty({ description: 'Usuario activo (derivado de state.codigo === ACT)' })
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  static fromDomain(user: User): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: {
        id: user.role.id,
        code: user.role.code,
        name: user.role.name,
      },
      state: {
        id: user.state.id,
        codigo: user.state.code,
        descripcion: user.state.description,
      },
      isActive: user.state.code === STATE_USER_CODE_ACTIVE,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
