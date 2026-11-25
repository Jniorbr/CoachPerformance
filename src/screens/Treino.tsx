import { useState } from 'react'
import { CardButton } from '../components/ui/Card'
import { EmptyState } from '../components/ui/EmptyState'
import { ErrorState } from '../components/ui/ErrorState'
import { LoadingState } from '../components/ui/LoadingState'
import { SerieModal } from '../components/SerieModal'
import { useConsulta } from '../hooks/useConsulta'
import { listarSeriesPorData } from '../lib/data'
import { hoje } from '../lib/datas'
import { DIVISOES, divisaoDoDia, PLANO, ROTULOS } from '../lib/plano'
import type { DivisaoId } from '../lib/plano'

function abaInicial(): DivisaoId {
  const d = divisaoDoDia(hoje())
  return d === 'descanso' ? 'push' : d
}

export function Treino() {
  const chave = hoje()
  const [aba, setAba] = useState<DivisaoId>(abaInicial)
  const [exercicioAberto, setExercicioAberto] = useState<string | null>(null)
  const consulta = useConsulta(
    () => listarSeriesPorData(chave),
    'carregar o treino',
    (series) => series.length === 0,
    chave
  )

  const series = consulta.dados ?? []
  const aberto = PLANO[aba].find((e) => e.id === exercicioAberto)

  return (
    <div className="grid gap-4">
      <h2 className="text-lg font-bold">Treino de {ROTULOS[aba]}</h2>

      <div role="group" aria-label="Divisão do treino" className="flex gap-2 overflow-x-auto pb-1">
        {DIVISOES.map((d) => (
          <button
            key={d}
            type="button"
            aria-pressed={aba === d}
            onClick={() => setAba(d)}
            className={[
              'shrink-0 cursor-pointer rounded-full border px-3.5 py-2 text-xs font-semibold transition',
              'focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary',
              aba === d
                ? 'border-primary bg-indigo-50 text-primary-dark'
                : 'border-line bg-surface text-muted hover:border-primary'
            ].join(' ')}
          >
            {ROTULOS[d]}
          </button>
        ))}
      </div>

      {consulta.status === 'loading' && <LoadingState linhas={5} texto="Carregando o treino..." />}
      {consulta.status === 'error' && (
        <ErrorState mensagem={consulta.erro} onTentarNovamente={consulta.tentarNovamente} />
      )}

      {(consulta.status === 'success' || consulta.status === 'empty') && (
        <>
          {consulta.status === 'empty' && (
            <EmptyState
              icone="🏋️"
              titulo="Nenhuma série registrada hoje"
              descricao="Escolha um exercício abaixo para registrar sua primeira série."
            />
          )}
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {PLANO[aba].map((exercicio) => {
              const feitas = series.filter((s) => s.exercicio_id === exercicio.id)
              const ultima = feitas[feitas.length - 1]
              return (
                <li key={exercicio.id}>
                  <CardButton
                    onClick={() => setExercicioAberto(exercicio.id)}
                    className="flex items-center gap-3"
                  >
                    <span
                      aria-hidden="true"
                      className="grid size-11 shrink-0 place-items-center rounded-xl bg-indigo-100 text-xl"
                    >
                      {exercicio.icone}
                    </span>
                    <span className="min-w-0 flex-1">
                      <strong className="block text-sm">{exercicio.nome}</strong>
                      <span className="text-xs text-muted">
                        {ultima ? `Última: ${ultima.carga_kg} kg × ${ultima.repeticoes}` : exercicio.alvo}
                      </span>
                    </span>
                    {feitas.length > 0 ? (
                      <span className="text-xs font-bold text-ok">{feitas.length} séries ✓</span>
                    ) : (
                      <span aria-hidden="true" className="text-muted">›</span>
                    )}
                  </CardButton>
                </li>
              )
            })}
          </ul>
        </>
      )}

      {aberto && (
        <SerieModal
          exercicio={aberto}
          divisao={aba}
          series={series.filter((s) => s.exercicio_id === aberto.id)}
          onFechar={() => setExercicioAberto(null)}
          onAlterou={consulta.recarregar}
        />
      )}
    </div>
  )
}
