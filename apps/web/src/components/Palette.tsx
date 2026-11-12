import { AlignLeft, CreditCard, Gauge, MousePointerClick, Power, ToggleLeft } from 'lucide-react'
import type { ComponentType } from '../types/studio'

const items: Array<{ type: ComponentType; label: string; icon: typeof AlignLeft }> = [
  { type: 'text', label: 'Texto', icon: AlignLeft },
  { type: 'button', label: 'Botón', icon: MousePointerClick },
  { type: 'switch', label: 'Interruptor', icon: ToggleLeft },
  { type: 'card', label: 'Tarjeta', icon: CreditCard },
  { type: 'status', label: 'Estado', icon: Power },
  { type: 'progress', label: 'Progreso', icon: Gauge },
]

export function Palette({ onAdd }: { onAdd: (type: ComponentType) => void }) {
  return (
    <section className="panel-section">
      <div className="section-heading">
        <span>Componentes</span>
        <small>Click para agregar</small>
      </div>
      <div className="palette-grid">
        {items.map(({ type, label, icon: Icon }) => (
          <button className="palette-item" key={type} onClick={() => onAdd(type)}>
            <Icon size={18} strokeWidth={1.7} />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </section>
  )
}
