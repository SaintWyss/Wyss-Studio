# Wyss Studio

Editor visual local-first para diseñar interfaces de **Wyss Home**, móvil y escritorio desde la PC.

## Estado funcional

- canvas 320×480;
- componentes de texto, botón, switch, tarjeta y reloj;
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

La acción **Publicar** actualmente valida y guarda el proyecto local. El próximo bloque incorpora registro de dispositivos, API de versiones, despliegue por HTTP/WebSocket o MQTT, confirmación y rollback.
