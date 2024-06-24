import { readdir } from "node:fs/promises"

const files = await readdir('./node_modules', { recursive: true })
let findings: Map<string, string[]> = new Map()

for (const directory of files) {
  const file = Bun.file('./node_modules/' + directory)
  
  if (file.type.startsWith('text/javascript')) {
    const content = await file.text().catch(err => { 
      if (err.code === 'EISDIR') return
      else throw err
    })

    if (content) {
      const lines = content.split('\n')
      let matchingLines: string[] = []

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]

        if (line.includes('fetch') || line.includes('XMLHttpRequest') || line.includes('WebSocket')) {
          matchingLines.push(`Line ${i + 1}: ${line.trim()}`)
        }
      }

      if (matchingLines.length > 0) {
        findings.set(directory, matchingLines)
      }
    }
  }
}

for (const [ directory, lines ] of findings.entries()) {
  console.log(`${directory}:`)

  for (const line of lines) {
    console.log(`- ${line}`)
  }
}