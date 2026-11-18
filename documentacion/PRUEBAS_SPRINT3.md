# Plan de pruebas y evidencias de validación — VíaClara

## Alcance

Plataforma web georreferenciada para la gestión de afectaciones viales en Florencia, Caquetá. Las verificaciones se dividen en pruebas automatizadas del backend Laravel y pruebas de integración y uso en un entorno relevante.

**Publicar el código en GitHub y aprobar pruebas unitarias/de integración no es, por sí mismo, suficiente para declarar TRL5.** Se requiere demostrar el funcionamiento de la tecnología integrada en condiciones pertinentes y aportar evidencias.

## Resultado de las pruebas automatizadas

La persona encargada del proyecto compartió la salida de PHPUnit obtenida en su instalación local el **18 de noviembre de 2026**:

```text
PHPUnit 12.5.44 by Sebastian Bergmann and contributors.
Runtime: PHP 8.5.12
........... 11 / 11 (100%)
Time: 00:03.784, Memory: 54.00 MB
OK (11 tests, 76 assertions)
```

**Estado:** 11 pruebas aprobadas; 76 aserciones; 0 fallos reportados. Este resultado se basa en la ejecución documentada por el usuario en Windows 10; no corresponde a una ejecución de CI en GitHub.

**Aislamiento:** `phpunit.xml` establece `DB_CONNECTION=sqlite` y `DB_DATABASE=:memory:`. Las pruebas usan una base temporal independiente de los registros locales de trabajo.

**Reproducción en Windows (CMD), desde la raíz del repositorio:**

```bat
composer install
composer dump-autoload
vendor\bin\phpunit.bat
```

La dependencia `mockery/mockery` está declarada como dependencia de desarrollo junto con `phpunit/phpunit`.

## Matriz de pruebas

| ID | Comprobación | Método / evidencia disponible | Estado |
| --- | --- | --- | --- |
| P01 | Restringir acceso a reportes sin iniciar sesión | PHPUnit / pruebas de autenticación | Automatizada, aprobada |
| P02 | Inicio y cierre de sesión | PHPUnit / flujo de sesión | Automatizada, aprobada |
| P03 | Registrar y consultar una afectación en SQLite | PHPUnit / modelo y endpoint de reportes | Automatizada, aprobada |
| P04 | Conservar reportes tras reiniciar el servidor | Verificación manual con base persistente | Pendiente de evidenciar |
| P05 | Editar reporte e historial | PHPUnit / actualización de registro | Automatizada, aprobada |
| P06 | Cambiar estado y registrar transición | PHPUnit / historial | Automatizada, aprobada |
| P07 | Rechazar valores inválidos | PHPUnit / validación | Automatizada, aprobada |
| P08 | Importar y proteger respaldos | PHPUnit / importación válida e inválida | Automatizada, aprobada |
| P09 | Abrir la plataforma desde un segundo dispositivo autorizado y consultar los mismos reportes | Prueba de integración en red local | Pendiente de evidenciar |
| P10 | Completar tareas con participantes reales y medir satisfacción/usabilidad | Prueba de usuario con consentimiento | Pendiente de evidenciar |
| P11 | Navegar mapa y marcadores en pantalla móvil | Prueba visual y funcional | Pendiente de evidenciar |

## Evidencias a conservar

1. Captura completa de la salida de PHPUnit con `OK (11 tests, 76 assertions)`, versión de PHP y fecha de la prueba.
2. Capturas de inicio de sesión y formulario de registro, con datos **ficticios identificados como pruebas**.
3. Evidencia del reporte antes y después de actualizar la página o reiniciar el servidor.
4. Capturas del mapa y la lista donde aparezca el mismo registro georreferenciado.
5. Registro del cambio de estado con su historial.
6. Prueba del mismo servidor desde otro equipo autorizado o teléfono conectado a una red local confiable, y resultado de las tareas realizadas por los participantes.

Registrar para cada evidencia fecha, entorno, procedimiento, resultado esperado, resultado observado, responsable y si se aprobó o falló. No subir credenciales, datos personales ni la base de datos local al repositorio.

## Separación metodológica

Los reportes ficticios empleados en pruebas de software **no son evidencia empírica de afectaciones viales reales**. Las pruebas de usabilidad del sistema son distintas de la aplicación de la encuesta investigativa a **al menos 30 participantes reales**, requerida en la retroalimentación del tutor de la Fase 3.

## Pendientes para sustentar TRL5

- Confirmar y documentar la persistencia tras reiniciar la aplicación.
- Validar el flujo integrado desde un segundo dispositivo en un entorno pertinente y seguro.
- Realizar tareas guiadas con participantes reales y reunir resultados de usabilidad.
- Asociar cada prueba con los requerimientos y documentar hallazgos.
- Incorporar las evidencias al documento maestro y al video de sustentación (máximo 10 minutos).

**Estado académico:** evidencias parciales de integración; validación TRL5 todavía en desarrollo.
