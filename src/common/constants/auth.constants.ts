/** Tipo de token en respuestas de login (OAuth2-style) */
export const TOKEN_TYPE_BEARER = 'Bearer' as const;

/** Nombre de la estrategia Passport JWT (debe coincidir en JwtStrategy y JwtAuthGuard) */
export const JWT_STRATEGY_NAME = 'jwt' as const;
