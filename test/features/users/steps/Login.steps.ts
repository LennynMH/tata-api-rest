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

const feature = loadFeature('../Login.feature', { loadRelativePath: true, errors: true });

defineFeature(feature, (test) => {
  let testApp: UsersTestApp;
  let response: { status: number; body: unknown };
  const roleAdm = createRole(TEST_IDS.roleAdmId, 'ADM', 'Administrador');
  const stateActive = createStateUser(TEST_IDS.stateActiveId, 'ACT', 'Activo');

  beforeAll(async () => {
    testApp = await createUsersTestApp();
  });

  afterAll(async () => {
    await testApp.app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Login exitoso con credenciales válidas', ({ given, when, then }) => {
    given('credenciales válidas de usuario', () => {
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
    });

    when('se envía la petición de login al API', async () => {
      const res = await testApp.request
        .post('/api/auth/login')
        .send({ email: 'admin@ejemplo.com', password: 'password123' });
      response = { status: res.status, body: res.body };
    });

    then('la respuesta debe ser 200', () => {
      expect([200, 201]).toContain(response.status);
    });

    then('la respuesta debe incluir access_token', () => {
      expect((response.body as { access_token?: string }).access_token).toBeDefined();
    });

    then('la respuesta debe incluir el usuario con email y nombre', () => {
      const body = response.body as { user?: { email: string; name: string } };
      expect(body.user?.email).toBe('admin@ejemplo.com');
      expect(body.user?.name).toBeDefined();
    });
  });

  test('Login fallido - email no registrado', ({ given, when, then }) => {
    given('un email que no está registrado', () => {
      testApp.mockUserRepo.findByEmail.mockResolvedValue(null);
    });

    when('se envía la petición de login al API', async () => {
      const res = await testApp.request
        .post('/api/auth/login')
        .send({ email: 'noexiste@ejemplo.com', password: 'password123' });
      response = { status: res.status, body: res.body };
    });

    then('la respuesta debe ser 401 o 400', () => {
      expect([400, 401]).toContain(response.status);
    });
  });

  test('Login fallido - contraseña incorrecta', ({ given, when, then }) => {
    given('credenciales con contraseña incorrecta', () => {
      const passwordHash = hashPassword('otra-password');
      const user = createUser(
        TEST_IDS.userAdminId,
        'admin@ejemplo.com',
        passwordHash,
        'Admin',
        roleAdm,
        stateActive,
      );
      testApp.mockUserRepo.findByEmail.mockResolvedValue(user);
    });

    when('se envía la petición de login al API', async () => {
      const res = await testApp.request
        .post('/api/auth/login')
        .send({ email: 'admin@ejemplo.com', password: 'password123' });
      response = { status: res.status, body: res.body };
    });

    then('la respuesta debe ser 401 o 400', () => {
      expect([400, 401]).toContain(response.status);
    });
  });

  test('Login fallido - payload inválido (sin email)', ({ given, when, then }) => {
    given('un payload de login sin email', () => {});

    when('se envía la petición de login al API', async () => {
      const res = await testApp.request.post('/api/auth/login').send({ password: 'password123' });
      response = { status: res.status, body: res.body };
    });

    then('la respuesta debe ser 400', () => {
      expect(response.status).toBe(400);
    });
  });
});
