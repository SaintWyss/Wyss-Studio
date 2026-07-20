import { useRef, useState } from 'react'
import { CheckCircle2, CloudOff, Layers3 } from 'lucide-react'
import { Palette } from './components/Palette'
import { PreviewModal } from './components/PreviewModal'
import { PropertiesPanel } from './components/PropertiesPanel'
import { ScreenList } from './components/ScreenList'
import { StudioCanvas } from './components/StudioCanvas'
import { Topbar } from './components/Topbar'
import { useStudio } from './hooks/useStudio'
import { DEVICE_PROFILES } from './types/studio'
import type { StudioProject } from './types/studio'

function downloadJson(project: StudioProject) {
  const blob = new Blob([JSON.stringify(project, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `${project.id}-${new Date().toISOString().slice(0, 10)}.json`
  anchor.click()
  URL.revokeObjectURL(url)
}

export default function App() {
  const studio = useStudio()
  const importRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [notice, setNotice] = useState<{ kind: 'success' | 'offline'; text: string } | null>(null)

  const publish = async () => {
    setPublishing(true)
    setNotice(null)
    try {
      const response = await fetch(`/api/projects/${studio.project.id}/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studio.project),
      })
      if (!response.ok) throw new Error('publish failed')
      const result = await response.json() as { version: number }
      setNotice({ kind: 'success', text: `Versión ${result.version} publicada correctamente.` })
    } catch {
      downloadJson(studio.project)
      setNotice({ kind: 'offline', text: 'API no disponible. Se exportó el paquete JSON para transferencia manual.' })
    } finally {
      setPublishing(false)
      window.setTimeout(() => setNotice(null), 5000)
    }
  }

  const importFile = async (file: File | undefined) => {
    if (!file) return
    const project = JSON.parse(await file.text()) as StudioProject
    if (!project.id || !project.screens || !project.device) throw new Error('Proyecto inválido')
    studio.importProject(project)
  }

  return (
    <div className="app-shell">
      <Topbar
        project={studio.project}
        devices={DEVICE_PROFILES}
        canUndo={studio.canUndo}
        canRedo={studio.canRedo}
        publishing={publishing}
        onDeviceChange={(device) => studio.updateProject({ device })}
        onUndo={studio.undo}
        onRedo={studio.redo}
        onPreview={() => setPreview(true)}
        onExport={() => downloadJson(studio.project)}
        onImport={() => importRef.current?.click()}
        onPublish={publish}
      />
      <input ref={importRef} className="visually-hidden" type="file" accept="application/json" onChange={(event) => void importFile(event.target.files?.[0])} />

      <main className="workspace">
        <aside className="sidebar panel">
          <div className="project-summary">
            <div className="project-icon"><Layers3 size={19} /></div>
            <div><small>Proyecto</small><strong>{studio.project.name}</strong></div>
          </div>
          <ScreenList screens={studio.project.screens} activeId={studio.project.activeScreenId} onSelect={studio.setActiveScreen} onAdd={studio.addScreen} />
          <Palette onAdd={studio.addComponent} />
          <div className="sidebar-footer"><span className="online-dot" />Guardado local automático</div>
        </aside>

        <section className="editor-area">
          <div className="editor-header">
            <div><small>Editando</small><strong>{studio.activeScreen.name}</strong></div>
            <div className="canvas-hint">Arrastrá para mover · esquina inferior para redimensionar</div>
          </div>
          <StudioCanvas
            screen={studio.activeScreen}
            width={studio.project.device.width}
            height={studio.project.device.height}
            selectedId={studio.selectedId}
            onSelect={studio.setSelectedId}
            onChange={studio.updateComponent}
          />
        </section>

        <PropertiesPanel
          component={studio.selected}
          screen={studio.activeScreen}
          onChange={(patch) => studio.selected && studio.updateComponent(studio.selected.id, patch)}
          onScreenChange={(patch) => studio.updateActiveScreen((screen) => ({ ...screen, ...patch }))}
          onDelete={studio.deleteSelected}
          onDuplicate={studio.duplicateSelected}
        />
      </main>

      {notice && (
        <div className={`toast ${notice.kind}`}>
          {notice.kind === 'success' ? <CheckCircle2 size={18} /> : <CloudOff size={18} />}
          {notice.text}
        </div>
      )}
      {preview && <PreviewModal project={studio.project} screen={studio.activeScreen} onClose={() => setPreview(false)} />}
    </div>
  )
}
