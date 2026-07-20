import type { ComponentType, StudioComponent, StudioProject } from '../types/studio'
import { DEVICE_PROFILES } from '../types/studio'

const componentDefaults: Record<ComponentType, Partial<StudioComponent>> = {
  text: { width: 180, height: 40, text: 'Nuevo texto', background: 'transparent', color: '#f7f9fb', fontSize: 20 },
  button: { width: 132, height: 56, text: 'Acción', background: '#5ad7c8', color: '#071311', borderRadius: 14 },
  switch: { width: 160, height: 52, text: 'Interruptor', background: '#18222c', color: '#f7f9fb', value: false },
  card: { width: 280, height: 110, text: 'Tarjeta', background: '#151d26', color: '#f7f9fb', borderRadius: 18 },
  status: { width: 170, height: 64, text: 'Dispositivo online', background: '#151d26', color: '#f7f9fb', value: 'online' },
  progress: { width: 250, height: 62, text: 'Progreso', background: '#151d26', color: '#f7f9fb', value: 68 },
}

export function createComponent(type: ComponentType, index: number): StudioComponent {
  const defaults = componentDefaults[type]
  return {
    id: crypto.randomUUID(),
    type,
    name: `${type}-${index}`,
    x: 24 + (index % 3) * 12,
    y: 24 + (index % 5) * 18,
    width: defaults.width ?? 140,
    height: defaults.height ?? 56,
    text: defaults.text ?? 'Componente',
    background: defaults.background ?? '#151d26',
    color: defaults.color ?? '#f7f9fb',
    borderRadius: defaults.borderRadius ?? 12,
    fontSize: defaults.fontSize ?? 16,
    value: defaults.value,
    action: { type: 'none' },
  }
}

export function createInitialProject(): StudioProject {
  const button = createComponent('button', 0)
  button.x = 24
  button.y = 332
  button.width = 272
  button.text = 'Encender PC'
  button.action = { type: 'wyss.command', value: 'desktop.power_on' }

  const status = createComponent('status', 1)
  status.x = 24
  status.y = 92
  status.width = 272
  status.text = 'PC de escritorio'

  const title = createComponent('text', 2)
  title.x = 24
  title.y = 28
  title.width = 272
  title.text = 'Buenas tardes, Santiago'
  title.fontSize = 22

  return {
    id: 'wyss-home',
    name: 'Wyss Home',
    schemaVersion: '1.0.0',
    device: DEVICE_PROFILES[0],
    screens: [
      {
        id: 'home',
        name: 'Inicio',
        background: '#0b0f14',
        components: [title, status, button],
      },
      {
        id: 'devices',
        name: 'Dispositivos',
        background: '#0b0f14',
        components: [],
      },
    ],
    activeScreenId: 'home',
    updatedAt: new Date().toISOString(),
  }
}
