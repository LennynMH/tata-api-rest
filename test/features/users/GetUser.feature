Feature: Consultar usuario (HU-02)

  Scenario: Consultar propio perfil exitosamente
    Given un token JWT de usuario con id conocido
    When se envía la petición GET /api/users/:id con su propio id
    Then la respuesta debe ser 200
    And la respuesta debe incluir email y name

  Scenario: Administrador consulta perfil de otro usuario
    Given un token JWT de administrador
    When se envía la petición GET /api/users/:id con id de otro usuario
    Then la respuesta debe ser 200

  Scenario: Usuario normal no puede consultar perfil ajeno
    Given un token JWT de usuario normal
    When se envía la petición GET /api/users/:id con id de otro usuario
    Then la respuesta debe ser 403

  Scenario: Consultar usuario sin token
    Given no hay token de autenticación
    When se envía la petición GET /api/users/:id
    Then la respuesta debe ser 401

  Scenario: Consultar usuario inexistente
    Given un token JWT de administrador
    When se envía la petición GET /api/users/:id con id inexistente
    Then la respuesta debe ser 404
