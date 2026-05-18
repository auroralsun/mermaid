import Editor from '@monaco-editor/react'
import { useDiagramStore } from '@/lib/store/diagram-store'
import { useSettingsStore } from '@/lib/store/settings-store'

export default function CodeEditor() {
  const { code, setCode, setSource } = useDiagramStore()
  const theme = useSettingsStore(s => s.theme)

  const handleChange = (value: string | undefined) => {
    if (value !== undefined) {
      setSource('code')
      setCode(value)
    }
  }

  return (
    <div className="h-full flex flex-col bg-slate-950/30">
      <div className="flex-1 overflow-hidden rounded-b-[16px]">
        <Editor
          language="markdown"
          value={code}
          onChange={handleChange}
          theme={theme === 'dark' ? 'vs-dark' : 'vs'}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            automaticLayout: true,
            tabSize: 4,
            padding: { top: 12 },
            renderLineHighlight: 'line',
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
          }}
        />
      </div>
    </div>
  )
}
