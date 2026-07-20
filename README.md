# Wyss Studio

Editor visual local-first para diseñar las pantallas de Wyss desde una PC, previsualizarlas y publicarlas como paquetes versionados para ESP32, celular o escritorio.

## Funciones actuales

- múltiples pantallas por proyecto;
- perfiles ESP32 320×480, móvil y desktop;
- componentes de texto, botón, interruptor, tarjeta, estado y progreso;
- movimiento y redimensionado directo sobre el canvas;
- edición de posición, tamaño, tipografía, colores y radio;
- acciones declarativas `navigate` y `wyss.command`;
- undo/redo con historial de 50 estados;
- guardado automático en el navegador;
- importación y exportación JSON;
- preview por dispositivo;
- API de validación, persistencia y publicación;
- releases inmutables con versión y SHA-256;
- fallback offline: descarga el JSON cuando la API no está disponible.

## Inicio rápido con Docker

```bash
docker compose up --build
```

Abrir `http://localhost:8080`.

## Desarrollo local

Requisitos: Node.js 22+ y Python 3.12+.

Frontend:

```bash
npm install
npm run dev
```

API, en otra terminal:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -e 'apps/api[dev]'
uvicorn app.main:app --app-dir apps/api --reload
```

El frontend usa el proxy de Vite para `/api`.

## Validación

```bash
npm run build
npm run lint
npm run test

.venv/bin/pytest apps/api/tests -q
.venv/bin/ruff check apps/api
```

## Estructura

```text
apps/web       editor React + TypeScript
apps/api       API FastAPI y almacenamiento SQLite
schema         contrato JSON 1.0.0
docs           arquitectura y protocolo de dispositivos
```

## Próxima integración

El siguiente repositorio que debe consumir este contrato es `wyss-home-panel`: descarga una release, la valida y traduce sus componentes a LVGL. La arquitectura y el flujo seguro están definidos en `docs/DEVICE_PROTOCOL.md`.
