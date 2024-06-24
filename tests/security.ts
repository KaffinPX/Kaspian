import { readdir } from "node:fs/promises"

const files = await readdir('./node_modules', { recursive: true })
let findings: string[] = []

for (const directory of files) {
  const file = Bun.file('./node_modules/' + directory)

  if (file.type.startsWith('text/javascript')) {
    const content = await file.text().catch(err => { 
      if (err.code === 'EISDIR') return
      else throw err
    })


    if (content && (content.includes('fetch') || content.includes('XMLHttpRequest') || content.includes('WebSocket'))) findings.push(directory)
  }
}

console.log(findings.join('\n'))