import { useEffect } from 'react'
import { ReactFlowProvider } from '@xyflow/react'
import AppLayout from '@/components/layout/AppLayout'
import { useSettingsStore } from '@/lib/store/settings-store'

export default function App() {
  const theme = useSettingsStore(s => s.theme)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return (
    <ReactFlowProvider>
      <AppLayout />
    </ReactFlowProvider>
  )
}
