import type { Node, Edge } from '@xyflow/react'
import type { MermaidAST, FlowNodeData, FlowEdgeData, NodeShape } from '@/types'
import { getThemeConfig, type MermaidThemeConfig } from './themes'

function getShapeClipPath(shape: NodeShape): string {
  switch (shape) {
    case 'rhombus':
      return 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'
    case 'hexagon':
      return 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)'
    case 'parallelogram':
      return 'polygon(20% 0%, 100% 0%, 80% 100%, 0% 100%)'
    case 'parallelogram_alt':
      return 'polygon(0% 0%, 80% 0%, 100% 100%, 20% 100%)'
    case 'trapezoid':
      return 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)'
    case 'trapezoid_alt':
      return 'polygon(0% 0%, 100% 0%, 80% 100%, 20% 100%)'
    default:
      return 'none'
  }
}

export function astToReactFlow(ast: MermaidAST, theme?: string): { nodes: Node[]; edges: Edge[] } {
  const config: MermaidThemeConfig = getThemeConfig(theme || 'default')
  const isHorizontal = ast.direction === 'LR' || ast.direction === 'RL'
  const nodeCount = ast.nodes.length

  const nodes: Node[] = ast.nodes.map((node, index) => {
    let x: number, y: number

    if (isHorizontal) {
      x = index * 220
      y = 200
    } else {
      const cols = Math.ceil(Math.sqrt(nodeCount))
      x = (index % cols) * 250
      y = Math.floor(index / cols) * 150
    }

    const style = config.nodeColors[node.shape] || config.nodeColors.rect
    const clipPath = getShapeClipPath(node.shape)

    return {
      id: node.id,
      position: { x, y },
      data: { label: node.label, shape: node.shape },
      style: {
        background: style.background,
        border: style.border,
        borderRadius: style.borderRadius,
        color: '#fff',
        padding: '10px 20px',
        fontSize: '14px',
        fontWeight: 500,
        minWidth: '100px',
        textAlign: 'center' as const,
        clipPath: clipPath !== 'none' ? clipPath : undefined,
      },
      type: 'default',
    }
  })

  const edges: Edge[] = ast.edges.map((edge) => {
    let animated = false
    const edgeStyle: Record<string, string | number> = { stroke: config.edgeColor, strokeWidth: 2 }

    switch (edge.style) {
      case 'thick':
        edgeStyle.stroke = config.edgeColor
        edgeStyle.strokeWidth = 3
        break
      case 'dotted':
        edgeStyle.strokeDasharray = '5,5'
        break
      case 'dashed':
        edgeStyle.strokeDasharray = '10,5'
        animated = true
        break
    }

    return {
      id: edge.id,
      source: edge.source,
      target: edge.target,
      label: edge.label || undefined,
      type: 'default',
      animated,
      style: edgeStyle as React.CSSProperties,
      labelStyle: { fill: config.edgeLabelColor, fontWeight: 500, fontSize: 12 },
      labelBgStyle: { fill: config.edgeLabelBg, fillOpacity: 0.9 },
      labelBgPadding: [6, 3] as [number, number],
      labelBgBorderRadius: 4,
    }
  })

  return { nodes, edges }
}

export function reactFlowToAST(
  nodes: Node[],
  edges: Edge[],
  currentAST: MermaidAST
): MermaidAST {
  const updatedNodes: FlowNodeData[] = nodes.map((node) => ({
    id: node.id,
    label: (node.data?.label as string) || node.id,
    shape: (node.data?.shape as NodeShape) || 'rect',
  }))

  const updatedEdges: FlowEdgeData[] = edges.map((edge, index) => ({
    id: edge.id || `e-${edge.source}-${edge.target}-${index}`,
    source: edge.source,
    target: edge.target,
    label: (edge.label as string) || '',
    style: ((): FlowEdgeData['style'] => {
      const sw = edge.style?.strokeWidth
      const sd = edge.style?.strokeDasharray
      if (sw === 3 || sw === '3') return 'thick'
      if (sd === '5,5') return 'dotted'
      if (sd === '10,5') return 'dashed'
      return 'solid'
    })(),
  }))

  return {
    direction: currentAST.direction,
    nodes: updatedNodes,
    edges: updatedEdges,
  }
}
