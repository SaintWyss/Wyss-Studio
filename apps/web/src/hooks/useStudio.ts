import { useCallback, useEffect, useMemo, useState } from 'react'
import { createComponent, createInitialProject } from '../lib/project'
import type { ComponentType, StudioComponent, StudioProject, StudioScreen } from '../types/studio'

const STORAGE_KEY = 'wyss-studio.project.v1'
const MAX_HISTORY = 50

type Snapshot = StudioProject

function loadProject(): StudioProject {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as StudioProject) : createInitialProject()
  } catch {
    return createInitialProject()
  }
}

export function useStudio() {
  const [project, setProject] = useState<StudioProject>(loadProject)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [history, setHistory] = useState<Snapshot[]>([])
  const [future, setFuture] = useState<Snapshot[]>([])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(project))
  }, [project])

  const commit = useCallback((producer: (current: StudioProject) => StudioProject) => {
    setProject((current) => {
      setHistory((items) => [...items.slice(-(MAX_HISTORY - 1)), current])
      setFuture([])
      const next = producer(current)
      return { ...next, updatedAt: new Date().toISOString() }
    })
  }, [])

  const activeScreen = useMemo(
    () => project.screens.find((screen) => screen.id === project.activeScreenId) ?? project.screens[0],
    [project],
  )

  const selected = activeScreen.components.find((component) => component.id === selectedId) ?? null

  const updateActiveScreen = useCallback(
    (updater: (screen: StudioScreen) => StudioScreen) => {
      commit((current) => ({
        ...current,
        screens: current.screens.map((screen) =>
          screen.id === current.activeScreenId ? updater(screen) : screen,
        ),
      }))
    },
    [commit],
  )

  const addComponent = useCallback(
    (type: ComponentType) => {
      const component = createComponent(type, activeScreen.components.length)
      updateActiveScreen((screen) => ({ ...screen, components: [...screen.components, component] }))
      setSelectedId(component.id)
    },
    [activeScreen.components.length, updateActiveScreen],
  )

  const updateComponent = useCallback(
    (id: string, patch: Partial<StudioComponent>) => {
      updateActiveScreen((screen) => ({
        ...screen,
        components: screen.components.map((component) =>
          component.id === id ? { ...component, ...patch } : component,
        ),
      }))
    },
    [updateActiveScreen],
  )

  const deleteSelected = useCallback(() => {
    if (!selectedId) return
    updateActiveScreen((screen) => ({
      ...screen,
      components: screen.components.filter((component) => component.id !== selectedId),
    }))
    setSelectedId(null)
  }, [selectedId, updateActiveScreen])

  const duplicateSelected = useCallback(() => {
    if (!selected) return
    const duplicate = { ...selected, id: crypto.randomUUID(), x: selected.x + 12, y: selected.y + 12, name: `${selected.name}-copy` }
    updateActiveScreen((screen) => ({ ...screen, components: [...screen.components, duplicate] }))
    setSelectedId(duplicate.id)
  }, [selected, updateActiveScreen])

  const addScreen = useCallback(() => {
    const id = crypto.randomUUID()
    commit((current) => ({
      ...current,
      screens: [...current.screens, { id, name: `Pantalla ${current.screens.length + 1}`, background: '#0b0f14', components: [] }],
      activeScreenId: id,
    }))
    setSelectedId(null)
  }, [commit])

  const setActiveScreen = useCallback((id: string) => {
    commit((current) => ({ ...current, activeScreenId: id }))
    setSelectedId(null)
  }, [commit])

  const updateProject = useCallback((patch: Partial<StudioProject>) => {
    commit((current) => ({ ...current, ...patch }))
  }, [commit])

  const undo = useCallback(() => {
    setHistory((items) => {
      const previous = items.at(-1)
      if (!previous) return items
      setFuture((futureItems) => [project, ...futureItems])
      setProject(previous)
      return items.slice(0, -1)
    })
  }, [project])

  const redo = useCallback(() => {
    setFuture((items) => {
      const next = items[0]
      if (!next) return items
      setHistory((historyItems) => [...historyItems, project])
      setProject(next)
      return items.slice(1)
    })
  }, [project])

  const importProject = useCallback((next: StudioProject) => {
    setHistory((items) => [...items, project])
    setFuture([])
    setProject(next)
    setSelectedId(null)
  }, [project])

  return {
    project,
    activeScreen,
    selected,
    selectedId,
    canUndo: history.length > 0,
    canRedo: future.length > 0,
    setSelectedId,
    addComponent,
    updateComponent,
    deleteSelected,
    duplicateSelected,
    addScreen,
    setActiveScreen,
    updateProject,
    updateActiveScreen,
    undo,
    redo,
    importProject,
  }
}
