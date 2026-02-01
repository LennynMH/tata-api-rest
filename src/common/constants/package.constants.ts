/**
 * Estados de paquete (HU-06: pendiente, en tránsito, entregado)
 */
export const PACKAGE_STATUS_PENDIENTE = 'pendiente' as const;
export const PACKAGE_STATUS_EN_TRANSITO = 'en_tránsito' as const;
export const PACKAGE_STATUS_ENTREGADO = 'entregado' as const;

export const PACKAGE_STATUSES = [
  PACKAGE_STATUS_PENDIENTE,
  PACKAGE_STATUS_EN_TRANSITO,
  PACKAGE_STATUS_ENTREGADO,
] as const;

export type PackageStatus = (typeof PACKAGE_STATUSES)[number];

export const PACKAGE_STATUS_DEFAULT = PACKAGE_STATUS_PENDIENTE;
