export const ROLE_CODE_ADM = 'ADM' as const;
export const ROLE_CODE_USU = 'USU' as const;

export const ROLE_CODES = [ROLE_CODE_ADM, ROLE_CODE_USU] as const;
export type RoleCode = (typeof ROLE_CODES)[number];

export const ROLE_CODE_DEFAULT = ROLE_CODE_USU;
