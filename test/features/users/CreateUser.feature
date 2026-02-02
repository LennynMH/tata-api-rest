Feature: Crear usuario (HU-01)

  Scenario: Crear usuario exitoso como administrador
    Given un token JWT de administrador
    And datos válidos para un nuevo usuario
    When se envía la petición POST /api/users al API
    Then la respuesta debe ser 201
    And la respuesta debe incluir id, email y name del usuario

  Scenario: Crear usuario rechazado - usuario sin rol ADM
    Given un token JWT de usuario normal
    And datos válidos para un nuevo usuario
    When se envía la petición POST /api/users al API
    Then la respuesta debe ser 403

  Scenario: Crear usuario sin token
    Given no hay token de autenticación
    And datos válidos para un nuevo usuario
    When se envía la petición POST /api/users al API
    Then la respuesta debe ser 401

  Scenario: Crear usuario - email ya registrado
    Given un token JWT de administrador
    And un email que ya está registrado
    When se envía la petición POST /api/users al API
    Then la respuesta debe ser 409
