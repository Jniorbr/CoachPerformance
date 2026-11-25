import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import type { Root } from 'react-dom/client'
import { App } from './App'
import { ErrorBoundary } from './components/ui/ErrorBoundary'
import './tailwind.css'

let raiz: Root | null = null

export function montarCoach(container: HTMLElement) {
  if (raiz) return
  raiz = createRoot(container)
  raiz.render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>
  )
}

/** Ao sair da conta: desmonta para não deixar dados de um usuário na tela do próximo. */
export function desmontarCoach() {
  raiz?.unmount()
  raiz = null
}
