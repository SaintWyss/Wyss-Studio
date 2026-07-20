import type { ChangeEvent } from 'react'
import { Copy, Trash2 } from 'lucide-react'
import type { StudioComponent, StudioScreen } from '../types/studio'

function NumberField({ label, value, onChange, min = 0 }: { label: string; value: number; onChange: (value: number) => void; min?: number }) {
  return (
    <label className="field compact-field">
      <span>{label}</span>
      <input type="number" min={min} value={value} onChange={(event) => onChange(Number(event.target.value))} />
    </label>
  )
}

export function PropertiesPanel({
  component,
  screen,
  onChange,
  onScreenChange,
  onDelete,
  onDuplicate,
}: {
  component: StudioComponent | null
  screen: StudioScreen
  onChange: (patch: Partial<StudioComponent>) => void
  onScreenChange: (patch: Partial<StudioScreen>) => void
  onDelete: () => void
  onDuplicate: () => void
}) {
  if (!component) {
    return (
      <aside className="properties panel">
        <div className="panel-title">Pantalla</div>
        <label className="field">
          <span>Nombre</span>
          <input value={screen.name} onChange={(event) => onScreenChange({ name: event.target.value })} />
        </label>
        <label className="field">
          <span>Fondo</span>
          <div className="color-field"><input type="color" value={screen.background} onChange={(event) => onScreenChange({ background: event.target.value })} /><code>{screen.background}</code></div>
        </label>
        <div className="empty-selection">
          <strong>Ningún componente seleccionado</strong>
          <p>Seleccioná un elemento del canvas para editar sus propiedades y acciones.</p>
        </div>
      </aside>
    )
  }

  const change = (key: keyof StudioComponent) => (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    onChange({ [key]: event.target.value })
  }

  return (
    <aside className="properties panel">
      <div className="properties-header">
        <div><small>{component.type}</small><div className="panel-title">{component.name}</div></div>
        <div className="toolbar-group">
          <button className="icon-button compact" onClick={onDuplicate} title="Duplicar"><Copy size={16} /></button>
          <button className="icon-button compact danger" onClick={onDelete} title="Eliminar"><Trash2 size={16} /></button>
        </div>
      </div>

      <label className="field"><span>Texto</span><input value={component.text} onChange={change('text')} /></label>
      <div className="field-grid">
        <NumberField label="X" value={component.x} onChange={(x) => onChange({ x })} />
        <NumberField label="Y" value={component.y} onChange={(y) => onChange({ y })} />
        <NumberField label="Ancho" value={component.width} min={44} onChange={(width) => onChange({ width })} />
        <NumberField label="Alto" value={component.height} min={32} onChange={(height) => onChange({ height })} />
      </div>
      <div className="field-grid">
        <NumberField label="Fuente" value={component.fontSize} min={8} onChange={(fontSize) => onChange({ fontSize })} />
        <NumberField label="Radio" value={component.borderRadius} onChange={(borderRadius) => onChange({ borderRadius })} />
      </div>
      <label className="field"><span>Fondo</span><div className="color-field"><input type="color" value={component.background === 'transparent' ? '#0b0f14' : component.background} onChange={(event) => onChange({ background: event.target.value })} /><code>{component.background}</code></div></label>
      <label className="field"><span>Texto</span><div className="color-field"><input type="color" value={component.color} onChange={(event) => onChange({ color: event.target.value })} /><code>{component.color}</code></div></label>

      <div className="divider" />
      <div className="section-heading"><span>Acción</span></div>
      <label className="field">
        <span>Tipo</span>
        <select value={component.action.type} onChange={(event) => onChange({ action: { ...component.action, type: event.target.value as StudioComponent['action']['type'] } })}>
          <option value="none">Sin acción</option>
          <option value="navigate">Navegar</option>
          <option value="wyss.command">Comando Wyss</option>
        </select>
      </label>
      {component.action.type !== 'none' && (
        <label className="field"><span>{component.action.type === 'navigate' ? 'Pantalla destino' : 'Comando'}</span><input value={component.action.value ?? ''} placeholder="desktop.power_on" onChange={(event) => onChange({ action: { ...component.action, value: event.target.value } })} /></label>
      )}
    </aside>
  )
}
