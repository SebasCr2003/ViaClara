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
| P04 | Conservar reportes tras reiniciar el servidor | Reinicio manual del servidor Laravel; el usuario confirmó el 18/11/2026 que los seis reportes y sus estados seguían presentes | Funcionamiento reportado; captura pendiente |
| P05 | Editar reporte e historial | PHPUnit / actualización de registro | Automatizada, aprobada |
| P06 | Cambiar estado y registrar transición | PHPUnit / historial | Automatizada, aprobada |
| P07 | Rechazar valores inválidos | PHPUnit / validación | Automatizada, aprobada |
| P08 | Importar y proteger respaldos | PHPUnit / importación válida e inválida | Automatizada, aprobada |
| P09 | Abrir la plataforma desde un segundo dispositivo autorizado y consultar los mismos reportes | Prueba manual desde un celular en la misma red local, confirmada por el usuario el 18/11/2026 | Funcionamiento reportado; capturas pendientes |
| P10 | Completar tareas con participantes reales y medir satisfacción/usabilidad | Instrumento ViaClara_Usabilidad.xlsx: 5 participantes reales, 15 tareas, 5 consentimientos registrados (19/11/2026) | Realizada; anexar Excel y soportes de aplicación al documento maestro |
| P11 | Navegar mapa y marcadores en pantalla móvil | El usuario indicó que la prueba en celular funcionó el 18/11/2026; falta evidencia visual específica del mapa | Funcionamiento reportado; verificación documentada pendiente |

## Registro de validación móvil — 18 de noviembre de 2026

El usuario informó que VíaClara funcionó desde el celular conectado a la misma red local que el computador donde se ejecuta Laravel. La respuesta se dio después de solicitar comprobar acceso, mapa y consulta de los seis reportes. **Resultado comunicado: satisfactorio.** No se dispone todavía de capturas, medidas de desempeño ni observación independiente, por lo que se registra como verificación manual reportada, no como acreditación concluyente de TRL5.

## Registro de persistencia tras reinicio — 18 de noviembre de 2026

El usuario confirmó que, tras detener y volver a iniciar el servidor Laravel, los **seis reportes** seguían disponibles con sus respectivos estados en VíaClara. **Resultado comunicado: satisfactorio.** Pendiente adjuntar captura de la lista y detallar el entorno y hora; no constituye por sí solo validación completa de TRL5.

## Resultados de evaluación de usabilidad — 19 de noviembre de 2026

El responsable del proyecto confirmó la participación **real de cinco personas**, registradas con códigos U01–U05 en el instrumento `ViaClara_Usabilidad.xlsx`. El archivo consigna 15 tareas evaluadas, 12 completadas sin ayuda (80 %), 2 con ayuda (13,3 %) y 1 no completada (6,7 %). El tiempo medio registrado fue 102,13 segundos por tarea, la satisfacción media 4,16/5 y se documentaron 11 errores. El consentimiento aparece marcado en los cinco registros. Estos resultados son descriptivos de los participantes evaluados y no permiten generalizar a toda la población de Florencia.

Se recomienda anexar el archivo Excel y los soportes de la aplicación a la entrega académica; no subir identificaciones o información personal al repositorio.

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

- Adjuntar captura con los seis reportes después del reinicio del servidor; su persistencia ya fue confirmada verbalmente por el usuario.
- Conservar evidencias visuales de la prueba de acceso y consulta desde el celular en la red local; el usuario ya informó que funcionó.
- Incorporar al documento maestro el Excel y las evidencias de la evaluación de usabilidad realizada con cinco participantes reales.
- Asociar cada prueba con los requerimientos y documentar hallazgos.
- Incorporar las evidencias al documento maestro y al video de sustentación (máximo 10 minutos).

**Estado académico:** evidencias parciales de integración; validación TRL5 todavía en desarrollo.
