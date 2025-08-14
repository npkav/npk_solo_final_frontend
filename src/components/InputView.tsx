interface InputViewProps {
  numbers: string
  treeName: string
  loading: boolean
  onNumbersChange: (value: string) => void
  onTreeNameChange: (value: string) => void
  onCreateTree: () => void
}

export function InputView({numbers, treeName, loading, onNumbersChange, onTreeNameChange, onCreateTree}: InputViewProps) {
  const numberCount = numbers.split(',').filter(num => num.trim()).length
  
  function handleNumbersChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    const target = event.target
    onNumbersChange(target.value)
    target.style.height = 'auto'
    target.style.height = Math.min(120, target.scrollHeight) + 'px'
  }

  return (
    <div>
      <div className="card-main">
        <h2 className="heading-section mb-6">enter tree details...</h2>
        <div className="mb-6">
          <label className="block info-label mb-2">tree name</label>
          <input
            type="text"
            value={treeName}
            onChange={(event) => onTreeNameChange(event.target.value)}
            placeholder="e.g., my first tree, sample data"
            className="input-field"
          />
        </div>
        <div className="mb-6">
          <label className="block info-label mb-2">numbers (separated by commas)</label>
          <textarea
            value={numbers}
            onChange={handleNumbersChange}
            placeholder="ex: 87, 66, 68, 71, 53, 29, 59, 81, 8, 82, 27"
            className="input-numbers"
            rows={1}
          />
          {numbers.length > 50 && (
            <p className="text-xs text-gray-500 mt-1">{numberCount} numbers entered</p>
          )}
        </div>
        <div className="text-center">
          <button
            onClick={onCreateTree}
            disabled={loading}
            className={loading ? 'btn-large opacity-50 cursor-not-allowed' : 'btn-large'}
          >
            {loading ? 'creating trees...' : 'generate trees'}
          </button>
          <p className="text-sm text-gray-500 mt-3">this will generate both sequential and balanced versions as json</p>
        </div>
      </div>
    </div>
  )
}
