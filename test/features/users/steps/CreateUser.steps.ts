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
const createUserPayload = {
  email: 'nuevo@ejemplo.com',
  password: 'password123',
  name: 'Nuevo Usuario',
  role_cod: 'USU',
};

const feature = loadFeature('../CreateUser.feature', { loadRelativePath: true, errors: true });

defineFeature(feature, (test) => {
  let testApp: UsersTestApp;
  let response: { status: number; body: unknown };
  let authToken: string;
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

  test('Crear usuario exitoso como administrador', ({ given, when, then }) => {
    given('un token JWT de administrador', async () => {
      authToken = await getTokenAsAdmin();
    });

    given('datos válidos para un nuevo usuario', () => {
      testApp.mockUserRepo.findByEmail.mockResolvedValue(null);
      testApp.mockUserRepo.save.mockImplementation((u) => Promise.resolve(u));
    });

    when('se envía la petición POST /api/users al API', async () => {
      const res = await testApp.request
        .post('/api/users')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createUserPayload);
      response = { status: res.status, body: res.body };
    });

    then('la respuesta debe ser 201', () => {
      expect(response.status).toBe(201);
    });

    then('la respuesta debe incluir id, email y name del usuario', () => {
      const body = response.body as { id?: string; email?: string; name?: string };
      expect(body.id).toBeDefined();
      expect(body.email).toBe(createUserPayload.email);
      expect(body.name).toBeDefined();
    });
  });

  test('Crear usuario rechazado - usuario sin rol ADM', ({ given, when, then }) => {
    given('un token JWT de usuario normal', async () => {
      authToken = await getTokenAsUser();
    });

    given('datos válidos para un nuevo usuario', () => {});

    when('se envía la petición POST /api/users al API', async () => {
      const res = await testApp.request
        .post('/api/users')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createUserPayload);
      response = { status: res.status, body: res.body };
    });

    then('la respuesta debe ser 403', () => {
      expect(response.status).toBe(403);
    });
  });

  test('Crear usuario sin token', ({ given, when, then }) => {
    given('no hay token de autenticación', () => {});

    given('datos válidos para un nuevo usuario', () => {});

    when('se envía la petición POST /api/users al API', async () => {
      const res = await testApp.request.post('/api/users').send(createUserPayload);
      response = { status: res.status, body: res.body };
    });

    then('la respuesta debe ser 401', () => {
      expect(response.status).toBe(401);
    });
  });

  test('Crear usuario - email ya registrado', ({ given, when, then }) => {
    given('un token JWT de administrador', async () => {
      authToken = await getTokenAsAdmin();
    });

    given('un email que ya está registrado', () => {
      const existingUser = createUser(
        TEST_IDS.userNormalId,
        createUserPayload.email,
        hashPassword('other'),
        'Existente',
        roleUsu,
        stateActive,
      );
      testApp.mockUserRepo.findByEmail.mockResolvedValue(existingUser);
    });

    when('se envía la petición POST /api/users al API', async () => {
      const res = await testApp.request
        .post('/api/users')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createUserPayload);
      response = { status: res.status, body: res.body };
    });

    then('la respuesta debe ser 409', () => {
      expect(response.status).toBe(409);
    });
  });
});
