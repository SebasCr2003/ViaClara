# VíaClara — Sprint 3 (proyecto aplicado UNAD)

**Plataforma web georreferenciada para la gestión de afectaciones viales en Florencia, Caquetá.**

Esta entrega integra el frontend del Sprint 2 con **código de backend Laravel 13**, persistencia mediante **SQLite**, autenticación por sesión y rutas de operaciones CRUD. La carpeta ZIP **no incorpora** las dependencias de Composer (`vendor/`): deben instalarse en un equipo con PHP 8.3+, Composer, `pdo_sqlite`, `sqlite3`, `mbstring`, `xml` y demás extensiones oficiales de Laravel.

## Inicio rápido Windows

1. Desde la carpeta superior ejecuta `01_INSTALAR_VIACLARA_WINDOWS.bat` con conexión a Internet. Se necesita PHP y Composer instalados; si no los tienes, [Laravel Herd](https://herd.laravel.com/windows) es una alternativa de configuración.
2. La instalación ejecuta `composer install`, genera `.env`, APP_KEY y SQLite, crea tablas, y solicita los datos del administrador.
3. Ejecuta `02_INICIAR_VIACLARA_WINDOWS.bat` y entra a **http://127.0.0.1:8000**.
4. Inicia sesión con el correo y contraseña que configuraste. El servidor comienza sin reportes ficticios precargados.

Si solo quieres explorar pantallas sin PHP, usa `../ABRIR_DEMO_SIN_INSTALAR.html`: **es la versión sin backend del Sprint 2**, independiente, con almacenamiento local en el navegador.

## Inicio manual (Linux/macOS)

```sh
cd viaclara_laravel
composer install
cp .env.example .env
php artisan key:generate
# crea un archivo vacío database/database.sqlite
php artisan migrate
php artisan viaclara:admin
php artisan serve --host=127.0.0.1 --port=8000
```

## Arquitectura

- `resources/views/app.blade.php`: interfaz de la plataforma, adaptada de Sprint 2.
- `resources/views/login.blade.php`: pantalla de inicio de sesión.
- `public/assets/css`, `public/assets/js`: estilos y lógica frontend con operaciones HTTP usando sesión/CSRF.
- `routes/web.php`: rutas de interfaz y API interna protegidas con `auth`.
- `app/Http/Controllers/ReportController.php`: CRUD, validación, historial e importación de respaldo.
- `app/Models/Report.php`, `app/Models/User.php`: modelos Eloquent.
- `database/migrations`: tablas `users` y `reports`.
- `database/database.sqlite`: creada por el instalador, **no subir a GitHub**.

## Seguridad y límites

- El backend usa autenticación Laravel, cookie de sesión y protección CSRF de rutas web. No permite registro público automático.
- La cuenta creada por línea de comandos es un usuario administrador de **entorno local**; **no existen permisos diferenciados por rol** ni una bitácora de auditoría inmutable.
- El código está planteado para una aplicación académica local; no está endurecido ni desplegado para producción, por lo que **no debe publicarse abiertamente** sin revisión de seguridad, HTTPS, protección de datos y controles de abuso.
- Los reportes se almacenan en SQLite del equipo que ejecuta Laravel. Para compartirlos, el servidor debe ser accesible desde otros equipos autorizados; no basta con abrir la demo HTML.
- El mapa usa imágenes de OpenStreetMap por Internet; puede mostrar fondo sin teselas si está bloqueado o sin conexión.
- El archivo `.env`, SQLite y los respaldos de datos reales deben mantenerse fuera de repositorios públicos.
- **TRL5 no se declara alcanzado en esta entrega**. Se requiere ejecución, integración, pruebas reales y evidencias en entorno relevante. Los datos simulados de la Fase 3 no sustituyen las 30 encuestas reales solicitadas por el tutor.

## Pruebas

```sh
composer install
php artisan test
```

Las pruebas escritas para Laravel requieren dependencias instaladas y **NO pudieron ejecutarse en el ambiente de generación**. Se verificó sintaxis PHP y JavaScript, y se realizó revisión estática de archivos. Ver `documentacion/PRUEBAS_SPRINT3.md`.

## API (sesión iniciada)

| Método | Ruta | Función |
| --- | --- | --- |
| GET | `/api/reportes` | Lista todos los reportes |
| POST | `/api/reportes` | Crea reporte |
| PUT | `/api/reportes/{id}` | Edita contenido |
| PATCH | `/api/reportes/{id}/estado` | Cambia estado e historial |
| DELETE | `/api/reportes/{id}` | Elimina reporte |
| POST | `/api/reportes/importar` | Reemplaza reportes con respaldo compatible, previa confirmación de interfaz |

Los endpoints tienen controles de sesión y token CSRF en las peticiones realizadas por la interfaz. La importación es destructiva: **haz antes un respaldo JSON**.
