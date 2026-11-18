# Protocolo de evaluación de usabilidad — VíaClara

**Proyecto:** plataforma web georreferenciada para la gestión de afectaciones viales en Florencia, Caquetá.

**Objetivo:** comprobar, con cinco participantes reales, que las personas pueden registrar una afectación ficticia, ubicarla en el mapa y consultar su seguimiento. Esta prueba de usabilidad complementa las pruebas automatizadas (11 pruebas y 76 aserciones aprobadas el 18/11/2026); no equivale a la encuesta investigativa de 30 participantes solicitada por el tutor.

## Preparación

- Usar el servidor Laravel con SQLite en una **red local privada de confianza**. No abrir puertos del router ni exponer el servidor a Internet.
- Usar **identificadores U01 a U05** en lugar de nombres, documentos, teléfonos o correos de los participantes.
- Solicitar consentimiento antes de comenzar, explicar que se observará el uso de un sistema académico y permitir abandonar la prueba.
- Iniciar sesión bajo supervisión del responsable del proyecto. **No compartir credenciales administrativas**: por ahora el sistema no tiene cuentas diferenciadas para participantes.
- Crear únicamente **reportes ficticios**, con título «PRUEBA USABILIDAD U0X — hueco en la vía»; explicar que sus ubicaciones no corresponden a daños verificados. Evitar fotografías de personas o información privada.
- Conservar los seis reportes de pruebas previos: no ejecutar `migrate:fresh`, ni usar «Importar respaldo» sin copia y confirmación.

## Instrucciones iguales para las cinco personas

Leer al participante: «Estamos evaluando qué tan fácil resulta usar VíaClara, no tus conocimientos. Realiza las tres actividades usando información ficticia. Puedes pedir ayuda cuando la necesites. Tu participación es voluntaria y tus respuestas serán registradas sin tu nombre».

| Código | Tarea a realizar | Criterio observable para completar |
| --- | --- | --- |
| T1 | **Registrar afectación.** Crear un reporte titulado «PRUEBA USABILIDAD U0X — hueco en la vía», seleccionar tipo «Hueco o bache», prioridad «Media», sector «Centro», dirección «Punto de prueba U0X», escribir una descripción ficticia de al menos 12 caracteres y elegir un punto del mapa en Florencia. | Mensaje de guardado exitoso y reporte visible en «Gestión de reportes». |
| T2 | **Localizar afectación.** Abrir el mapa y encontrar el registro recién creado. | El participante identifica el marcador y puede consultar los datos del reporte. |
| T3 | **Consultar seguimiento.** Localizar el reporte en «Gestión de reportes», abrir su detalle e identificar su estado. | El participante indica correctamente que el estado inicial es «Pendiente», sin alterar los datos. |

El responsable registra por tarea **Completada** (sin ayuda), **Con ayuda**, o **No completada**, el tiempo aproximado en segundos, número de errores y observaciones. Registrar un mismo criterio para todos los participantes; no intervenir a menos que soliciten ayuda o sea necesario para proteger la información.

## Encuesta posterior a las tareas

Marcar de **1 a 5**, donde 1 = totalmente en desacuerdo y 5 = totalmente de acuerdo:

1. Fue fácil entender cómo navegar por VíaClara.
2. El formulario para registrar una afectación fue claro.
3. Fue fácil encontrar el reporte en el mapa.
4. Fue fácil consultar el estado de un reporte.
5. En general, me resultó sencillo utilizar la plataforma.

Pregunta abierta: **¿Qué mejorarías de VíaClara para que fuera más fácil de usar?**

## Registro y criterios de análisis

Registrar fecha, dispositivo (computador/celular), confirmación del consentimiento, tarea, tiempo, resultado y calificaciones. Usar la hoja de cálculo del proyecto para tabularlos. No inventar respuestas ni tiempos.

Indicadores descriptivos:
- **Efectividad sin asistencia:** tareas marcadas «Completada» / tareas evaluadas × 100.
- **Tareas con ayuda:** tareas «Con ayuda» / tareas evaluadas × 100.
- **Tiempo promedio:** media de segundos de tareas con tiempo registrado.
- **Satisfacción promedio:** media de las cinco respuestas por participante, agregadas entre quienes efectivamente respondieron.
- **Problemas recurrentes:** agrupación cualitativa de los comentarios y errores observados.

**Criterios propuestos por el equipo, no requisitos textuales de la guía:** al menos 80 % de tareas completadas sin asistencia y satisfacción promedio igual o superior a 4/5. Si no se logran, analizar causas e incorporar ajustes antes de afirmar que el sistema está validado. Con **n=5 por conveniencia**, los resultados describen esta prueba y no representan estadísticamente a toda Florencia.

## Evidencias recomendadas

- Captura de cada etapa (ocultando contraseñas y datos personales).
- Hoja de registro completada con cinco participantes reales y sus tres tareas.
- Resultados de encuesta, tabla de indicadores y síntesis de mejoras.
- Capturas y notas del funcionamiento integrado en computador y celular.
- Fecha, entorno, responsable y resultado de cada actividad.

## Alcance académico

Estas pruebas recogen evidencia de usabilidad e integración en un entorno pertinente, pero el **nivel TRL5 debe justificarse por el conjunto de evidencias técnicas y de validación en entorno relevante**. La encuesta de Fase 3 aplicada a **al menos 30 participantes reales** es un instrumento diferente y sigue pendiente si no se ha realizado.

Fecha de preparación del protocolo: 18 de noviembre de 2026.
