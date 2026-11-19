# VíaClara

Proyecto de grado de Ingeniería de Sistemas — UNAD.

VíaClara es una aplicación web que estamos desarrollando para registrar y consultar afectaciones viales en Florencia, Caquetá. Su objetivo es organizar los reportes y facilitar su ubicación y seguimiento en un mapa.

## Funciones principales

- Inicio de sesión.
- Registro de afectaciones con ubicación, descripción y prioridad.
- Consulta de reportes en un mapa.
- Búsqueda y filtros de los reportes.
- Edición y cambio de estado (Pendiente, En revisión y Atendido).
- Estadísticas y respaldos de información.

## Herramientas utilizadas

Laravel 13 (PHP), SQLite, Blade, HTML, CSS, JavaScript y OpenStreetMap. El código se administra con Git y GitHub. El desarrollo se organiza con Scrum.

## Cómo ejecutar el proyecto en Windows

Se necesita PHP 8.3 o superior, Composer y las extensiones de SQLite. Desde CMD, en la carpeta principal del repositorio, ejecutar:

```bat
composer install
copy .env.example .env
if not exist database\database.sqlite type nul > database\database.sqlite
php artisan key:generate
php artisan migrate
php artisan viaclara:admin
php artisan serve
```

Abrir `http://127.0.0.1:8000` e iniciar sesión con el usuario creado. Si ya existe una instalación funcionando, no es necesario repetir estos pasos.

## Pruebas realizadas

El 18 de noviembre de 2026 se ejecutaron las pruebas automatizadas con PHPUnit en Windows: **11 pruebas aprobadas y 76 verificaciones**. También se comprobó la conservación de seis registros después de reiniciar el servidor y el acceso desde un celular conectado a la misma red local.

Para ejecutar las pruebas en Windows:

```bat
vendor\bin\phpunit.bat
```

Se cuenta además con un instrumento de evaluación de usabilidad aplicado a cinco participantes. El detalle de los resultados y las evidencias está en la documentación del proyecto.

## Documentación

- [Arquitectura y organización Scrum](documentacion/ARQUITECTURA_Y_SCRUM.md)
- [Pruebas y validación](documentacion/PRUEBAS_SPRINT3.md)
- [Evaluación de usabilidad](documentacion/PROTOCOLO_USABILIDAD.md)

**Nota:** no subir archivos `.env`, bases de datos ni contraseñas a GitHub. La plataforma forma parte de un proyecto académico y no es un canal oficial de reporte ante las autoridades. La validación del nivel TRL5 se sustenta con el conjunto de pruebas y evidencias de la Fase 4.
