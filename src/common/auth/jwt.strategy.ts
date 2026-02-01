import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

export interface JwtPayloadDto {
  sub: string;
  email: string;
  role: string;
}

export interface RequestUser {
  id: string;
  email: string;
  role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('jwt.secret'),
    });
  }

  validate(payload: JwtPayloadDto): RequestUser {
    if (!payload.sub || !payload.role) {
      throw new UnauthorizedException('Token inválido');
    }
    return {
      id: payload.sub,
      email: payload.email ?? '',
      role: payload.role,
    };
  }
}
