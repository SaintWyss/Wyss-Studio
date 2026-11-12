import { X } from 'lucide-react'
import type { StudioProject, StudioScreen } from '../types/studio'

export function PreviewModal({ project, screen, onClose }: { project: StudioProject; screen: StudioScreen; onClose: () => void }) {
  const scale = Math.min(0.95, 650 / project.device.height, 900 / project.device.width)
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" onMouseDown={onClose}>
      <div className="preview-modal" onMouseDown={(event) => event.stopPropagation()}>
        <div className="modal-header"><div><small>Vista previa</small><strong>{project.device.name}</strong></div><button className="icon-button" onClick={onClose}><X size={18} /></button></div>
        <div className="preview-stage">
          <div className="preview-device" style={{ width: project.device.width, height: project.device.height, background: screen.background, transform: `scale(${scale})` }}>
            {screen.components.map((component) => (
              <div className={`studio-component type-${component.type}`} key={component.id} style={{ left: component.x, top: component.y, width: component.width, height: component.height, background: component.background, color: component.color, borderRadius: component.borderRadius, fontSize: component.fontSize }}>
                <span>{component.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
