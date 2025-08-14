import type { TreeResult } from '../types'

interface TreeCardProps {
  tree: TreeResult
  onViewTree: (tree: TreeResult) => void
  onDeleteTree: (tree: TreeResult) => void
}

export function TreeCard({ tree, onViewTree, onDeleteTree }: TreeCardProps) {
  function handleViewClick(event: React.MouseEvent) {event.stopPropagation(); onViewTree(tree)}
  function handleDeleteClick(event: React.MouseEvent) {event.stopPropagation(); onDeleteTree(tree)}
  function formatCreatedDate() {return new Date(tree.createdAt).toLocaleString()}

  return (
    <div className="card-compact hover:bg-gray-50 transition-colors duration-200">
      <div className="flex-between mb-4">
        <h4 className="heading-card">{tree.treeName || `Tree ${tree.id}`}</h4>
        <span className="px-3 py-1 text-white text-xs font-medium rounded-full" style={{ backgroundColor: 'var(--accent-color)' }}>Both Types</span>
      </div>
      <div className="mb-4">
        <span className="info-label">Numbers</span>
        <p className="info-numbers-compact" title={tree.inputNumbers}>{tree.inputNumbers}</p>
      </div>
      <div className="mb-6">
        <span className="info-label">Created at</span>
        <p className="text-sm text-gray-800 mt-1 mb-0">{formatCreatedDate()}</p>
      </div>
      <div className="flex gap-2">
        <button onClick={handleViewClick} className="flex-1 btn">View Tree</button>
        <button onClick={handleDeleteClick} className="btn-delete" title="Delete tree">Delete</button>
      </div>
    </div>
  )
}
