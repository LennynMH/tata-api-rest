export const STATE_PACKAGE_CODE_PENDIENTE = 'pendiente' as const;
export const STATE_PACKAGE_CODE_EN_TRANSITO = 'en_tránsito' as const;
export const STATE_PACKAGE_CODE_ENTREGADO = 'entregado' as const;

export const STATE_PACKAGE_CODES = [
  STATE_PACKAGE_CODE_PENDIENTE,
  STATE_PACKAGE_CODE_EN_TRANSITO,
  STATE_PACKAGE_CODE_ENTREGADO,
] as const;

export type StatePackageCode = (typeof STATE_PACKAGE_CODES)[number];

export const STATE_PACKAGE_CODE_DEFAULT = STATE_PACKAGE_CODE_PENDIENTE;
