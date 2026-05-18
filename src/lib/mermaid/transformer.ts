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

interface LayoutResult {
  x: number
  y: number
}

function layoutNodes(ast: MermaidAST): Map<string, LayoutResult> {
  const { nodes, edges, direction } = ast
  const isHorizontal = direction === 'LR' || direction === 'RL'

  // Build adjacency and in-degree
  const children = new Map<string, string[]>()
  const inDegree = new Map<string, number>()
  const nodeIds = new Set(nodes.map(n => n.id))

  for (const id of nodeIds) {
    children.set(id, [])
    inDegree.set(id, 0)
  }

  for (const edge of edges) {
    if (nodeIds.has(edge.source) && nodeIds.has(edge.target)) {
      children.get(edge.source)!.push(edge.target)
      inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1)
    }
  }

  // Find root nodes (no incoming edges), fallback to first node
  const roots = nodes.filter(n => (inDegree.get(n.id) || 0) === 0).map(n => n.id)
  if (roots.length === 0 && nodes.length > 0) {
    roots.push(nodes[0].id)
  }

  // BFS to assign layers (longest path to avoid compressing chains)
  const layer = new Map<string, number>()
  const queue: string[] = [...roots]
  for (const id of roots) layer.set(id, 0)

  // Topological BFS
  const visited = new Set<string>(roots)
  while (queue.length > 0) {
    const current = queue.shift()!
    const currentLayer = layer.get(current)!
    for (const child of children.get(current) || []) {
      const newLayer = currentLayer + 1
      // Take the maximum layer (longest path) to handle merge nodes correctly
      if (!layer.has(child) || newLayer > layer.get(child)!) {
        layer.set(child, newLayer)
      }
      if (!visited.has(child)) {
        visited.add(child)
        queue.push(child)
      }
    }
  }

  // Handle disconnected nodes (no edges at all)
  let maxLayer = 0
  for (const l of layer.values()) if (l > maxLayer) maxLayer = l
  for (const node of nodes) {
    if (!layer.has(node.id)) {
      maxLayer++
      layer.set(node.id, maxLayer)
    }
  }

  // Group nodes by layer
  const layerGroups = new Map<number, string[]>()
  for (const [id, l] of layer) {
    if (!layerGroups.has(l)) layerGroups.set(l, [])
    layerGroups.get(l)!.push(id)
  }

  // Sort nodes within each layer to minimize edge crossings
  // Use barycenter heuristic: position node based on average position of its parents/children
  const sortedLayers = [...layerGroups.keys()].sort((a, b) => a - b)

  // First pass: assign initial order based on AST order within each layer
  const nodeOrder = new Map<string, number>()
  for (const l of sortedLayers) {
    const group = layerGroups.get(l)!
    // Sort by the order they appear in the AST (stable, predictable)
    const nodeIndex = new Map(nodes.map((n, i) => [n.id, i]))
    group.sort((a, b) => (nodeIndex.get(a) || 0) - (nodeIndex.get(b) || 0))
    group.forEach((id, i) => nodeOrder.set(id, i))
  }

  // Barycenter refinement: 2 passes to reduce crossings
  for (let pass = 0; pass < 2; pass++) {
    for (let li = 1; li < sortedLayers.length; li++) {
      const group = layerGroups.get(sortedLayers[li])!
      const prevGroup = layerGroups.get(sortedLayers[li - 1])!
      const prevPositions = new Map(prevGroup.map((id, i) => [id, i]))

      const barycenters = new Map<string, number>()
      for (const id of group) {
        // Find parents in previous layer
        const parents: number[] = []
        for (const edge of edges) {
          if (edge.target === id && prevPositions.has(edge.source)) {
            parents.push(prevPositions.get(edge.source)!)
          }
        }
        if (parents.length > 0) {
          barycenters.set(id, parents.reduce((a, b) => a + b, 0) / parents.length)
        } else {
          barycenters.set(id, nodeOrder.get(id) || 0)
        }
      }

      group.sort((a, b) => (barycenters.get(a) || 0) - (barycenters.get(b) || 0))
      group.forEach((id, i) => nodeOrder.set(id, i))
    }
  }

  // Calculate final coordinates
  const LAYER_GAP = 150
  const NODE_GAP = 250
  const positions = new Map<string, LayoutResult>()

  for (const l of sortedLayers) {
    const group = layerGroups.get(l)!
    const layerWidth = (group.length - 1) * NODE_GAP

    group.forEach((id, i) => {
      const pos = i * NODE_GAP - layerWidth / 2

      if (isHorizontal) {
        positions.set(id, { x: l * LAYER_GAP, y: pos })
      } else {
        positions.set(id, { x: pos, y: l * LAYER_GAP })
      }
    })
  }

  return positions
}

export function astToReactFlow(ast: MermaidAST, theme?: string): { nodes: Node[]; edges: Edge[] } {
  const config: MermaidThemeConfig = getThemeConfig(theme || 'default')
  const positions = layoutNodes(ast)

  const nodes: Node[] = ast.nodes.map((node) => {
    const pos = positions.get(node.id) || { x: 0, y: 0 }
    const style = config.nodeColors[node.shape] || config.nodeColors.rect
    const clipPath = getShapeClipPath(node.shape)

    return {
      id: node.id,
      position: { x: pos.x, y: pos.y },
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
