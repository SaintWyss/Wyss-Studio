# Wyss Studio

Editor visual local-first para diseñar interfaces de **Wyss Home**, móvil y escritorio desde la PC.

## Estado funcional

- canvas 320×480 y **panel 800×480**;
- componentes de texto, botón, switch, tarjeta y reloj;
- **esquema 1.1**: chip, slider, progreso, lista, barras, anillo de estado y barra de matiz;
- **proyecto incluido**: "Wyss Home Panel 800×480" — el diseño v2 cerrado del panel físico (Inicio, Hogar, Media, Agenda, Sistema, Durmiendo y Conversación), cargable desde el menú Proyecto;
- selección, arrastre y edición de propiedades;
- acciones declarativas `navigate` y `wyss.command`;
- preview para ESP32 y móvil;
- persistencia local;
- importación y exportación del contrato JSON;
- preparación de publicación hacia Wyss Home.

## Ejecutar

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
npm run preview
```

## Arquitectura

Wyss Studio no genera HTML para el ESP32. Produce un documento declarativo versionado que podrá ser interpretado por ESP32 + LVGL, la app móvil, el cliente de escritorio y el preview web.

### Esquema 1.1

Extiende 1.0 con retrocompatibilidad (la importación acepta ambas versiones). Campos nuevos opcionales por componente: `value` (0–100 para slider/progreso/matiz), `accent` (color secundario) e `items` (filas de lista como `"Texto"` o `"Chip|Texto"`, barras como `"Etiqueta|alto%|tope"`, segmentos del anillo como colores). El intérprete LVGL mapea cada kind a su widget: slider→`lv_slider`, progreso→`lv_bar`, anillo→`lv_arc`×n, matiz→`lv_colorwheel` o slider de matiz, lista/barras→objetos reutilizados.

La acción **Publicar** actualmente valida y guarda el proyecto local. El próximo bloque incorpora registro de dispositivos, API de versiones, despliegue por HTTP/WebSocket o MQTT, confirmación y rollback.
