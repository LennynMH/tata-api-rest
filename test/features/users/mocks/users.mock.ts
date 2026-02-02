
export const TEST_IDS = {
  userAdminId: '550e8400-e29b-41d4-a716-446655440001',
  userNormalId: '550e8400-e29b-41d4-a716-446655440002',
  otherUserId: '550e8400-e29b-41d4-a716-446655440099',
  roleAdmId: 'role-adm-001',
  roleUsuId: 'role-usu-001',
  stateActiveId: 'state-active-001',
};

export const ROLES = {
  ADM: { id: TEST_IDS.roleAdmId, code: 'ADM', name: 'Administrador' },
  USU: { id: TEST_IDS.roleUsuId, code: 'USU', name: 'Usuario' },
};

export const STATE_ACTIVE = { id: TEST_IDS.stateActiveId, code: 'ACT', description: 'Activo' };
