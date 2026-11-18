# VíaClara

**Plataforma web georreferenciada para la gestión de afectaciones viales en Florencia, Caquetá, Colombia.**

Proyecto aplicado de Ingeniería de Sistemas desarrollado en el marco del curso Proyecto de Grado de la Universidad Nacional Abierta y a Distancia (UNAD). La aplicación permite registrar, localizar, consultar y hacer seguimiento a reportes de afectaciones viales.

## Funcionalidades

- Inicio y cierre de sesión de usuario.
- Registro de reportes con tipo de afectación, prioridad, sector, descripción y coordenadas geográficas.
- Visualización de reportes en un mapa interactivo basado en OpenStreetMap.
- Consulta, búsqueda y filtrado de registros.
- Edición de reportes y actualización de estados con historial de cambios.
- Panel de estadísticas de las afectaciones registradas.
- Exportación e importación de respaldos de reportes.

## Tecnologías

| Componente | Tecnología |
| --- | --- |
| Aplicación web | Laravel 13 y PHP 8.3 o superior |
| Interfaz | Blade, HTML, CSS y JavaScript |
| Persistencia | SQLite y Eloquent ORM |
| Cartografía | OpenStreetMap |
| Control de versiones | Git y GitHub |
| Organización del desarrollo | Scrum |

## Requisitos

- PHP compatible con Laravel 13, con extensiones SQLite habilitadas.
- Composer.
- Conexión a Internet para instalar las dependencias y cargar el mapa base.

## Instalación local en Windows (CMD)

Ejecuta estos comandos **desde la raíz del repositorio**, donde se encuentran `artisan` y `composer.json`:

```bat
composer install
copy .env.example .env
if not exist database\database.sqlite type nul > database\database.sqlite
php artisan key:generate
php artisan migrate
php artisan viaclara:admin
php artisan serve
```

Abre **http://127.0.0.1:8000** en el navegador e inicia sesión con la cuenta configurada mediante `php artisan viaclara:admin`.

En Windows se puede usar [Laravel Herd](https://herd.laravel.com/windows) para disponer de PHP y Composer. **Si la aplicación ya está instalada y funcionando, no necesitas repetir la instalación ni crear de nuevo el administrador.**

## Estructura del proyecto

| Ruta | Descripción |
| --- | --- |
| `app/Http/Controllers/` | Autenticación y operaciones sobre reportes |
| `app/Models/` | Modelos de usuarios y afectaciones |
| `resources/views/` | Pantallas Blade de inicio de sesión y gestión |
| `public/assets/` | Archivos CSS y JavaScript de la interfaz |
| `routes/web.php` | Rutas web y endpoints internos protegidos |
| `database/migrations/` | Definición de tablas de SQLite |
| `tests/Feature/` | Pruebas automatizadas de Laravel |
| `documentacion/` | Arquitectura, Scrum y plan de pruebas |

## Pruebas

Para ejecutar las pruebas automatizadas del backend en Windows (CMD):

```bat
composer dump-autoload
vendor\bin\phpunit.bat
```

En Linux/macOS, utiliza `vendor/bin/phpunit`. En este repositorio se ejecuta PHPUnit directamente; el comando opcional `php artisan test` requiere componentes de desarrollo que no se incluyen por defecto en este proyecto.

El resultado de este comando debe verificarse y conservarse como evidencia. También deben realizarse pruebas de navegación, georreferenciación, persistencia, validación de formularios y uso en dispositivos distintos.

## Seguridad y tratamiento de datos

- El archivo `.env`, la base de datos SQLite y las credenciales personales **no deben subirse a GitHub**.
- El acceso se protege mediante autenticación de Laravel y tokens CSRF en las operaciones correspondientes.
- La aplicación está en una fase de validación académica; antes de un despliegue público se requieren controles adicionales de seguridad, privacidad y operación.
- La plataforma no constituye un canal oficial de recepción de solicitudes ante autoridades municipales.

## Estado de validación académica

El código se encuentra versionado en este repositorio. La instalación y el registro de reportes se han realizado en un entorno local, pero **el nivel TRL5 no se acredita únicamente con publicar el código**. Deben reunirse los resultados de pruebas de integración y validación en un entorno relevante, junto con la evidencia y el video exigidos en la Fase 4.

Los reportes de prueba utilizados para verificar la aplicación son distintos de los datos empíricos de la investigación; estos últimos deben proceder de participantes reales.

## Documentación

- [`Arquitectura y Scrum`](documentacion/ARQUITECTURA_Y_SCRUM.md)
- [`Plan de pruebas`](documentacion/PRUEBAS_SPRINT3.md)
- [`Protocolo de usabilidad con cinco participantes`](documentacion/PROTOCOLO_USABILIDAD.md)
