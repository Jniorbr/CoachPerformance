import { useState } from 'react'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { ErrorState } from '../components/ui/ErrorState'
import { LoadingState } from '../components/ui/LoadingState'
import { ProgressBar } from '../components/ui/ProgressBar'
import { CardioModal } from '../components/CardioModal'
import type { Tela } from '../components/NavPrincipal'
import { RefeicaoModal } from '../components/RefeicaoModal'
import { SonoModal } from '../components/SonoModal'
import { EmptyState } from '../components/ui/EmptyState'
import { useConsulta } from '../hooks/useConsulta'
import { useHabitos } from '../hooks/useHabitos'
import { hoje, rotuloData, somarDias } from '../lib/datas'
import { carregarDia } from '../lib/dia'
import { temAtividadeLocal } from '../lib/habitos'
import { divisaoDoDia, PLANO, REFEICOES, ROTULOS } from '../lib/plano'
import type { TipoRefeicao } from '../lib/plano'

type Modal = { tipo: 'refeicao'; id: TipoRefeicao } | { tipo: 'sono' } | { tipo: 'cardio' } | null

export function Inicio({ onNavegar }: { onNavegar: (tela: Tela) => void }) {
  const chave = hoje()
  const habitos = useHabitos()
  const [modal, setModal] = useState<Modal>(null)
  const consulta = useConsulta(
    () => carregarDia(chave),
    'carregar o resumo do dia',
    (dados) => dados.series.length === 0 && dados.refeicoes.length === 0 && !temAtividadeLocal(habitos.obter(chave)),
    chave
  )

  if (consulta.status === 'loading') return <LoadingState linhas={4} texto="Carregando o resumo do dia..." />
  if (consulta.status === 'error' || !consulta.dados) {
    return <ErrorState mensagem={consulta.erro} onTentarNovamente={consulta.tentarNovamente} />
  }

  const { series, refeicoes } = consulta.dados
  const dia = habitos.obter(chave)
  const divisao = divisaoDoDia(chave)
  const exercicios = divisao === 'descanso' ? [] : PLANO[divisao]
  const temTreino = divisao !== 'descanso'
  const semRegistros = series.length === 0 && refeicoes.length === 0 && !temAtividadeLocal(dia)
  const idsComSerie = new Set(series.map((s) => s.exercicio_id))
  const comSeries = exercicios.filter((e) => idsComSerie.has(e.id)).length
  const refeicoesFeitas = refeicoes.filter((r) => r.status === 'done').length
  const metaAgua = 3500 + (dia.cardio ? 500 : 0)
  const percentualAgua = Math.min(100, Math.round((dia.water / metaAgua) * 100))

  const ontem = somarDias(chave, -1)
  const amanha = somarDias(chave, 1)
  const divisaoOntem = divisaoDoDia(ontem)
  const ontemConcluido = habitos.obter(ontem).workoutDone

  const mensagem = dia.workoutDone
    ? 'Treino concluído! Mandou bem.'
    : temTreino
      ? 'Seu treino de hoje está pronto.'
      : 'Dia de descanso. Recuperar também faz parte.'

  const refeicaoAberta = modal?.tipo === 'refeicao' ? REFEICOES.find((r) => r.id === modal.id) : undefined

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {habitos.erro && (
        <p role="alert" className="rounded-xl border border-danger-line bg-danger-soft p-3 text-xs text-danger lg:col-span-2">
          {habitos.erro}
        </p>
      )}

      {semRegistros && (
        <div className="lg:col-span-2">
          <EmptyState
            icone="✨"
            titulo="Ainda sem registros de hoje"
            descricao="Comece pelo treino ou anote uma refeição. Seus hábitos também podem ser registrados nesta tela."
            acao={
              <Button size="sm" onClick={() => onNavegar(temTreino ? 'treino' : 'nutricao')}>
                {temTreino ? 'Ir para o treino' : 'Registrar uma refeição'}
              </Button>
            }
          />
        </div>
      )}

      <Card destaque className="lg:col-span-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs opacity-85">
              HOJE · {rotuloData(chave, { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
            <h2 className="text-2xl font-bold">{ROTULOS[divisao]}</h2>
            <p className="mt-1 text-sm opacity-90">{mensagem}</p>
          </div>
          {temTreino && (
            <Button
              size="sm"
              variant="secondary"
              className="border-white/40 bg-white/20 text-white hover:bg-white/30"
              onClick={() => habitos.atualizar(chave, (d) => ({ ...d, workoutDone: !d.workoutDone }))}
            >
              {dia.workoutDone ? 'Desmarcar' : 'Concluir treino'}
            </Button>
          )}
        </div>
        {temTreino && (
          <div className="mt-4">
            <ProgressBar
              rotulo="Exercícios com séries registradas"
              percentual={(comSeries / exercicios.length) * 100}
            />
            <p className="mt-1.5 text-xs opacity-90">
              {comSeries} de {exercicios.length} exercícios com séries registradas
            </p>
          </div>
        )}
      </Card>

      {temTreino && (
        <Card>
          <h3 className="mb-3 text-sm font-bold">⚡ Comece por aqui</h3>
          <div className="flex items-center gap-3 rounded-2xl bg-soft p-3">
            <span aria-hidden="true" className="grid size-12 place-items-center rounded-xl bg-indigo-100 text-2xl">
              {exercicios[0].icone}
            </span>
            <div>
              <strong className="block text-sm">{exercicios[0].nome}</strong>
              <span className="text-xs text-muted">Alvo: {exercicios[0].alvo}</span>
            </div>
          </div>
          <Button fullWidth className="mt-3" onClick={() => onNavegar('treino')}>
            Ver treino do dia · {exercicios.length} exercícios
          </Button>
        </Card>
      )}

      <Card>
        <h3 className="mb-3 flex items-center justify-between text-sm font-bold">
          <span>🍽️ Refeições</span>
          <span className="text-xs font-normal text-muted">{refeicoesFeitas}/4 registradas</span>
        </h3>
        <div className="flex flex-wrap gap-2">
          {REFEICOES.map((r) => {
            const feita = refeicoes.some((x) => x.refeicao === r.id && x.status === 'done')
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => setModal({ tipo: 'refeicao', id: r.id })}
                className={[
                  'cursor-pointer rounded-full border px-3 py-1.5 text-xs transition',
                  'focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary',
                  feita ? 'border-transparent bg-ok-soft text-ok' : 'border-line bg-soft text-muted hover:border-primary'
                ].join(' ')}
              >
                {r.icone} {r.nome}
                {feita ? ' ✓' : ''}
              </button>
            )
          })}
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Card as="article">
          <p className="text-xs text-muted">🌙 Dormir às</p>
          <p className="mt-1 text-2xl font-bold">{dia.sleepTime}</p>
          <Button className="mt-3" size="sm" variant="secondary" onClick={() => setModal({ tipo: 'sono' })}>
            Alterar horário
          </Button>
        </Card>
        <Card as="article">
          <p className="text-xs text-muted">🏃 Cardio</p>
          <p className="mt-1 text-2xl font-bold">{dia.cardio ? `${dia.cardio.minutes} min` : 'Não fiz'}</p>
          <p className="text-xs text-muted">{dia.cardio ? dia.cardio.type : 'Registre sua atividade'}</p>
          <Button className="mt-3" size="sm" variant="secondary" onClick={() => setModal({ tipo: 'cardio' })}>
            {dia.cardio ? 'Editar cardio' : 'Registrar cardio'}
          </Button>
        </Card>
      </div>

      <Card>
        <div className="mb-2 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs text-muted">💧 Hidratação</p>
            <p className="mt-1 text-2xl font-bold">
              {(dia.water / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 2 })} /{' '}
              {(metaAgua / 1000).toLocaleString('pt-BR')} L
            </p>
          </div>
          <span className="text-xs text-muted">{percentualAgua}%</span>
        </div>
        <ProgressBar tom="agua" rotulo="Meta de água" percentual={percentualAgua} />
        <div className="mt-3 grid grid-cols-3 gap-2">
          {[-250, 250, 500].map((ml) => (
            <Button
              key={ml}
              size="sm"
              variant={ml < 0 ? 'secondary' : 'primary'}
              onClick={() =>
                habitos.atualizar(chave, (d) => ({ ...d, water: Math.max(0, Math.min(9999, d.water + ml)) }))
              }
            >
              {ml < 0 ? '↩ 250' : `+${ml} ml`}
            </Button>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Card as="article" className="bg-soft">
          <p className="text-xs text-muted">⏮️ Ontem</p>
          <p className="mt-1 font-semibold">{ROTULOS[divisaoOntem]}</p>
          <div className="mt-2">
            <Badge tone={ontemConcluido ? 'success' : divisaoOntem === 'descanso' ? 'neutral' : 'warning'}>
              {ontemConcluido ? 'Concluído' : divisaoOntem === 'descanso' ? 'Descanso' : 'Pendente'}
            </Badge>
          </div>
        </Card>
        <Card as="article" className="bg-soft">
          <p className="text-xs text-muted">⏭️ Amanhã</p>
          <p className="mt-1 font-semibold">{ROTULOS[divisaoDoDia(amanha)]}</p>
          <p className="mt-2 text-xs text-muted">{rotuloData(amanha, { day: 'numeric', month: 'short' })}</p>
        </Card>
      </div>

      {modal?.tipo === 'refeicao' && refeicaoAberta && (
        <RefeicaoModal
          refeicao={refeicaoAberta}
          atual={refeicoes.find((x) => x.refeicao === refeicaoAberta.id)}
          onFechar={() => setModal(null)}
          onAlterou={consulta.recarregar}
        />
      )}
      {modal?.tipo === 'sono' && (
        <SonoModal
          atual={dia.sleepTime}
          onSalvar={(h) => habitos.atualizar(chave, (d) => ({ ...d, sleepTime: h }))}
          onFechar={() => setModal(null)}
        />
      )}
      {modal?.tipo === 'cardio' && (
        <CardioModal
          atual={dia.cardio}
          onSalvar={(c) => habitos.atualizar(chave, (d) => ({ ...d, cardio: c }))}
          onRemover={() => habitos.atualizar(chave, (d) => ({ ...d, cardio: null }))}
          onFechar={() => setModal(null)}
        />
      )}
    </div>
  )
}
