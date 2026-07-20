# Arquitectura de Wyss Studio

## Objetivo

Wyss Studio separa el diseño visual de la implementación específica de cada dispositivo. El editor produce un documento declarativo versionado; cada cliente Wyss lo interpreta mediante su propio renderer.

```text
Editor web
  └─ StudioProject 1.0.0
       ├─ device profile
       ├─ screens
       ├─ components
       └─ actions
             ↓
Publication API
  ├─ validation
  ├─ immutable release number
  ├─ SHA-256 checksum
  └─ downloadable release package
             ↓
Target renderer
  ├─ ESP32 + LVGL
  ├─ Wyss Mobile
  └─ Wyss Desktop
```

## Límites de responsabilidad

### Web

- edición y previsualización;
- historial de cambios local;
- importación y exportación;
- selección de perfil de dispositivo;
- envío del proyecto al endpoint de publicación.

### API

- validación semántica y de límites físicos;
- persistencia del último proyecto;
- creación de versiones inmutables;
- generación de checksum y manifiesto;
- distribución del paquete JSON.

### Renderer de dispositivo

No forma parte de este repositorio todavía. Debe:

1. verificar `schemaVersion`, destino y checksum;
2. descargar la versión solo si es posterior a la instalada;
3. construir widgets nativos a partir del documento;
4. resolver `navigate` localmente;
5. enviar `wyss.command` a Wyss Core;
6. conservar la versión anterior para rollback.

## Contrato de publicación

Una publicación genera:

```json
{
  "manifest": {
    "projectId": "wyss-home",
    "schemaVersion": "1.0.0",
    "releaseVersion": 1,
    "target": "esp32",
    "checksum": "sha256...",
    "createdAt": "2026-07-20T00:00:00Z"
  },
  "interface": {}
}
```

El checksum se calcula sobre la serialización canónica de `interface`. El renderer no debe activar una versión cuyo checksum no coincida.

## Decisiones

- JSON declarativo en lugar de HTML para mantener independencia de plataforma.
- SQLite por defecto para instalación local simple; el repositorio abstrae la persistencia para una migración posterior.
- Persistencia local en el navegador para no perder trabajo si la API está caída.
- Exportación automática como fallback de publicación offline.
- Sin ejecución arbitraria: las acciones solo pueden ser navegación o comandos nombrados de Wyss.
