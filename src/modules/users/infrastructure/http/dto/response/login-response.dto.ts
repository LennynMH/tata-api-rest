import { ApiProperty } from '@nestjs/swagger';
import { TOKEN_TYPE_BEARER } from '../../../../../../common/constants/auth.constants';
import { ROLE_CODE_USU } from '../../../../../../common/constants/role.constants';

export class LoginResponseDto {
  @ApiProperty({ description: 'JWT de acceso (Bearer token)' })
  access_token: string;

  @ApiProperty({ example: '30m', description: 'Tiempo de validez del token (minutos)' })
  expires_in: string;

  @ApiProperty({ example: TOKEN_TYPE_BEARER })
  token_type: string;

  @ApiProperty({
    description: 'Datos del usuario autenticado',
    example: { id: 'uuid', email: 'user@example.com', name: 'Juan', role: ROLE_CODE_USU },
  })
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}
