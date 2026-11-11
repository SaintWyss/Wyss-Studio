<h1 align="center">Wyss-Studio</h1>

<p align="center"><strong>Diseño visual para las interfaces de Wyss.</strong><br/>Editor local · interfaces · preview</p>


Editor visual local-first para diseñar interfaces de **Wyss Home**, móvil y escritorio desde la PC.

## Estado funcional

- canvas 320×480 y **panel 800×480**;
- componentes de texto, botón, switch, tarjeta y reloj;
- **esquema 1.1**: chip, slider, progreso, lista, barras, anillo de estado y barra de matiz;
- **dos proyectos incluidos**, ambos cargables desde el menú Proyecto y con las mismas siete
  pantallas (Inicio, Hogar, Media, Agenda, Sistema, Durmiendo y Conversación):
  - **Panel — estado actual del firmware** (`src/panelProject.ts`): espejo fiel de lo que corre
    hoy en `wyss-home-panel` (commit `01a473a`). Colores y geometría transcritos de
    `firmware/include/wyss/ui/design_tokens.hpp` y `firmware/src/adapters/lvgl_panel_view.cpp`.
    Si cambiás el firmware, actualizá este archivo en el mismo commit: es lo único que evita que
    Studio vuelva a mostrar una interfaz que no existe.
  - **Panel — diseño propuesto (v2.1)** (`src/designProject.ts`): el mockup cerrado en la sesión
    de diseño. Incluye habitaciones y control "Colmena" en Hogar, y tabs Biblioteca/Equipos en
    Media. **Nada de eso está implementado**: requiere extender el contrato v2 (campo `rooms` en
    `DeviceState`, `devices`/`library` en `MediaState`, acciones `transfer_playback` y
    `play_context`). Sirve como especificación, no como documentación del panel;
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
