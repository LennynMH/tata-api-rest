
export const STATE_USER_CODE_ACTIVE = 'ACT' as const;
export const STATE_USER_CODE_INACTIVE = 'INA' as const;

export const STATE_USER_CODES = [STATE_USER_CODE_ACTIVE, STATE_USER_CODE_INACTIVE] as const;
export type StateUserCode = (typeof STATE_USER_CODES)[number];

export const STATE_USER_CODE_DEFAULT = STATE_USER_CODE_ACTIVE;
