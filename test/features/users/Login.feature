Feature: Login (HU-11)

  Scenario: Login exitoso con credenciales válidas
    Given credenciales válidas de usuario
    When se envía la petición de login al API
    Then la respuesta debe ser 200
    And la respuesta debe incluir access_token
    And la respuesta debe incluir el usuario con email y nombre

  Scenario: Login fallido - email no registrado
    Given un email que no está registrado
    When se envía la petición de login al API
    Then la respuesta debe ser 401 o 400

  Scenario: Login fallido - contraseña incorrecta
    Given credenciales con contraseña incorrecta
    When se envía la petición de login al API
    Then la respuesta debe ser 401 o 400

  Scenario: Login fallido - payload inválido (sin email)
    Given un payload de login sin email
    When se envía la petición de login al API
    Then la respuesta debe ser 400
