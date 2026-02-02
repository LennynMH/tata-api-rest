import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({ description: 'JWT de acceso (Bearer token)' })
  access_token: string;

  @ApiProperty({ example: '30m', description: 'Tiempo de validez del token (minutos)' })
  expires_in: string;

  @ApiProperty({ example: 'Bearer' })
  token_type: string;

  @ApiProperty({
    description: 'Datos del usuario autenticado',
    example: { id: 'uuid', email: 'user@example.com', name: 'Juan', role: 'USU' },
  })
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}
