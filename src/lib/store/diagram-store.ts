import { create } from 'zustand'

const STORAGE_KEY = 'mermaid-editor-code'

const DEFAULT_CODE = `flowchart TD
    A[开始] --> B{条件判断}
    B -->|是| C[处理A]
    B -->|否| D[处理B]
    C --> E[结束]
    D --> E`

function loadCode(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) || DEFAULT_CODE
  } catch {
    return DEFAULT_CODE
  }
}

function saveCode(code: string) {
  try {
    localStorage.setItem(STORAGE_KEY, code)
  } catch {
    // ignore
  }
}

interface DiagramState {
  code: string
  isSyncing: boolean
  source: 'code' | 'graph'

  setCode: (code: string) => void
  setSource: (source: 'code' | 'graph') => void
  setIsSyncing: (v: boolean) => void
}

export const useDiagramStore = create<DiagramState>((set) => ({
  code: loadCode(),
  isSyncing: false,
  source: 'code',

  setCode: (code) => {
    set({ code })
    saveCode(code)
  },
  setSource: (source) => set({ source }),
  setIsSyncing: (v) => set({ isSyncing: v }),
}))
