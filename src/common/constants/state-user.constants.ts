/**
 * Códigos de estado de usuario (tabla state_users)
 */
export const STATE_USER_CODE_ACTIVE = 'ACT' as const;
export const STATE_USER_CODE_INACTIVE = 'INA' as const;

export const STATE_USER_CODES = [STATE_USER_CODE_ACTIVE, STATE_USER_CODE_INACTIVE] as const;
export type StateUserCode = (typeof STATE_USER_CODES)[number];

/** Estado por defecto al crear un usuario */
export const STATE_USER_CODE_DEFAULT = STATE_USER_CODE_ACTIVE;
