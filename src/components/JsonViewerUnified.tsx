import { formatJsonPretty } from '../utils/jsonUtils'

interface JsonViewerUnifiedProps {jsonString: string, onCopy: () => void}

export function JsonViewerUnified({ jsonString, onCopy }: JsonViewerUnifiedProps) {
  return (
    <div>
      <div className="code-container">
        <pre className="code-text">{formatJsonPretty(jsonString)}</pre>
      </div>
      <div className="flex justify-end items-center mt-4">
        <button onClick={onCopy} className="btn">Copy JSON</button>
      </div>
    </div>
  )
}
