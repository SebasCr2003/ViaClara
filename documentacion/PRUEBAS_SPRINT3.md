# Plan de pruebas — Sprint 3

## Evidencia verificable al momento de preparar el paquete

- Archivos PHP revisados mediante `php -l`: sintaxis válida (no prueba comportamiento Laravel).
- JavaScript revisado mediante `node --check`: sintaxis válida.
- Cliente AJAX ejercitado en Node.js con un servidor simulado (`pruebas/TEST_FRONTEND_API_SIMULADA.cjs`): GET, POST, PATCH y DELETE superados. **Esto no prueba el backend Laravel real**.
- Chromium en modo headless no permitió generar una captura en el entorno de trabajo: la comprobación visual en navegador está pendiente.
- Conexión con Laravel y SQLite **no probada en ejecución**, al no disponer de Composer ni de PDO SQLite en el entorno de generación.
- Se dejaron pruebas automáticas de integración Laravel en `tests/Feature/ReportApiTest.php` para ejecutar después de instalar dependencias.

## Pruebas funcionales necesarias antes de sustentar TRL5

| Caso | Entrada | Resultado esperado | Estado |
|---|---|---|---|
| P01 | Ingresar sin autenticarse a /api/reportes | Redirección a inicio de sesión | Pendiente de ejecución Laravel |
| P02 | Inicio de sesión con cuenta creada | Acceso al panel y sesión válida | Pendiente |
| P03 | Crear reporte con coordenadas | Nuevo registro persistente en SQLite | Pendiente |
| P04 | Reiniciar servidor y abrir sesión | Recuperar mismo reporte | Pendiente |
| P05 | Editar un reporte | Conserva ID y agrega evento de historial | Pendiente |
| P06 | Cambiar pendiente a en revisión | Actualiza estado y agrega transición | Pendiente |
| P07 | Crear con latitud 95 | Respuesta 422 de validación | Pendiente |
| P08 | Descargar e importar respaldo | Conserva campos e historial tras restauración | Pendiente |
| P09 | Conectar desde dos navegadores autorizados al mismo servidor | Consultar mismos registros en SQLite | Pendiente |
| P10 | Prueba con usuarios reales | Tareas realizadas y encuesta de satisfacción | Pendiente |
| P11 | Visualizar mapa en móvil | Marcadores y navegación usable | Pendiente |

**Nota:** Los ensayos del proyecto con usuarios son distintos de las 30 encuestas de investigación exigidas por el tutor en la Fase 3.
