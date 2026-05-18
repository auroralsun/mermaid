import type { NodeShape } from '@/types'

export interface ThemeNodeStyle {
  background: string
  border: string
  borderRadius: string
}

export interface MermaidThemeConfig {
  nodeColors: Record<NodeShape, ThemeNodeStyle>
  edgeColor: string
  edgeLabelColor: string
  edgeLabelBg: string
}

const defaultTheme: MermaidThemeConfig = {
  nodeColors: {
    rect:            { background: '#3b82f6', border: '2px solid #2563eb', borderRadius: '4px' },
    rounded:         { background: '#8b5cf6', border: '2px solid #7c3aed', borderRadius: '16px' },
    stadium:         { background: '#06b6d4', border: '2px solid #0891b2', borderRadius: '32px' },
    subroutine:      { background: '#f59e0b', border: '2px solid #d97706', borderRadius: '4px' },
    cylindrical:     { background: '#10b981', border: '2px solid #059669', borderRadius: '4px' },
    circle:          { background: '#ec4899', border: '2px solid #db2777', borderRadius: '50%' },
    double_circle:   { background: '#ec4899', border: '3px double #db2777', borderRadius: '50%' },
    rhombus:         { background: '#f97316', border: '2px solid #ea580c', borderRadius: '4px' },
    hexagon:         { background: '#6366f1', border: '2px solid #4f46e5', borderRadius: '4px' },
    parallelogram:   { background: '#14b8a6', border: '2px solid #0d9488', borderRadius: '4px' },
    parallelogram_alt: { background: '#14b8a6', border: '2px solid #0d9488', borderRadius: '4px' },
    trapezoid:       { background: '#a855f7', border: '2px solid #9333ea', borderRadius: '4px' },
    trapezoid_alt:   { background: '#a855f7', border: '2px solid #9333ea', borderRadius: '4px' },
    asymmetric:      { background: '#ef4444', border: '2px solid #dc2626', borderRadius: '4px' },
  },
  edgeColor: '#6b7280',
  edgeLabelColor: '#e5e7eb',
  edgeLabelBg: '#1f2937',
}

const darkTheme: MermaidThemeConfig = {
  nodeColors: {
    rect:            { background: '#1e3a5f', border: '2px solid #2563eb', borderRadius: '4px' },
    rounded:         { background: '#3b1f6e', border: '2px solid #7c3aed', borderRadius: '16px' },
    stadium:         { background: '#0e4d5c', border: '2px solid #0891b2', borderRadius: '32px' },
    subroutine:      { background: '#5c3d0e', border: '2px solid #d97706', borderRadius: '4px' },
    cylindrical:     { background: '#0e4d3a', border: '2px solid #059669', borderRadius: '4px' },
    circle:          { background: '#5c1e3d', border: '2px solid #db2777', borderRadius: '50%' },
    double_circle:   { background: '#5c1e3d', border: '3px double #db2777', borderRadius: '50%' },
    rhombus:         { background: '#5c2d0e', border: '2px solid #ea580c', borderRadius: '4px' },
    hexagon:         { background: '#2d1f6e', border: '2px solid #4f46e5', borderRadius: '4px' },
    parallelogram:   { background: '#0e4d44', border: '2px solid #0d9488', borderRadius: '4px' },
    parallelogram_alt: { background: '#0e4d44', border: '2px solid #0d9488', borderRadius: '4px' },
    trapezoid:       { background: '#3d1f6e', border: '2px solid #9333ea', borderRadius: '4px' },
    trapezoid_alt:   { background: '#3d1f6e', border: '2px solid #9333ea', borderRadius: '4px' },
    asymmetric:      { background: '#5c1e1e', border: '2px solid #dc2626', borderRadius: '4px' },
  },
  edgeColor: '#475569',
  edgeLabelColor: '#cbd5e1',
  edgeLabelBg: '#1e293b',
}

const forestTheme: MermaidThemeConfig = {
  nodeColors: {
    rect:            { background: '#166534', border: '2px solid #15803d', borderRadius: '4px' },
    rounded:         { background: '#365314', border: '2px solid #4d7c0f', borderRadius: '16px' },
    stadium:         { background: '#14532d', border: '2px solid #16a34a', borderRadius: '32px' },
    subroutine:      { background: '#713f12', border: '2px solid #a16207', borderRadius: '4px' },
    cylindrical:     { background: '#1e3a3a', border: '2px solid #0f766e', borderRadius: '4px' },
    circle:          { background: '#365314', border: '2px solid #65a30d', borderRadius: '50%' },
    double_circle:   { background: '#365314', border: '3px double #65a30d', borderRadius: '50%' },
    rhombus:         { background: '#854d0e', border: '2px solid #ca8a04', borderRadius: '4px' },
    hexagon:         { background: '#1a3a2a', border: '2px solid #059669', borderRadius: '4px' },
    parallelogram:   { background: '#14532d', border: '2px solid #15803d', borderRadius: '4px' },
    parallelogram_alt: { background: '#14532d', border: '2px solid #15803d', borderRadius: '4px' },
    trapezoid:       { background: '#3f1f1f', border: '2px solid #7c2d12', borderRadius: '4px' },
    trapezoid_alt:   { background: '#3f1f1f', border: '2px solid #7c2d12', borderRadius: '4px' },
    asymmetric:      { background: '#4a1f1f', border: '2px solid #b91c1c', borderRadius: '4px' },
  },
  edgeColor: '#4d7c0f',
  edgeLabelColor: '#d9f99d',
  edgeLabelBg: '#1a2e0a',
}

const neutralTheme: MermaidThemeConfig = {
  nodeColors: {
    rect:            { background: '#374151', border: '2px solid #4b5563', borderRadius: '4px' },
    rounded:         { background: '#3f3f46', border: '2px solid #52525b', borderRadius: '16px' },
    stadium:         { background: '#44403c', border: '2px solid #57534e', borderRadius: '32px' },
    subroutine:      { background: '#374151', border: '2px solid #6b7280', borderRadius: '4px' },
    cylindrical:     { background: '#3f3f46', border: '2px solid #71717a', borderRadius: '4px' },
    circle:          { background: '#44403c', border: '2px solid #78716c', borderRadius: '50%' },
    double_circle:   { background: '#44403c', border: '3px double #78716c', borderRadius: '50%' },
    rhombus:         { background: '#374151', border: '2px solid #6b7280', borderRadius: '4px' },
    hexagon:         { background: '#3f3f46', border: '2px solid #71717a', borderRadius: '4px' },
    parallelogram:   { background: '#44403c', border: '2px solid #57534e', borderRadius: '4px' },
    parallelogram_alt: { background: '#44403c', border: '2px solid #57534e', borderRadius: '4px' },
    trapezoid:       { background: '#374151', border: '2px solid #4b5563', borderRadius: '4px' },
    trapezoid_alt:   { background: '#374151', border: '2px solid #4b5563', borderRadius: '4px' },
    asymmetric:      { background: '#3f3f46', border: '2px solid #52525b', borderRadius: '4px' },
  },
  edgeColor: '#6b7280',
  edgeLabelColor: '#d1d5db',
  edgeLabelBg: '#1f2937',
}

export const MERMAID_THEMES: Record<string, MermaidThemeConfig> = {
  default: defaultTheme,
  dark: darkTheme,
  forest: forestTheme,
  neutral: neutralTheme,
}

export function getThemeConfig(theme: string): MermaidThemeConfig {
  return MERMAID_THEMES[theme] || defaultTheme
}
