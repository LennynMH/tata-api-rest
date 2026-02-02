const { loadFeature, defineFeature } = require('jest-cucumber');
import {
  createUsersTestApp,
  hashPassword,
  createRole,
  createStateUser,
  createUser,
  UsersTestApp,
} from '../util/UsersTestHelper';
import { TEST_IDS } from '../mocks/users.mock';

const feature = loadFeature('../GetUser.feature', { loadRelativePath: true, errors: true });

defineFeature(feature, (test) => {
  let testApp: UsersTestApp;
  let response: { status: number; body: unknown };
  let authToken: string;
  let targetUserId: string;
  const roleAdm = createRole(TEST_IDS.roleAdmId, 'ADM', 'Administrador');
  const roleUsu = createRole(TEST_IDS.roleUsuId, 'USU', 'Usuario');
  const stateActive = createStateUser(TEST_IDS.stateActiveId, 'ACT', 'Activo');

  beforeAll(async () => {
    testApp = await createUsersTestApp();
  });

  afterAll(async () => {
    await testApp.app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    authToken = '';
    targetUserId = TEST_IDS.userNormalId;
    testApp.mockRoleRepo.findByCode.mockImplementation((code: string) =>
      Promise.resolve(code === 'ADM' ? roleAdm : roleUsu),
    );
    testApp.mockStateUserRepo.findByCode.mockResolvedValue(stateActive);
  });

  async function getTokenAsAdmin(): Promise<string> {
    const passwordHash = hashPassword('password123');
    const user = createUser(
      TEST_IDS.userAdminId,
      'admin@ejemplo.com',
      passwordHash,
      'Admin',
      roleAdm,
      stateActive,
    );
    testApp.mockUserRepo.findByEmail.mockResolvedValue(user);
    const res = await testApp.request
      .post('/api/auth/login')
      .send({ email: 'admin@ejemplo.com', password: 'password123' });
    return (res.body as { access_token: string }).access_token;
  }

  async function getTokenAsUser(): Promise<string> {
    const passwordHash = hashPassword('password123');
    const user = createUser(
      TEST_IDS.userNormalId,
      'usuario@ejemplo.com',
      passwordHash,
      'Usuario',
      roleUsu,
      stateActive,
    );
    testApp.mockUserRepo.findByEmail.mockResolvedValue(user);
    const res = await testApp.request
      .post('/api/auth/login')
      .send({ email: 'usuario@ejemplo.com', password: 'password123' });
    return (res.body as { access_token: string }).access_token;
  }

  test('Consultar propio perfil exitosamente', ({ given, when, then }) => {
    given('un token JWT de usuario con id conocido', async () => {
      authToken = await getTokenAsUser();
      targetUserId = TEST_IDS.userNormalId;
      const user = createUser(
        TEST_IDS.userNormalId,
        'usuario@ejemplo.com',
        hashPassword('x'),
        'Usuario',
        roleUsu,
        stateActive,
      );
      testApp.mockUserRepo.findById.mockResolvedValue(user);
    });

    when('se envía la petición GET /api/users/:id con su propio id', async () => {
      const res = await testApp.request
        .get(`/api/users/${targetUserId}`)
        .set('Authorization', `Bearer ${authToken}`);
      response = { status: res.status, body: res.body };
    });

    then('la respuesta debe ser 200', () => {
      expect(response.status).toBe(200);
    });

    then('la respuesta debe incluir email y name', () => {
      const body = response.body as { email?: string; name?: string };
      expect(body.email).toBeDefined();
      expect(body.name).toBeDefined();
    });
  });

  test('Administrador consulta perfil de otro usuario', ({ given, when, then }) => {
    given('un token JWT de administrador', async () => {
      authToken = await getTokenAsAdmin();
    });

    when('se envía la petición GET /api/users/:id con id de otro usuario', async () => {
      const otherUser = createUser(
        TEST_IDS.otherUserId,
        'otro@ejemplo.com',
        hashPassword('x'),
        'Otro',
        roleUsu,
        stateActive,
      );
      testApp.mockUserRepo.findById.mockResolvedValue(otherUser);
      const res = await testApp.request
        .get(`/api/users/${TEST_IDS.otherUserId}`)
        .set('Authorization', `Bearer ${authToken}`);
      response = { status: res.status, body: res.body };
    });

    then('la respuesta debe ser 200', () => {
      expect(response.status).toBe(200);
    });
  });

  test('Usuario normal no puede consultar perfil ajeno', ({ given, when, then }) => {
    given('un token JWT de usuario normal', async () => {
      authToken = await getTokenAsUser();
    });

    when('se envía la petición GET /api/users/:id con id de otro usuario', async () => {
      const res = await testApp.request
        .get(`/api/users/${TEST_IDS.otherUserId}`)
        .set('Authorization', `Bearer ${authToken}`);
      response = { status: res.status, body: res.body };
    });

    then('la respuesta debe ser 403', () => {
      expect(response.status).toBe(403);
    });
  });

  test('Consultar usuario sin token', ({ given, when, then }) => {
    given('no hay token de autenticación', () => {});

    when('se envía la petición GET /api/users/:id', async () => {
      const res = await testApp.request.get(`/api/users/${TEST_IDS.userNormalId}`);
      response = { status: res.status, body: res.body };
    });

    then('la respuesta debe ser 401', () => {
      expect(response.status).toBe(401);
    });
  });

  test('Consultar usuario inexistente', ({ given, when, then }) => {
    given('un token JWT de administrador', async () => {
      authToken = await getTokenAsAdmin();
    });

    when('se envía la petición GET /api/users/:id con id inexistente', async () => {
      testApp.mockUserRepo.findById.mockResolvedValue(null);
      const res = await testApp.request
        .get('/api/users/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${authToken}`);
      response = { status: res.status, body: res.body };
    });

    then('la respuesta debe ser 404', () => {
      expect(response.status).toBe(404);
    });
  });
});
