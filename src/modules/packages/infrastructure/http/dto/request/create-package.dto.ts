import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { STATE_PACKAGE_CODES } from '../../../../../../common/constants/state-package.constants';

export class CreatePackageDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsUUID()
  user_id: string;

  @ApiProperty({ example: 'PKG-2024-001' })
  @IsString()
  @IsNotEmpty()
  tracking_number: string;

  @ApiProperty({ example: 'Lima, Perú' })
  @IsString()
  @IsNotEmpty()
  origin: string;

  @ApiProperty({ example: 'Arequipa, Perú' })
  @IsString()
  @IsNotEmpty()
  destination: string;

  @ApiPropertyOptional({ example: 'pendiente', enum: STATE_PACKAGE_CODES, description: 'Estado inicial (default: pendiente)' })
  @IsOptional()
  @IsString()
  @IsIn(STATE_PACKAGE_CODES)
  status?: string;
}
