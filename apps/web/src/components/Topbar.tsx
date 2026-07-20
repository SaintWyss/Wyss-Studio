import { Download, Eye, Redo2, Rocket, Undo2, Upload } from 'lucide-react'
import type { DeviceProfile, StudioProject } from '../types/studio'

export function Topbar({
  project,
  devices,
  canUndo,
  canRedo,
  publishing,
  onDeviceChange,
  onUndo,
  onRedo,
  onPreview,
  onExport,
  onImport,
  onPublish,
}: {
  project: StudioProject
  devices: DeviceProfile[]
  canUndo: boolean
  canRedo: boolean
  publishing: boolean
  onDeviceChange: (device: DeviceProfile) => void
  onUndo: () => void
  onRedo: () => void
  onPreview: () => void
  onExport: () => void
  onImport: () => void
  onPublish: () => void
}) {
  return (
    <header className="topbar">
      <div className="brand"><div className="brand-mark">W</div><div><strong>Wyss Studio</strong><small>Interface Composer</small></div></div>
      <div className="topbar-center">
        <select className="device-select" value={project.device.id} onChange={(event) => onDeviceChange(devices.find((device) => device.id === event.target.value) ?? devices[0])}>
          {devices.map((device) => <option key={device.id} value={device.id}>{device.name}</option>)}
        </select>
        <div className="toolbar-group">
          <button className="icon-button" disabled={!canUndo} onClick={onUndo} title="Deshacer"><Undo2 size={17} /></button>
          <button className="icon-button" disabled={!canRedo} onClick={onRedo} title="Rehacer"><Redo2 size={17} /></button>
        </div>
      </div>
      <div className="topbar-actions">
        <button className="icon-button" onClick={onImport} title="Importar JSON"><Upload size={17} /></button>
        <button className="icon-button" onClick={onExport} title="Exportar JSON"><Download size={17} /></button>
        <button className="button secondary" onClick={onPreview}><Eye size={17} />Previsualizar</button>
        <button className="button primary" disabled={publishing} onClick={onPublish}><Rocket size={17} />{publishing ? 'Publicando…' : 'Publicar'}</button>
      </div>
    </header>
  )
}
