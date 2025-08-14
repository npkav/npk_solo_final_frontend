import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom'
import type { TreeResult, TreeView } from './types'
import { Header } from './components/Header'
import { InputView } from './components/InputView'
import { TreeView as TreeDisplayView } from './components/TreeView'
import { GalleryView } from './components/GalleryView'
import { buildApiUrl, config } from './utils/config'

function createTreeView(treeResult: TreeResult, isBalanced: boolean): TreeView {return {...treeResult, treeStructure: isBalanced ? treeResult.balancedTree : treeResult.sequentialTree, isBalanced}}

function App() {
  return (
    <Router>
      <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-color)' }}>
        <AppContent />
      </div>
    </Router>
  )
}

function AppContent() {
  const navigate = useNavigate()
  // form state
  const [formData, setFormData] = useState({numbers: '', treeName: ''})
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentTree, setCurrentTree] = useState<TreeView | null>(null)
  const [otherTree, setOtherTree] = useState<TreeView | null>(null)
  const [previousTrees, setPreviousTrees] = useState<TreeResult[]>([])

  useEffect(() => {
    if (error && (formData.numbers.trim() || formData.treeName.trim())) {setError(null)}
  }, [formData.numbers, formData.treeName, error])



  const updateFormData = (field: 'numbers' | 'treeName', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (error) {setError(null)}
    if (loading) {setLoading(false)}
  }



  // create trees
  const createTree = async () => {
    if (!formData.numbers.trim()) {setError('PLEASE ENTER SOME NUMBERS'); return}
    if (!formData.treeName.trim()) {setError('PLEASE ENTER A TREE NAME'); return}
    setError(null)
    setLoading(true)
    
    try {
      const numberArray = formData.numbers.split(',').map(num => parseInt(num.trim())).filter(num => !isNaN(num))
      if (numberArray.length === 0) {setError('PLEASE ENTER VALID NUMBERS'); setLoading(false); return}
      const response = await fetch(buildApiUrl(config.API_ENDPOINTS.CREATE_TREES), {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ numbers: numberArray, treeName: formData.treeName.trim() })
      })
      
      if (response.ok) {
        const treeResult = await response.json()
        const sequentialTree = createTreeView(treeResult, false)
        const balancedTree = createTreeView(treeResult, true)
        setCurrentTree(sequentialTree)
        setOtherTree(balancedTree)
        setFormData({ numbers: '', treeName: '' })
        setLoading(false)
        navigate(`/trees/${treeResult.id}`)
      } else {setError('FAILED TO CREATE TREES'); setLoading(false)}
    } catch (error) {setError('ERROR CREATING TREES'); setLoading(false)}
  }

  // load prev trees
  const loadPreviousTrees = async () => {
    try {
      const response = await fetch(buildApiUrl(config.API_ENDPOINTS.GET_PREVIOUS_TREES))
      if (response.ok) {
        const trees = await response.json()
        setPreviousTrees(trees)
      } else {setError('FAILED TO LOAD TREES')}
    } catch (error) {setError('ERROR LOADING TREES')}
  }

  // view tree
  const viewTree = (treeData: TreeResult) => {
    try {
      const sequentialTree = createTreeView(treeData, false)
      const balancedTree = createTreeView(treeData, true)
      setCurrentTree(sequentialTree)
      setOtherTree(balancedTree)
      navigate(`/trees/${treeData.id}`)
    } catch (error) {setError('ERROR VIEWING TREE')}
  }

  // toggle tree types
  const toggleTree = () => {
    if (otherTree) {
      setCurrentTree(otherTree)
      setOtherTree(currentTree)
    }
  }

  // del tree
  const deleteTree = async (treeData: TreeResult) => {
    const treeName = treeData.treeName || `Tree #${treeData.id}`
    if (!window.confirm(`Are you sure you want to delete "${treeName}"?`)) {return}
    try {
      const response = await fetch(buildApiUrl(config.API_ENDPOINTS.DELETE_TREE(treeData.id)), {method: 'DELETE'})
      if (response.ok) {
        setPreviousTrees(trees => trees.filter(item => item.id !== treeData.id))
        if (currentTree?.id === treeData.id || otherTree?.id === treeData.id) {
          setCurrentTree(null)
          setOtherTree(null)
          navigate('/trees')
        }
      } else {setError('FAILED TO DELETE TREE')}
    } catch (error) {setError('ERROR DELETING TREE')}
  }

  return (
    <>
      <Header />

      <main className="max-w-6xl mx-auto p-8">
        {error && (
          <div className="card-main mb-6 bg-red-50 border border-red-200">
            <p className="text-red-700 text-center">{error}</p>
          </div>
        )}

        <Routes>
          <Route path="/" element={
            <InputView
              numbers={formData.numbers}
              treeName={formData.treeName}
              loading={loading}
              onNumbersChange={(value) => updateFormData('numbers', value)}
              onTreeNameChange={(value) => updateFormData('treeName', value)}
              onCreateTree={createTree}
            />
          } />

          <Route path="/trees" element={
            <GalleryView
              trees={previousTrees}
              onViewTree={viewTree}
              onDeleteTree={deleteTree}
              onCreateFirst={() => navigate('/')}
              onLoadTrees={loadPreviousTrees}
            />
          } />

          <Route path="/trees/:id" element={
            <TreeViewRoute
              currentTree={currentTree}
              otherTree={otherTree}
              onToggleTree={toggleTree}
              onLoadTree={viewTree}
            />
          } />
        </Routes>
      </main>
    </>
  )
}

function TreeViewRoute({ 
  currentTree, 
  otherTree, 
  onToggleTree, 
  onLoadTree 
}: { 
  currentTree: TreeView | null
  otherTree: TreeView | null
  onToggleTree: () => void
  onLoadTree: (treeData: TreeResult) => void
}) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [treeData, setTreeData] = useState<TreeResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadTree = async () => {
      if (!id) return
      
      try {
        const response = await fetch(buildApiUrl(config.API_ENDPOINTS.GET_TREE_BY_ID(parseInt(id))))
        if (response.ok) {
          const tree = await response.json()
          setTreeData(tree)
          onLoadTree(tree)
        } else {setError('Tree not found')}
      } catch (err) {setError('Failed to load tree')}
      finally {setLoading(false)}
    }

    if (currentTree && currentTree.id.toString() === id) {
      setTreeData(currentTree)
      setLoading(false)
    } else {loadTree()}
  }, [id, currentTree, onLoadTree])

  if (loading) {
    return (
      <div className="card-main text-center">
        <p>Loading tree...</p>
      </div>
    )
  }

  if (error || !treeData) {
    return (
      <div className="card-main text-center">
        <p className="text-red-600">{error || 'Tree not found'}</p>
        <button 
          onClick={() => navigate('/trees')} 
          className="btn-large mt-4"
        >
          Back to Trees
        </button>
      </div>
    )
  }

  if (!currentTree || !otherTree) {
    return (
      <div className="card-main text-center">
        <p>Tree data not available</p>
        <button 
          onClick={() => navigate('/trees')} 
          className="btn-large mt-4"
        >
          Back to Trees
        </button>
      </div>
    )
  }

  return (
    <TreeDisplayView
      tree={currentTree}
      other={otherTree}
      onBackToInput={() => navigate('/')}
      onToggleTree={onToggleTree}
    />
  )
}

export default App