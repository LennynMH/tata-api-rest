/**
 * Constantes de error centralizadas
 * Códigos y mensajes reutilizables en toda la aplicación
 */
export const ERROR_VALIDAR_DATOS = {
  code: 'ERR001',
  message: 'Error al validar datos',
  httpStatus: 400,
} as const;

export const RECURSO_NO_ENCONTRADO = {
  code: 'ERR002',
  message: 'Recurso no encontrado',
  httpStatus: 404,
} as const;

export const REGLAS_DE_NEGOCIO = {
  code: 'ERR003',
  message: 'La solicitud no puede procesarse debido a reglas de negocio',
  httpStatus: 422,
} as const;

export const ERROR_GENERICO = {
  code: 'ERR000',
  message: 'No se pudo completar la petición',
  httpStatus: 500,
} as const;

// Errores específicos de usuarios
export const USUARIO_EMAIL_DUPLICADO = {
  code: 'USR001',
  message: 'Ya existe un usuario con el email proporcionado',
  httpStatus: 409,
} as const;

export const ROL_INVALIDO = {
  code: 'USR002',
  message: 'Rol inválido. Códigos válidos: ADM, USU',
  httpStatus: 400,
} as const;

export const USUARIO_NO_ENCONTRADO = {
  code: 'USR003',
  message: 'Usuario no encontrado',
  httpStatus: 404,
} as const;

export const ESTADO_USUARIO_NO_ENCONTRADO = {
  code: 'USR004',
  message: 'Estado de usuario no encontrado',
  httpStatus: 500,
} as const;

export const CREDENCIALES_INVALIDAS = {
  code: 'USR005',
  message: 'Credenciales inválidas (email o contraseña incorrectos)',
  httpStatus: 401,
} as const;

// Errores específicos de paquetes
export const PAQUETE_NO_ENCONTRADO = {
  code: 'PKG001',
  message: 'Paquete no encontrado',
  httpStatus: 404,
} as const;

export const PAQUETE_TRACKING_DUPLICADO = {
  code: 'PKG002',
  message: 'Ya existe un paquete con el número de seguimiento proporcionado',
  httpStatus: 409,
} as const;

export const ESTADO_PAQUETE_INVALIDO = {
  code: 'PKG003',
  message: 'Estado de paquete inválido. Códigos válidos: pendiente, en_tránsito, entregado',
  httpStatus: 400,
} as const;

export const ERROR_CODE_TO_HTTP_STATUS: Record<string, number> = {
  [ERROR_GENERICO.code]: ERROR_GENERICO.httpStatus,
  [ERROR_VALIDAR_DATOS.code]: ERROR_VALIDAR_DATOS.httpStatus,
  [RECURSO_NO_ENCONTRADO.code]: RECURSO_NO_ENCONTRADO.httpStatus,
  [REGLAS_DE_NEGOCIO.code]: REGLAS_DE_NEGOCIO.httpStatus,
  [USUARIO_EMAIL_DUPLICADO.code]: USUARIO_EMAIL_DUPLICADO.httpStatus,
  [ROL_INVALIDO.code]: ROL_INVALIDO.httpStatus,
  [USUARIO_NO_ENCONTRADO.code]: USUARIO_NO_ENCONTRADO.httpStatus,
  [ESTADO_USUARIO_NO_ENCONTRADO.code]: ESTADO_USUARIO_NO_ENCONTRADO.httpStatus,
  [CREDENCIALES_INVALIDAS.code]: CREDENCIALES_INVALIDAS.httpStatus,
  [PAQUETE_NO_ENCONTRADO.code]: PAQUETE_NO_ENCONTRADO.httpStatus,
  [PAQUETE_TRACKING_DUPLICADO.code]: PAQUETE_TRACKING_DUPLICADO.httpStatus,
  [ESTADO_PAQUETE_INVALIDO.code]: ESTADO_PAQUETE_INVALIDO.httpStatus,
};
