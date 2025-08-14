import { useEffect } from 'react'
import type { TreeResult } from '../types'
import { TreeCard } from './TreeCard'

interface GalleryViewProps {
  trees: TreeResult[]
  onViewTree: (tree: TreeResult) => void
  onDeleteTree: (tree: TreeResult) => void
  onCreateFirst: () => void
  onLoadTrees: () => void
}

export function GalleryView({ trees, onViewTree, onDeleteTree, onCreateFirst, onLoadTrees }: GalleryViewProps) {
  useEffect(() => {onLoadTrees()}, [onLoadTrees])

  return (
    <div>
      {trees.length === 0 ? (
        <div className="card-main text-center">
          <h3 className="heading-section mb-4">
            no trees yet...
          </h3>
          <p className="text-base text-gray-600 mb-8">
            enter your data to see it appear here...
          </p>
          <button 
            onClick={onCreateFirst} 
            className="btn-large"
          >
            create your first binary search tree...
          </button>
        </div>
      ) : (
        <div className="grid-cards">
          {trees.map((tree) => (
            <TreeCard
              key={tree.id}
              tree={tree}
              onViewTree={onViewTree}
              onDeleteTree={onDeleteTree}
            />
          ))}
        </div>
      )}
    </div>
  )
}
