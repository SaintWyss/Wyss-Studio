import { LayoutPanelTop, Plus } from 'lucide-react'
import type { StudioScreen } from '../types/studio'

export function ScreenList({
  screens,
  activeId,
  onSelect,
  onAdd,
}: {
  screens: StudioScreen[]
  activeId: string
  onSelect: (id: string) => void
  onAdd: () => void
}) {
  return (
    <section className="panel-section screens-section">
      <div className="section-heading">
        <span>Pantallas</span>
        <button className="icon-button compact" onClick={onAdd} aria-label="Agregar pantalla">
          <Plus size={16} />
        </button>
      </div>
      <div className="screen-list">
        {screens.map((screen) => (
          <button
            key={screen.id}
            className={`screen-item ${activeId === screen.id ? 'active' : ''}`}
            onClick={() => onSelect(screen.id)}
          >
            <LayoutPanelTop size={16} />
            <span>{screen.name}</span>
            <small>{screen.components.length}</small>
          </button>
        ))}
      </div>
    </section>
  )
}
