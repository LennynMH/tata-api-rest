/**
 * Contrato tipado para respuesta de users-api
 */
export interface UserApiRole {
  id: string;
  name: string;
  code: string;
}

export interface UserApiResponse {
  id: string;
  email: string;
  name: string;
  role: UserApiRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserApiOwnerSummary {
  id: string;
  email: string;
  name: string;
}
