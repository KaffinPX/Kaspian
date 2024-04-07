export default function useURLParams (): [ string, URLSearchParams ] {
  const hash = window.location.hash.replace('#', '')
  const params = new URLSearchParams(window.location.search)

  return [ hash, params ]
}
