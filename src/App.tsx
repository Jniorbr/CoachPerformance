import { useState } from 'react'
import { NavPrincipal } from './components/NavPrincipal'
import type { Tela } from './components/NavPrincipal'
import { ErrorBoundary } from './components/ui/ErrorBoundary'
import { Historico } from './screens/Historico'
import { Inicio } from './screens/Inicio'
import { Nutricao } from './screens/Nutricao'
import { Treino } from './screens/Treino'

export function App() {
  const [tela, setTela] = useState<Tela>('inicio')
  return (
    <div className="grid gap-4 text-ink">
      <NavPrincipal ativa={tela} onNavegar={setTela} />
      {/* key: ao trocar de tela o boundary reinicia e a tela busca os dados de novo */}
      <ErrorBoundary key={tela}>
        {tela === 'inicio' && <Inicio onNavegar={setTela} />}
        {tela === 'treino' && <Treino />}
        {tela === 'nutricao' && <Nutricao />}
        {tela === 'historico' && <Historico />}
      </ErrorBoundary>
    </div>
  )
}
