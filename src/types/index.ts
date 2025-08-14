export interface TreeResult {
  id: number
  treeName: string
  inputNumbers: string
  sequentialTree: string
  balancedTree: string
  createdAt: string
}

export interface TreeView extends TreeResult {
  treeStructure: string
  isBalanced: boolean
}

export type ViewType = 'input' | 'view' | 'previous'
