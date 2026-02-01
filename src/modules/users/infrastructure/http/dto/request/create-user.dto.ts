import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsIn,
  MinLength,
} from 'class-validator';
import { ROLE_CODE_DEFAULT, ROLE_CODES } from '../../../../../../common/constants/role.constants';

export class CreateUserDto {
  @ApiProperty({ example: 'usuario@ejemplo.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'password123', minLength: 6 })
  @IsNotEmpty()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @ApiProperty({ example: 'Juan Pérez' })
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    enum: ROLE_CODES,
    default: ROLE_CODE_DEFAULT,
    description: 'Código del rol (ADM=admin, USU=user). Por defecto: USU',
  })
  @IsOptional()
  @IsIn([...ROLE_CODES], { message: 'role_cod debe ser ADM o USU' })
  role_cod?: string;
}
