import { useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import type { StudioComponent, StudioScreen } from '../types/studio'

function ComponentPreview({ component }: { component: StudioComponent }) {
  if (component.type === 'switch') {
    return (
      <div className="component-row">
        <span>{component.text}</span>
        <span className={`switch-track ${component.value ? 'on' : ''}`}><i /></span>
      </div>
    )
  }

  if (component.type === 'status') {
    return (
      <div className="status-content">
        <i className="status-dot" />
        <span>{component.text}</span>
        <small>{String(component.value ?? 'online')}</small>
      </div>
    )
  }

  if (component.type === 'progress') {
    const value = Number(component.value ?? 0)
    return (
      <div className="progress-content">
        <div><span>{component.text}</span><small>{value}%</small></div>
        <div className="progress-track"><i style={{ width: `${value}%` }} /></div>
      </div>
    )
  }

  return <span>{component.text}</span>
}

type DragState = { id: string; startX: number; startY: number; originX: number; originY: number } | null
type ResizeState = { id: string; startX: number; startY: number; originW: number; originH: number } | null

export function StudioCanvas({
  screen,
  width,
  height,
  selectedId,
  onSelect,
  onChange,
}: {
  screen: StudioScreen
  width: number
  height: number
  selectedId: string | null
  onSelect: (id: string | null) => void
  onChange: (id: string, patch: Partial<StudioComponent>) => void
}) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [drag, setDrag] = useState<DragState>(null)
  const [resize, setResize] = useState<ResizeState>(null)

  const scale = Math.min(1, 620 / height, 760 / width)

  const beginDrag = (event: ReactPointerEvent, component: StudioComponent) => {
    event.stopPropagation()
    event.currentTarget.setPointerCapture(event.pointerId)
    onSelect(component.id)
    setDrag({ id: component.id, startX: event.clientX, startY: event.clientY, originX: component.x, originY: component.y })
  }

  const moveDrag = (event: ReactPointerEvent, component: StudioComponent) => {
    if (!drag || drag.id !== component.id) return
    const x = Math.max(0, Math.min(width - component.width, drag.originX + (event.clientX - drag.startX) / scale))
    const y = Math.max(0, Math.min(height - component.height, drag.originY + (event.clientY - drag.startY) / scale))
    onChange(component.id, { x: Math.round(x), y: Math.round(y) })
  }

  const beginResize = (event: ReactPointerEvent, component: StudioComponent) => {
    event.stopPropagation()
    event.currentTarget.setPointerCapture(event.pointerId)
    setResize({ id: component.id, startX: event.clientX, startY: event.clientY, originW: component.width, originH: component.height })
  }

  const moveResize = (event: ReactPointerEvent, component: StudioComponent) => {
    if (!resize || resize.id !== component.id) return
    const nextWidth = Math.max(44, Math.min(width - component.x, resize.originW + (event.clientX - resize.startX) / scale))
    const nextHeight = Math.max(32, Math.min(height - component.y, resize.originH + (event.clientY - resize.startY) / scale))
    onChange(component.id, { width: Math.round(nextWidth), height: Math.round(nextHeight) })
  }

  return (
    <div className="canvas-stage" onPointerDown={() => onSelect(null)}>
      <div className="canvas-meta"><span>{width} × {height}</span><span>{Math.round(scale * 100)}%</span></div>
      <div
        ref={canvasRef}
        className="device-canvas"
        style={{ width, height, background: screen.background, transform: `scale(${scale})` }}
      >
        {screen.components.map((component) => (
          <div
            key={component.id}
            className={`studio-component type-${component.type} ${selectedId === component.id ? 'selected' : ''}`}
            style={{
              left: component.x,
              top: component.y,
              width: component.width,
              height: component.height,
              background: component.background,
              color: component.color,
              borderRadius: component.borderRadius,
              fontSize: component.fontSize,
            }}
            onPointerDown={(event) => beginDrag(event, component)}
            onPointerMove={(event) => moveDrag(event, component)}
            onPointerUp={() => setDrag(null)}
          >
            <ComponentPreview component={component} />
            {selectedId === component.id && (
              <button
                className="resize-handle"
                aria-label="Redimensionar"
                onPointerDown={(event) => beginResize(event, component)}
                onPointerMove={(event) => moveResize(event, component)}
                onPointerUp={() => setResize(null)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
