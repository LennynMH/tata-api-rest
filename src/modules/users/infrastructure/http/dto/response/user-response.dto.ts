import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../../../domain/entities/user.entity';

export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ description: 'Rol del usuario (tabla roles)' })
  role: {
    id: string;
    name: string;
    code: string;
  };

  @ApiProperty()
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
        name: user.role.name,
        code: user.role.code,
      },
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
