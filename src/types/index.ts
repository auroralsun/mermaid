export interface DiagramData {
  id: string
  name: string
  code: string
  createdAt: string
  updatedAt: string
}

export type NodeShape = 'rect' | 'rounded' | 'stadium' | 'subroutine' | 'cylindrical' | 'circle' | 'asymmetric' | 'rhombus' | 'hexagon' | 'parallelogram' | 'parallelogram_alt' | 'trapezoid' | 'trapezoid_alt' | 'double_circle'

export interface FlowNodeData {
  id: string
  label: string
  shape: NodeShape
}

export interface FlowEdgeData {
  id: string
  source: string
  target: string
  label: string
  style: 'solid' | 'dashed' | 'dotted' | 'thick'
}

export interface MermaidAST {
  direction: 'TB' | 'TD' | 'BT' | 'LR' | 'RL'
  nodes: FlowNodeData[]
  edges: FlowEdgeData[]
}
