import { useState } from 'react'
import { Badge } from '../components/ui/Badge'
import { Card, CardButton } from '../components/ui/Card'
import { EmptyState } from '../components/ui/EmptyState'
import { ErrorState } from '../components/ui/ErrorState'
import { LoadingState } from '../components/ui/LoadingState'
import { ProgressBar } from '../components/ui/ProgressBar'
import { RefeicaoModal } from '../components/RefeicaoModal'
import { useConsulta } from '../hooks/useConsulta'
import { listarRefeicoesPorData } from '../lib/data'
import { hoje } from '../lib/datas'
import { REFEICOES } from '../lib/plano'
import type { TipoRefeicao } from '../lib/plano'

export function Nutricao() {
  const chave = hoje()
  const [aberta, setAberta] = useState<TipoRefeicao | null>(null)
  const consulta = useConsulta(
    () => listarRefeicoesPorData(chave),
    'carregar as refeições',
    (refeicoes) => refeicoes.length === 0,
    chave
  )

  if (consulta.status === 'loading') return <LoadingState linhas={4} texto="Carregando as refeições..." />
  if (consulta.status === 'error') {
    return <ErrorState mensagem={consulta.erro} onTentarNovamente={consulta.tentarNovamente} />
  }

  const refeicoes = consulta.dados ?? []
  const feitas = refeicoes.filter((r) => r.status === 'done').length
  const definicaoAberta = REFEICOES.find((r) => r.id === aberta)

  return (
    <div className="grid gap-4">
      <Card destaque>
        <p className="text-xs opacity-85">REGISTRO DE HOJE</p>
        <h2 className="text-2xl font-bold">Nutrição</h2>
        <p className="mt-1 text-sm opacity-90">
          {feitas} de {REFEICOES.length} refeições registradas
        </p>
        <div className="mt-4">
          <ProgressBar rotulo="Refeições registradas" percentual={(feitas / REFEICOES.length) * 100} />
        </div>
      </Card>

      {consulta.status === 'empty' && (
        <EmptyState
          icone="🍽️"
          titulo="Nenhuma refeição registrada hoje"
          descricao="Toque em uma refeição abaixo para anotar o que você comeu."
        />
      )}

      <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {REFEICOES.map((r) => {
          const registro = refeicoes.find((x) => x.refeicao === r.id)
          const feita = registro?.status === 'done'
          const pulada = registro?.status === 'skipped'
          return (
            <li key={r.id}>
              <CardButton onClick={() => setAberta(r.id)} className="grid gap-2">
                <span className="flex items-center justify-between gap-2">
                  <strong className="text-sm">
                    {r.icone} {r.nome}
                  </strong>
                  <Badge tone={feita ? 'success' : pulada ? 'neutral' : 'warning'}>
                    {feita ? 'Registrada ✓' : pulada ? 'Marquei que não comi' : 'A registrar'}
                  </Badge>
                </span>
                <span className="text-xs wrap-anywhere whitespace-pre-wrap text-muted">
                  {feita
                    ? registro.descricao || 'Refeição salva sem descrição.'
                    : 'Toque para registrar.'}
                </span>
              </CardButton>
            </li>
          )
        })}
      </ul>

      {definicaoAberta && (
        <RefeicaoModal
          refeicao={definicaoAberta}
          atual={refeicoes.find((x) => x.refeicao === definicaoAberta.id)}
          onFechar={() => setAberta(null)}
          onAlterou={consulta.recarregar}
        />
      )}
    </div>
  )
}
