import type { TreeView } from '../types'
import { JsonViewerUnified } from './JsonViewerUnified'

interface TreeViewProps {
  tree: TreeView
  other?: TreeView | null
  onBackToInput: () => void
  onToggleTree?: () => void
}

export function TreeView({ tree, other, onBackToInput, onToggleTree }: TreeViewProps) {
  function copyToClipboard() {navigator.clipboard.writeText(tree.treeStructure).then(() => alert('JSON copied to clipboard!')).catch(() => alert('Failed to copy to clipboard'))}

  return (
    <div>
      <button onClick={onBackToInput} className="btn mb-8 flex items-center gap-2">Back to Builder</button>
      <div className="card-main mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <h3 className="heading-section">JSON Output</h3>
          <div className="flex flex-col sm:flex-row gap-3">
            {other && onToggleTree && (
              <button onClick={onToggleTree} className="btn flex items-center gap-2">
                {tree.isBalanced ? 'Switch to Sequential' : 'Switch to Balanced'}
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="card-main">
        <JsonViewerUnified jsonString={tree.treeStructure} onCopy={copyToClipboard} />
      </div>
      <div className="card-main">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <h2 className="text-3xl font-bold text-gray-800">{tree.treeName || `Tree #${tree.id}`}</h2>
          <div className="flex items-center gap-3 mt-2 sm:mt-0">
            <span className="px-4 py-2 text-sm font-medium rounded-full text-white" style={{ backgroundColor: 'var(--accent-color)' }}>
              {tree.isBalanced ? 'Balanced Tree' : 'Sequential Tree'}
            </span>
          </div>
        </div>
        <div className="grid-info">
          <div className="info-item">
            <span className="info-label">Input Numbers</span>
            <div className={tree.inputNumbers.length > 100 ? 'info-numbers' : 'info-value-mono'}>{tree.inputNumbers}</div>
          </div>
          <div className="info-item">
            <span className="info-label">Tree Type</span>
            <p className="info-value">{tree.isBalanced ? 'balanced bst' : 'sequential bst'}</p>
          </div>
          <div className="info-item">
            <span className="info-label">Created</span>
            <p className="info-value">{new Date(tree.createdAt).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
