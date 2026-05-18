import Toolbar from './Toolbar'
import CodeEditor from '@/components/editor/CodeEditor'
import DiagramPreview from '@/components/preview/DiagramPreview'

export default function AppLayout() {
  return (
    <div className="app-shell flex h-full flex-col">
      <Toolbar />
      <div className="flex flex-1 overflow-hidden p-3">
        <div className="flex h-full w-full gap-3">
          <section className="panel flex w-[42%] min-w-[380px] flex-col overflow-hidden">
            <div className="flex h-11 items-center justify-between border-b border-white/10 px-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Editor</div>
                <div className="mt-1 text-[11px] text-slate-500">Mermaid 源码</div>
              </div>
              <div className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] text-slate-400">
                实时同步
              </div>
            </div>
            <div className="min-h-0 flex-1 overflow-hidden rounded-b-[16px]">
              <CodeEditor />
            </div>
          </section>

          <section className="panel relative flex min-w-0 flex-1 flex-col overflow-hidden">
            <div className="flex h-11 items-center justify-between border-b border-white/10 px-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Canvas</div>
                <div className="mt-1 text-[11px] text-slate-500">可视化画布</div>
              </div>
              <div className="text-[11px] text-slate-500">双击节点编辑 · 拖拽连线</div>
            </div>
            <div className="relative min-h-0 flex-1 overflow-hidden rounded-b-[16px] bg-[radial-gradient(circle_at_top,rgba(91,140,255,0.08),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0))]">
              <DiagramPreview />
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
