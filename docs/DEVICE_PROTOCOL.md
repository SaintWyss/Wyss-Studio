# Protocolo de consumo para dispositivos Wyss

## Descubrimiento

El dispositivo consulta periódicamente:

```http
GET /api/projects/{project_id}/releases/latest
```

Compara `version` con su versión instalada. Si existe una más nueva descarga:

```http
GET /api/projects/{project_id}/releases/{version}/download
```

## Activación segura

1. Descargar a un slot temporal.
2. Validar JSON y `schemaVersion`.
3. Confirmar que `manifest.target` coincide con el dispositivo.
4. Recalcular SHA-256 de `interface`.
5. Construir la UI en memoria.
6. Activar la versión nueva.
7. Mantener la versión anterior como rollback.
8. Reportar resultado a Wyss Core cuando exista el canal de telemetría.

## Mapeo recomendado para LVGL

| Studio type | LVGL |
|---|---|
| `text` | `lv_label` |
| `button` | `lv_button` + `lv_label` |
| `switch` | `lv_switch` |
| `card` | `lv_obj` |
| `status` | `lv_obj` + indicadores |
| `progress` | `lv_bar` |

Los comandos `wyss.command` deben enviarse al bridge de Wyss Home. El renderer no ejecuta comandos del sistema operativo directamente.
