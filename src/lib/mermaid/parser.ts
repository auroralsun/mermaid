import type { MermaidAST, FlowNodeData, FlowEdgeData, NodeShape } from '@/types'

const SHAPE_PATTERNS: { regex: RegExp; shape: NodeShape }[] = [
  { regex: /^\(\(\((.+)\)\)\)$/, shape: 'double_circle' },
  { regex: /^\(\((.+)\)\)$/, shape: 'circle' },
  { regex: /^\[\[(.+)\]\]$/, shape: 'subroutine' },
  { regex: /^\[\((.+)\)\]$/, shape: 'cylindrical' },
  { regex: /^\{\{(.+)\}\}$/, shape: 'hexagon' },
  { regex: /^\[(.+)\]$/, shape: 'rect' },
  { regex: /^\((.+)\)$/, shape: 'rounded' },
  { regex: /^\{(.+)\}$/, shape: 'rhombus' },
  { regex: /^\[\/(.+)\/\]$/, shape: 'parallelogram' },
  { regex: /^\[\\(.+)\\\/\]$/, shape: 'parallelogram_alt' },
  { regex: /^\[\/(.+)\\\]$/, shape: 'trapezoid' },
  { regex: /^\[\\(.+)\/\]$/, shape: 'trapezoid_alt' },
  { regex: /^>(.+)]$/, shape: 'asymmetric' },
  { regex: /^\(\[(.+)\]\)$/, shape: 'stadium' },
]

function parseNodeToken(token: string): { id: string; label: string; shape: NodeShape } | null {
  token = token.trim()

  const idMatch = token.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*(.*)$/s)
  if (!idMatch) return null

  const id = idMatch[1]
  let rest = idMatch[2].trim()

  if (!rest) {
    return { id, label: id, shape: 'rect' }
  }

  for (const { regex, shape } of SHAPE_PATTERNS) {
    const m = rest.match(regex)
    if (m) {
      return { id, label: m[1].trim(), shape }
    }
  }

  return { id, label: rest, shape: 'rect' }
}

function parseEdgeStyle(arrow: string): FlowEdgeData['style'] {
  if (arrow.includes('==')) return 'thick'
  if (arrow.includes('-.->') || arrow.includes('-.-')) return 'dotted'
  if (arrow.includes('-->') || arrow.includes('---')) return 'solid'
  return 'solid'
}

export function parseMermaid(code: string): MermaidAST {
  const lines = code.split('\n').map(l => l.trim()).filter(Boolean)

  let direction: MermaidAST['direction'] = 'TD'
  const nodes: FlowNodeData[] = []
  const edges: FlowEdgeData[] = []
  const nodeMap = new Map<string, FlowNodeData>()

  function ensureNode(id: string, label?: string, shape?: NodeShape) {
    if (!nodeMap.has(id)) {
      const node: FlowNodeData = {
        id,
        label: label || id,
        shape: shape || 'rect',
      }
      nodeMap.set(id, node)
      nodes.push(node)
    }
  }

  for (const line of lines) {
    if (/^flowchart\s+/.test(line) || /^graph\s+/.test(line)) {
      const dirMatch = line.match(/(?:flowchart|graph)\s+(TB|TD|BT|LR|RL)/)
      if (dirMatch) {
        direction = dirMatch[1] as MermaidAST['direction']
      }
      continue
    }

    const edgePatterns = [
      /^(.+?)\s*(-->|---|-\.->|==>)\s*(?:\|([^|]*)\|\s*)?(.+)$/,
      /^(.+?)\s*(-->|---|-\.->|==>)\s*(.+)$/,
    ]

    let matched = false
    for (const pattern of edgePatterns) {
      const m = line.match(pattern)
      if (m) {
        const sourceToken = m[1].trim()
        const arrow = m[2]
        const label = m[3] ? m[3].trim() : ''
        const targetToken = m[4].trim()

        const sourceParsed = parseNodeToken(sourceToken)
        const targetParsed = parseNodeToken(targetToken)

        if (sourceParsed) ensureNode(sourceParsed.id, sourceParsed.label, sourceParsed.shape)
        if (targetParsed) ensureNode(targetParsed.id, targetParsed.label, targetParsed.shape)

        const sourceId = sourceParsed?.id || sourceToken
        const targetId = targetParsed?.id || targetToken

        edges.push({
          id: `e-${sourceId}-${targetId}-${edges.length}`,
          source: sourceId,
          target: targetId,
          label,
          style: parseEdgeStyle(arrow),
        })
        matched = true
        break
      }
    }

    if (!matched) {
      const nodeParsed = parseNodeToken(line)
      if (nodeParsed) {
        ensureNode(nodeParsed.id, nodeParsed.label, nodeParsed.shape)
      }
    }
  }

  return { direction, nodes, edges }
}
