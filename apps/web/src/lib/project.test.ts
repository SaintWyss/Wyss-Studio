import { describe, expect, it } from 'vitest'
import { createComponent, createInitialProject } from './project'

describe('project factory', () => {
  it('creates a valid initial project for Wyss Home', () => {
    const project = createInitialProject()
    expect(project.schemaVersion).toBe('1.0.0')
    expect(project.device.target).toBe('esp32')
    expect(project.screens.some((screen) => screen.id === project.activeScreenId)).toBe(true)
  })

  it('creates independent components with no action by default', () => {
    const first = createComponent('button', 0)
    const second = createComponent('button', 1)
    expect(first.id).not.toBe(second.id)
    expect(first.action.type).toBe('none')
  })
})
