# Arquitectura y metodología ágil — Sprint 3

## Flujo de datos

Usuario autenticado → interfaz Blade/JavaScript → rutas web Laravel con sesión y CSRF → controlador de reportes → validación → modelo Eloquent → archivo SQLite.

Las consultas retornan JSON a la interfaz y esta actualiza mapa, estadísticas, tabla e historial. La demo HTML independiente **no** utiliza estos endpoints.

## Historias de usuario y aceptación

- **HU-09 / 5 puntos:** Como administrador, quiero iniciar sesión para proteger el acceso al entorno de pruebas. **Dado** que no he iniciado sesión, **cuando** solicito la lista de reportes, **entonces** se me redirige a ingreso.
- **HU-10 / 8 puntos:** Como administrador, quiero crear y editar reportes persistentes para recuperar los datos tras reiniciar la página. **Dado** que completé los campos obligatorios, **cuando** guardo, **entonces** se genera un ID y el registro aparece al consultar la API.
- **HU-11 / 5 puntos:** Como administrador, quiero cambiar el estado para seguir las afectaciones. **Dado** un reporte Pendiente, **cuando** lo cambio a En revisión, **entonces** se conserva el reporte y se añade evento al historial.
- **HU-12 / 5 puntos:** Como administrador, quiero importar/exportar respaldos de la base para conservar datos de prueba. **Dado** un JSON válido, **cuando** confirmo el reemplazo, **entonces** se recupera el conjunto esperado de reportes.

## Roles Scrum sugeridos

- Product Owner: portavoz de los requisitos acordados con grupo y tutor.
- Scrum Master: seguimiento de bloqueos y ceremonias.
- Equipo de desarrollo: implementación, documentación y pruebas.

Las estimaciones Scrum anteriores son **propuestas**, requieren validación del equipo.

## Definition of Done (pendiente)

Código revisado, pruebas de integración ejecutadas con resultados, evidencia de funcionamiento en equipo real, retroalimentación de usuarios, bitácora de Sprint Review y Sprint Retrospective.
