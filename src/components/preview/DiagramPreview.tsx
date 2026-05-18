import { useCallback, useEffect, useRef, useState } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type OnNodesChange,
  type OnConnect,
  addEdge,
  BackgroundVariant,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useDiagramStore } from '@/lib/store/diagram-store'
import { useSettingsStore } from '@/lib/store/settings-store'
import { parseMermaid } from '@/lib/mermaid/parser'
import { generateMermaid } from '@/lib/mermaid/generator'
import { astToReactFlow, reactFlowToAST } from '@/lib/mermaid/transformer'
import { getThemeConfig } from '@/lib/mermaid/themes'

function InlineNodeEditor({ node, position, onClose, onSave }: {
  node: Node
  position: { x: number; y: number }
  onClose: () => void
  onSave: (label: string) => void
}) {
  const [value, setValue] = useState((node.data?.label as string) || '')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
    inputRef.current?.select()
  }, [])

  return (
    <div
      className="absolute z-30 bg-gray-800 border border-gray-600 rounded-lg shadow-2xl p-2 flex gap-1.5"
      style={{ left: position.x, top: position.y, transform: 'translate(-50%, -100%) translateY(-8px)' }}
    >
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onSave(value)
          if (e.key === 'Escape') onClose()
        }}
        onBlur={() => onSave(value)}
        className="w-40 px-2 py-1 text-xs bg-gray-700 border border-gray-600 rounded text-gray-200 outline-none focus:border-blue-500"
        placeholder="节点文本"
      />
    </div>
  )
}

