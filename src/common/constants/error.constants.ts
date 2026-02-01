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
