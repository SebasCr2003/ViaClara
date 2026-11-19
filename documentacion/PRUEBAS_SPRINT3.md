# Pruebas y validación de VíaClara

## Descripción

Se verificó el funcionamiento de los módulos principales de VíaClara, plataforma web para la gestión georreferenciada de afectaciones viales en Florencia, Caquetá. La evaluación incluyó pruebas automatizadas, persistencia de información, acceso desde computador y celular, y una evaluación de usabilidad.

## Pruebas automatizadas

Las pruebas de Laravel se ejecutaron el **18 de noviembre de 2026** con PHP 8.5.12 y PHPUnit 12.5.44, en Windows 10.

```text
........... 11 / 11 (100%)
Time: 00:03.784, Memory: 54.00 MB
OK (11 tests, 76 assertions)
```

**Resultado:** 11 pruebas aprobadas, con 76 aserciones satisfactorias.

La configuración `phpunit.xml` utiliza SQLite en memoria durante las pruebas, de manera independiente de la base de datos de la aplicación.

Para reproducir las pruebas desde la carpeta principal del proyecto:

```bat
composer install
vendor\bin\phpunit.bat
```

## Pruebas funcionales

| Código | Función evaluada | Resultado |
| --- | --- | --- |
| P01 | Restricción de acceso sin iniciar sesión | Aprobada (PHPUnit) |
| P02 | Inicio y cierre de sesión | Aprobada (PHPUnit) |
| P03 | Registro y consulta de afectaciones en SQLite | Aprobada (PHPUnit) |
| P04 | Persistencia de seis reportes después de reiniciar Laravel | Satisfactoria (verificación manual) |
| P05 | Edición de reportes e historial | Aprobada (PHPUnit) |
| P06 | Cambio de estado y seguimiento | Aprobada (PHPUnit) |
| P07 | Validación de campos y rechazo de datos incorrectos | Aprobada (PHPUnit) |
| P08 | Importación de respaldos | Aprobada (PHPUnit) |
| P09 | Acceso a la plataforma desde un celular en la red local | Satisfactoria (verificación manual) |
| P10 | Evaluación de usabilidad con cinco participantes | Realizada |
| P11 | Navegación por la plataforma desde un dispositivo móvil | Satisfactoria (verificación manual) |

## Funcionamiento en diferentes dispositivos

La aplicación se ejecutó con Laravel en un computador y se consultó desde un celular conectado a la misma red local. Se verificó el acceso a VíaClara, la consulta del mapa y la disponibilidad de los reportes.

También se comprobó que los seis registros permanecieron almacenados en SQLite después de detener y reiniciar el servidor.

## Resultados de usabilidad

La evaluación se realizó con **cinco participantes reales**, identificados mediante códigos U01 a U05. Se evaluaron 15 tareas relacionadas con el registro, la localización y la consulta de afectaciones.

| Indicador | Resultado |
| --- | ---: |
| Participantes | 5 |
| Tareas evaluadas | 15 |
| Tareas completadas sin ayuda | 12 (80 %) |
| Tareas completadas con ayuda | 2 (13,3 %) |
| Tareas no completadas | 1 (6,7 %) |
| Tiempo promedio registrado por tarea | 102,13 segundos |
| Satisfacción promedio | 4,16/5 |
| Errores registrados | 11 |

Los resultados y observaciones se encuentran en el archivo **ViaClara_Usabilidad.xlsx**.

## Desarrollo y validación tecnológica — TRL5

VíaClara integra la autenticación, el registro y almacenamiento de reportes, la georreferenciación, el seguimiento de estados y la visualización de estadísticas. Su funcionamiento se ha examinado mediante pruebas automatizadas, pruebas de uso en computador y celular y evaluación de usabilidad.

La arquitectura, la metodología Scrum, la matriz de requerimientos y el conjunto de evidencias técnicas para sustentar el nivel TRL5 se presentan en el documento maestro de la Fase 4 y sus anexos.
