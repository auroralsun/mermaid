import type { MermaidAST, NodeShape, FlowNodeData, FlowEdgeData } from '@/types'

function formatNodeShape(node: FlowNodeData): string {
  const { label, shape } = node
  switch (shape) {
    case 'rect': return `[${label}]`
    case 'rounded': return `(${label})`
    case 'stadium': return `([${label}])`
    case 'subroutine': return `[[${label}]]`
    case 'cylindrical': return `[(${label})]`
    case 'circle': return `((${label}))`
    case 'double_circle': return `(((${label})))`
    case 'rhombus': return `{${label}}`
    case 'hexagon': return `{{${label}}}`
    case 'parallelogram': return `[/${label}/]`
    case 'parallelogram_alt': return `[\\${label}\\/]`
    case 'trapezoid': return `[/${label}\\]`
    case 'trapezoid_alt': return `[\\${label}/]`
    case 'asymmetric': return `>${label}]`
    default: return `[${label}]`
  }
}

function formatEdge(edge: FlowEdgeData): string {
  let arrow: string
  switch (edge.style) {
    case 'thick': arrow = '==>'; break
    case 'dotted': arrow = '-.->'; break
    case 'dashed': arrow = '-->'; break
    default: arrow = '-->'
  }

  if (edge.label) {
    return `${arrow}|${edge.label}|`
  }
  return arrow
}

export function generateMermaid(ast: MermaidAST): string {
  const lines: string[] = []
  lines.push(`flowchart ${ast.direction}`)

  const usedNodeIds = new Set<string>()
  for (const edge of ast.edges) {
    usedNodeIds.add(edge.source)
    usedNodeIds.add(edge.target)
  }

  const orphanNodes = ast.nodes.filter(n => !usedNodeIds.has(n.id))

  for (const node of orphanNodes) {
    lines.push(`    ${node.id}${formatNodeShape(node)}`)
  }

  for (const edge of ast.edges) {
    const sourceNode = ast.nodes.find(n => n.id === edge.source)
    const targetNode = ast.nodes.find(n => n.id === edge.target)

    const sourceStr = sourceNode ? `${sourceNode.id}${formatNodeShape(sourceNode)}` : edge.source
    const targetStr = targetNode ? `${targetNode.id}${formatNodeShape(targetNode)}` : edge.target
    const edgeStr = formatEdge(edge)

    if (edge.label) {
      lines.push(`    ${sourceStr} ${edgeStr} ${targetStr}`)
    } else {
      lines.push(`    ${sourceStr} ${edgeStr} ${targetStr}`)
    }
  }

  return lines.join('\n')
}