export default function DiagramPreview() {
  const { code, setCode, setSource, source, setIsSyncing } = useDiagramStore()
  const { theme, mermaidTheme } = useSettingsStore()
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])
  const [error, setError] = useState<string | null>(null)
  const [editingNode, setEditingNode] = useState<{ node: Node; position: { x: number; y: number } } | null>(null)
  const lastCodeRef = useRef(code)

  const themeConfig = getThemeConfig(mermaidTheme)

  // Re-render when mermaidTheme changes
  useEffect(() => {
    try {
      const ast = parseMermaid(code)
      const { nodes: rfNodes, edges: rfEdges } = astToReactFlow(ast, mermaidTheme)
      setNodes(rfNodes)
      setEdges(rfEdges)
      setError(null)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '解析错误')
    }
  }, [mermaidTheme])

  useEffect(() => {
    if (source === 'graph') return
    if (code === lastCodeRef.current) return

    lastCodeRef.current = code
    try {
      const ast = parseMermaid(code)
      const { nodes: rfNodes, edges: rfEdges } = astToReactFlow(ast, mermaidTheme)
      setNodes(rfNodes)
      setEdges(rfEdges)
      setError(null)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '解析错误')
    }
  }, [code, source, setNodes, setEdges, mermaidTheme])

  useEffect(() => {
    try {
      const ast = parseMermaid(code)
      const { nodes: rfNodes, edges: rfEdges } = astToReactFlow(ast, mermaidTheme)
      setNodes(rfNodes)
      setEdges(rfEdges)
      setError(null)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '解析错误')
    }
  }, [])

  const syncGraphToCode = useCallback((updatedNodes: Node[], updatedEdges: Edge[]) => {
    setSource('graph')
    setIsSyncing(true)
    try {
      const currentAST = parseMermaid(code)
      const updatedAST = reactFlowToAST(updatedNodes, updatedEdges, currentAST)
      const newCode = generateMermaid(updatedAST)
      lastCodeRef.current = newCode
      setCode(newCode)
    } catch {
      // ignore
    }
    setIsSyncing(false)
  }, [code, setCode, setSource, setIsSyncing])

  const handleNodesChange: OnNodesChange<Node> = useCallback(
    (changes) => {
      onNodesChange(changes)

      const hasPositionChange = changes.some(c => c.type === 'position' && c.dragging === false)
      if (hasPositionChange) {
        setTimeout(() => {
          syncGraphToCode(nodes, edges)
        }, 100)
      }
    },
    [onNodesChange, nodes, edges, syncGraphToCode]
  )

  const handleConnect: OnConnect = useCallback(
    (connection) => {
      const newEdge: Edge = {
        id: `e-${connection.source}-${connection.target}-${edges.length}`,
        source: connection.source!,
        target: connection.target!,
        animated: true,
        style: { stroke: themeConfig.edgeColor, strokeWidth: 2 },
      }
      setEdges((eds) => addEdge({ ...connection, animated: true, style: { stroke: themeConfig.edgeColor, strokeWidth: 2 } }, eds))
      setTimeout(() => {
        syncGraphToCode(nodes, [...edges, newEdge])
      }, 50)
    },
    [setEdges, nodes, edges, syncGraphToCode, themeConfig.edgeColor]
  )

  const handleNodeDoubleClick = useCallback((event: React.MouseEvent, node: Node) => {
    event.stopPropagation()
    const target = event.currentTarget as HTMLElement
    const rect = target.getBoundingClientRect()
    const parentRect = target.closest('.react-flow')?.getBoundingClientRect() || rect
    setEditingNode({
      node,
      position: {
        x: rect.left - parentRect.left + rect.width / 2,
        y: rect.top - parentRect.top,
      },
    })
  }, [])

  const handleSaveNodeLabel = useCallback((label: string) => {
    if (!editingNode) return
    const nodeId = editingNode.node.id
    setEditingNode(null)

    if (!label || label === editingNode.node.data?.label) return

    setNodes((nds) =>
      nds.map((n) =>
        n.id === nodeId ? { ...n, data: { ...n.data, label } } : n
      )
    )

    setTimeout(() => {
      setSource('graph')
      setIsSyncing(true)
      try {
        const currentAST = parseMermaid(code)
        const updatedNodes = nodes.map((n) =>
          n.id === nodeId ? { ...n, data: { ...n.data, label } } : n
        )
        const updatedAST = reactFlowToAST(updatedNodes, edges, currentAST)
        const newCode = generateMermaid(updatedAST)
        lastCodeRef.current = newCode
        setCode(newCode)
      } catch {
        // ignore
      }
      setIsSyncing(false)
    }, 50)
  }, [editingNode, setNodes, nodes, edges, code, setCode, setSource, setIsSyncing])

  const minimapNodeColor = useCallback((node: Node) => {
    const shape = node.data?.shape as string
    const color = themeConfig.nodeColors[shape as keyof typeof themeConfig.nodeColors]
    return color?.background || '#6b7280'
  }, [themeConfig])

  if (error) {
    return (
      <div className="flex h-full items-center justify-center bg-slate-950/20 px-6">
        <div className="panel-elevated max-w-md px-6 py-5 text-center">
          <div className="mb-2 text-sm text-red-400">⚠ 语法错误</div>
          <div className="text-xs leading-6 text-slate-400">{error}</div>
        </div>
      </div>
    )
  }

  const isDark = theme === 'dark'

  return (
    <div className={`relative h-full overflow-hidden rounded-b-[16px] ${isDark ? 'bg-slate-950/20' : 'bg-slate-100'}`}>
      {isDark && <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(91,140,255,0.08),transparent_28%)] pointer-events-none" />}
      <div className="relative h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={handleNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={handleConnect}
          onNodeDoubleClick={handleNodeDoubleClick}
          fitView
          colorMode={isDark ? 'dark' : 'light'}
          deleteKeyCode={['Backspace', 'Delete']}
          proOptions={{ hideAttribution: true }}
        >
          <Background variant={BackgroundVariant.Dots} gap={16} size={1} color={isDark ? '#374151' : '#94a3b8'} />
          <Controls position="bottom-right" />
          <MiniMap nodeColor={minimapNodeColor} maskColor={isDark ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.7)'} position="bottom-left" />
        </ReactFlow>

        {editingNode && (
          <InlineNodeEditor
            node={editingNode.node}
            position={editingNode.position}
            onClose={() => setEditingNode(null)}
            onSave={handleSaveNodeLabel}
          />
        )}
      </div>
    </div>
  )
}
