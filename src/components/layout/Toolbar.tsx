import { useSettingsStore } from '@/lib/store/settings-store'

export default function Toolbar() {
  const { theme, toggleTheme, mermaidTheme, setMermaidTheme } = useSettingsStore()

  return (
    <header className="h-14 shrink-0 border-b border-white/10 bg-slate-950/70 px-4 backdrop-blur-xl">
      <div className="flex h-full items-center gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 text-blue-200 shadow-[0_6px_18px_rgba(91,140,255,0.18)]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h10M4 18h7" strokeLinecap="round" />
              <circle cx="18" cy="12" r="3" />
            </svg>
          </div>

          <div className="min-w-0 select-none">
            <div className="truncate text-sm font-semibold text-slate-100">Mermaid 流程图编辑器</div>
            <div className="text-[11px] text-slate-400">输入代码 · 实时预览流程图</div>
          </div>
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-2">
          <label className="toolbar-button toolbar-button-secondary cursor-pointer px-3">
            <span className="hidden text-slate-400 sm:inline">流程图配色</span>
            <select
              value={mermaidTheme}
              onChange={(e) => setMermaidTheme(e.target.value as 'default' | 'dark' | 'forest' | 'neutral')}
              className="bg-transparent text-xs text-slate-200 outline-none"
            >
              <option value="default">默认</option>
              <option value="dark">深色</option>
              <option value="forest">森林</option>
              <option value="neutral">中性</option>
            </select>
          </label>

          <button
            onClick={toggleTheme}
            className="toolbar-icon-button"
            title="切换亮/暗主题"
          >
            {theme === 'dark' ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
