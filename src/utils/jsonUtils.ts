/**
 * json utility functions
 * extracted from json viewer components
 */

export function isValidJson(text: string): boolean {
  try {JSON.parse(text); return true} catch {return false}
}

export function formatJsonPretty(jsonText: string): string {
  if (!isValidJson(jsonText)) return jsonText
  
  try {
    const parsed = JSON.parse(jsonText)
    if (parsed && parsed.levels && Array.isArray(parsed.levels)) {return formatTreeLevelsJson(parsed)}
    return JSON.stringify(parsed, null, 2)
  } catch {return jsonText}
}

function formatTreeLevelsJson(treeData: any): string {
  if (!treeData.levels || !Array.isArray(treeData.levels)) {return JSON.stringify(treeData, null, 2)}
  
  const levels = treeData.levels.map((level: any[]) => level.map(value => value === null ? 'null' : value))
  return JSON.stringify({ levels }, null, 2)
}
