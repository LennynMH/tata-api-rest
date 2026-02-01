import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString } from 'class-validator';
import { STATE_PACKAGE_CODES } from '../../../../../../common/constants/state-package.constants';

export class UpdatePackageStatusDto {
  @ApiProperty({
    example: 'en_tránsito',
    enum: STATE_PACKAGE_CODES,
    description: 'Nuevo estado: pendiente, en_tránsito, entregado',
  })
  @IsString()
  @IsIn(STATE_PACKAGE_CODES)
  status: string;
}
