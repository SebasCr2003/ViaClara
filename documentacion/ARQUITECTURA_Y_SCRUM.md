# Arquitectura y metodología Scrum — VíaClara

## Arquitectura de la aplicación

VíaClara utiliza Laravel como base de la aplicación web, Blade y JavaScript para la interfaz y SQLite para almacenar la información.

El funcionamiento general es el siguiente:

**Inicio de sesión → Interfaz web → Rutas Laravel → Validación de datos → Modelos Eloquent → Base de datos SQLite.**

Las consultas actualizan las secciones de mapa, reportes, estadísticas e historial. Las operaciones de gestión se realizan con sesión autenticada.

## Organización del desarrollo con Scrum

Se organizaron las funcionalidades mediante historias de usuario, estimaciones y revisiones de los avances. Este enfoque permite desarrollar y comprobar los módulos de manera progresiva.

| Historia | Necesidad | Estimación |
| --- | --- | ---: |
| HU-09 | Iniciar sesión y proteger el acceso a los reportes | 5 puntos |
| HU-10 | Registrar y editar reportes de afectaciones | 8 puntos |
| HU-11 | Cambiar el estado de una afectación y consultar su historial | 5 puntos |
| HU-12 | Exportar e importar respaldos de reportes | 5 puntos |

## Criterios de aceptación

- **HU-09:** si no se ha iniciado sesión, al intentar acceder a los reportes se solicita autenticación.
- **HU-10:** al registrar información válida, el reporte queda guardado y puede consultarse posteriormente.
- **HU-11:** al actualizar un estado, el cambio aparece en el reporte y su historial.
- **HU-12:** al importar un respaldo válido, se recuperan los registros correspondientes.

## Integración y resultados

La implementación reúne las funciones de autenticación, registro, mapa, consulta, edición, seguimiento y estadísticas. Las pruebas automatizadas de Laravel finalizaron con **11 casos aprobados y 76 aserciones**, complementadas con verificaciones de funcionamiento en computador y celular.

Los resultados y evidencias se describen en [Pruebas y validación](PRUEBAS_SPRINT3.md) y en [Evaluación de usabilidad](PROTOCOLO_USABILIDAD.md).
