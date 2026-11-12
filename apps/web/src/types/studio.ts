export type ComponentType = 'text' | 'button' | 'switch' | 'card' | 'status' | 'progress'

export type DeviceProfile = {
  id: string
  name: string
  width: number
  height: number
  target: 'esp32' | 'mobile' | 'desktop'
}

export type ComponentAction = {
  type: 'none' | 'navigate' | 'wyss.command'
  value?: string
}

export type StudioComponent = {
  id: string
  type: ComponentType
  name: string
  x: number
  y: number
  width: number
  height: number
  text: string
  background: string
  color: string
  borderRadius: number
  fontSize: number
  value?: number | boolean | string
  action: ComponentAction
}

export type StudioScreen = {
  id: string
  name: string
  background: string
  components: StudioComponent[]
}

export type StudioProject = {
  id: string
  name: string
  schemaVersion: '1.0.0'
  device: DeviceProfile
  screens: StudioScreen[]
  activeScreenId: string
  updatedAt: string
}

export const DEVICE_PROFILES: DeviceProfile[] = [
  { id: 'esp32-320x480', name: 'Wyss Home · 320×480', width: 320, height: 480, target: 'esp32' },
  { id: 'mobile-390x844', name: 'Wyss Mobile · 390×844', width: 390, height: 844, target: 'mobile' },
  { id: 'desktop-1280x720', name: 'Wyss Desktop · 1280×720', width: 1280, height: 720, target: 'desktop' },
]
