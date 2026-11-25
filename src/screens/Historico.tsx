import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { EmptyState } from '../components/ui/EmptyState'
import { ErrorState } from '../components/ui/ErrorState'
import { LoadingState } from '../components/ui/LoadingState'
import { useConsulta } from '../hooks/useConsulta'
import { useHabitos } from '../hooks/useHabitos'
import { hoje, rotuloData, somarDias } from '../lib/datas'
import { carregarPeriodo } from '../lib/dia'
import { temAtividadeLocal } from '../lib/habitos'
import { divisaoDoDia, ROTULOS } from '../lib/plano'

const DIAS = 30

function plural(n: number, singular: string, pluralForma: string) {
  return `${n} ${n === 1 ? singular : pluralForma}`
}

export function Historico() {
  const fim = hoje()
  const inicio = somarDias(fim, -(DIAS - 1))
  const habitos = useHabitos()
  const temLocal = Object.entries(habitos.dias).some(([k, d]) => k <= fim && temAtividadeLocal(d))

  const consulta = useConsulta(
    () => carregarPeriodo(inicio, fim),
    'carregar o histórico',
    (d) => d.series.length === 0 && d.refeicoes.length === 0 && !temLocal,
    `${inicio}:${fim}`
  )

  let conteudo
  if (consulta.status === 'loading') {
    conteudo = <LoadingState linhas={5} texto="Carregando o histórico..." />
  } else if (consulta.status === 'error' || !consulta.dados) {
    conteudo = <ErrorState mensagem={consulta.erro} onTentarNovamente={consulta.tentarNovamente} />
  } else if (consulta.status === 'empty') {
    conteudo = (
      <EmptyState
        icone="📅"
        titulo="Sem registros ainda"
        descricao="Registre um treino, uma refeição ou outra atividade para começar seu histórico."
      />
    )
  } else {
    const { series, refeicoes } = consulta.dados
    const chaves = new Set<string>()
    series.forEach((s) => chaves.add(s.data))
    refeicoes.forEach((r) => chaves.add(r.data))
    Object.entries(habitos.dias).forEach(([k, d]) => {
      if (k <= fim && temAtividadeLocal(d)) chaves.add(k)
    })
    const linhas = [...chaves].sort().reverse().slice(0, DIAS).map((chave) => {
      const divisao = divisaoDoDia(chave)
      return {
        chave,
        divisao,
        concluido: habitos.obter(chave).workoutDone,
        refeicoes: refeicoes.filter((r) => r.data === chave && r.status === 'done').length,
        series: series.filter((s) => s.data === chave).length
      }
    })
    const treinos = linhas.filter((l) => l.concluido).length
    const refeicoesTotal = linhas.reduce((soma, l) => soma + l.refeicoes, 0)

    conteudo = (
      <Card>
        <p className="mb-3 text-xs text-muted">
          Nos últimos {plural(linhas.length, 'dia registrado', 'dias registrados')}: {treinos}{' '}
          {treinos === 1 ? 'treino concluído' : 'treinos concluídos'} e {refeicoesTotal}{' '}
          {refeicoesTotal === 1 ? 'refeição anotada' : 'refeições anotadas'}.
        </p>
        <ul className="grid md:grid-cols-2 md:gap-x-8">
          {linhas.map((l) => (
            <li key={l.chave} className="flex items-center justify-between gap-3 border-b border-line py-3">
              <div>
                <strong className="text-sm">
                  {rotuloData(l.chave, { weekday: 'short', day: 'numeric', month: 'short' })}
                </strong>
                <p className="text-xs text-muted">
                  {ROTULOS[l.divisao]} · {plural(l.refeicoes, 'refeição', 'refeições')} ·{' '}
                  {plural(l.series, 'série', 'séries')}
                </p>
              </div>
              <Badge tone={l.concluido ? 'success' : l.divisao === 'descanso' ? 'neutral' : 'warning'}>
                {l.concluido ? 'Concluído' : l.divisao === 'descanso' ? 'Descanso' : 'Pendente'}
              </Badge>
            </li>
          ))}
        </ul>
      </Card>
    )
  }

  return (
    <div className="grid gap-4">
      <h2 className="text-lg font-bold">📅 Últimos registros</h2>
      {habitos.erro && (
        <p role="alert" className="rounded-xl border border-danger-line bg-danger-soft p-3 text-xs text-danger">
          {habitos.erro}
        </p>
      )}
      {conteudo}
    </div>
  )
}
