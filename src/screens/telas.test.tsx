import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import "@testing-library/jest-dom/vitest"
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Refeicao, TreinoSerie } from '../lib/data'
import { hoje } from '../lib/datas'
import { Historico } from './Historico'
import { Nutricao } from './Nutricao'
import { Treino } from './Treino'

vi.mock('../lib/data', () => ({
  listarSeriesPorData: vi.fn(),
  listarRefeicoesPorData: vi.fn(),
  listarSeriesNoPeriodo: vi.fn(),
  listarRefeicoesNoPeriodo: vi.fn(),
  inserirSerie: vi.fn(),
  excluirSerie: vi.fn(),
  atualizarSerie: vi.fn(),
  upsertRefeicao: vi.fn()
}))

import * as data from '../lib/data'

const m = vi.mocked(data)

function serie(extra: Partial<TreinoSerie>): TreinoSerie {
  return {
    id: crypto.randomUUID(),
    data: hoje(),
    divisao: 'push',
    exercicio_id: 'push1',
    exercicio_nome: 'Supino inclinado com halteres',
    carga_kg: 30,
    repeticoes: 10,
    ...extra
  } as TreinoSerie
}

function refeicao(extra: Partial<Refeicao>): Refeicao {
  return { data: hoje(), refeicao: 'cafe', status: 'done', descricao: 'Ovos e pão', ...extra } as Refeicao
}

async function irParaPush(u: ReturnType<typeof userEvent.setup>) {
  await u.click(await screen.findByRole('button', { name: 'Push' }))
}

beforeEach(() => {
  vi.resetAllMocks()
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

describe('Treino', () => {
  it('mostra loading, depois a lista (sucesso) com a última série', async () => {
    m.listarSeriesPorData.mockResolvedValue([
      serie({ id: 'a', carga_kg: 20, repeticoes: 12 }),
      serie({ id: 'b', carga_kg: 30, repeticoes: 8 })
    ])
    const u = userEvent.setup()
    render(<Treino />)
    expect(screen.getByRole('status')).toHaveAttribute('aria-busy', 'true')
    await waitFor(() => expect(screen.queryByRole('status')).toBeNull())
    await irParaPush(u)
    // a série mais NOVA (última da lista ordenada por created_at) é a exibida
    expect(screen.getByText('Última: 30 kg × 8')).toBeInTheDocument()
    expect(screen.getByText('2 séries ✓')).toBeInTheDocument()
  })

  it('estado vazio: avisa que não há séries hoje, mas mantém a lista de exercícios', async () => {
    m.listarSeriesPorData.mockResolvedValue([])
    render(<Treino />)
    expect(await screen.findByText('Nenhuma série registrada hoje')).toBeInTheDocument()
  })

  it('estado de erro tem "Tentar novamente" que busca de novo', async () => {
    m.listarSeriesPorData.mockRejectedValueOnce(new TypeError('Failed to fetch'))
    m.listarSeriesPorData.mockResolvedValueOnce([])
    const u = userEvent.setup()
    render(<Treino />)
    expect(await screen.findByRole('alert')).toHaveTextContent(/Sem conexão/)
    await u.click(screen.getByRole('button', { name: 'Tentar novamente' }))
    expect(await screen.findByText('Nenhuma série registrada hoje')).toBeInTheDocument()
    expect(m.listarSeriesPorData).toHaveBeenCalledTimes(2)
  })

  it('valida carga e repetições no front e NÃO chama o banco com dado inválido', async () => {
    m.listarSeriesPorData.mockResolvedValue([])
    const u = userEvent.setup()
    render(<Treino />)
    await irParaPush(u)
    await u.click(await screen.findByRole('button', { name: /Supino inclinado/ }))
    await u.type(screen.getByLabelText('Carga (kg)'), '-5')
    await u.type(screen.getByLabelText('Repetições'), '0')
    await u.click(screen.getByRole('button', { name: 'Salvar série' }))
    expect(screen.getByText('A carga não pode ser negativa')).toBeInTheDocument()
    expect(screen.getByText('Entre 1 e 999')).toBeInTheDocument()
    expect(m.inserirSerie).not.toHaveBeenCalled()
  })

  it('salva série válida com a data local e recarrega a lista', async () => {
    m.listarSeriesPorData.mockResolvedValue([])
    m.inserirSerie.mockResolvedValue(serie({}))
    const u = userEvent.setup()
    render(<Treino />)
    await irParaPush(u)
    await u.click(await screen.findByRole('button', { name: /Supino inclinado/ }))
    await u.type(screen.getByLabelText('Carga (kg)'), '32.5')
    await u.type(screen.getByLabelText('Repetições'), '10')
    await u.click(screen.getByRole('button', { name: 'Salvar série' }))
    await waitFor(() =>
      expect(m.inserirSerie).toHaveBeenCalledWith(
        expect.objectContaining({ data: hoje(), exercicio_id: 'push1', carga_kg: 32.5, repeticoes: 10 })
      )
    )
    await waitFor(() => expect(m.listarSeriesPorData).toHaveBeenCalledTimes(2))
  })

  it('falha ao salvar mantém os campos preenchidos e mostra mensagem amigável', async () => {
    m.listarSeriesPorData.mockResolvedValue([])
    m.inserirSerie.mockRejectedValue({ code: '42501', message: 'new row violates row-level security policy' })
    const u = userEvent.setup()
    render(<Treino />)
    await irParaPush(u)
    await u.click(await screen.findByRole('button', { name: /Supino inclinado/ }))
    await u.type(screen.getByLabelText('Carga (kg)'), '20')
    await u.type(screen.getByLabelText('Repetições'), '8')
    await u.click(screen.getByRole('button', { name: 'Salvar série' }))
    expect(await screen.findByText(/Sem permissão/)).toBeInTheDocument()
    expect(screen.getByLabelText('Carga (kg)')).toHaveValue(20)
  })
})

describe('Nutrição', () => {
  it('vazio, erro e sucesso', async () => {
    m.listarRefeicoesPorData.mockResolvedValueOnce([])
    const { unmount } = render(<Nutricao />)
    expect(await screen.findByText('Nenhuma refeição registrada hoje')).toBeInTheDocument()
    unmount()

    m.listarRefeicoesPorData.mockRejectedValueOnce({ code: 'PGRST301', message: 'JWT expired' })
    const r2 = render(<Nutricao />)
    expect(await screen.findByRole('alert')).toHaveTextContent(/sessão expirou/)
    r2.unmount()

    m.listarRefeicoesPorData.mockResolvedValueOnce([refeicao({})])
    render(<Nutricao />)
    expect(await screen.findByText('Ovos e pão')).toBeInTheDocument()
    expect(screen.getByText('1 de 4 refeições registradas')).toBeInTheDocument()
  })

  it('salva refeição com upsert na data local', async () => {
    m.listarRefeicoesPorData.mockResolvedValue([])
    m.upsertRefeicao.mockResolvedValue(refeicao({}))
    const u = userEvent.setup()
    render(<Nutricao />)
    await u.click(await screen.findByRole('button', { name: /Almoço/ }))
    await u.type(screen.getByLabelText('O que você comeu?'), 'Arroz e frango')
    await u.click(screen.getByRole('button', { name: 'Salvar refeição' }))
    await waitFor(() =>
      expect(m.upsertRefeicao).toHaveBeenCalledWith({
        data: hoje(), refeicao: 'almoco', status: 'done', descricao: 'Arroz e frango'
      })
    )
  })
})

describe('Histórico', () => {
  it('estado vazio quando não há nada no banco nem no navegador', async () => {
    m.listarSeriesNoPeriodo.mockResolvedValue([])
    m.listarRefeicoesNoPeriodo.mockResolvedValue([])
    render(<Historico />)
    expect(await screen.findByText('Sem registros ainda')).toBeInTheDocument()
  })

  it('ignora hábitos locais anteriores aos últimos 30 dias', async () => {
    m.listarSeriesNoPeriodo.mockResolvedValue([])
    m.listarRefeicoesNoPeriodo.mockResolvedValue([])
    localStorage.setItem(
      'coach-performance:v1',
      JSON.stringify({
        days: {
          '2000-01-01': {
            date: '2000-01-01',
            division: 'push',
            workoutDone: true,
            water: 0,
            sleepTime: '22:30',
            cardio: null
          }
        }
      })
    )
    render(<Historico />)
    expect(await screen.findByText('Sem registros ainda')).toBeInTheDocument()
  })

  it('lista os dias com refeições e séries vindos do banco', async () => {
    m.listarSeriesNoPeriodo.mockResolvedValue([serie({}), serie({})])
    m.listarRefeicoesNoPeriodo.mockResolvedValue([refeicao({})])
    render(<Historico />)
    expect(await screen.findByText(/1 refeição · 2 séries/)).toBeInTheDocument()
  })

  it('erro mostra retry', async () => {
    m.listarSeriesNoPeriodo.mockRejectedValue(new Error('boom'))
    m.listarRefeicoesNoPeriodo.mockResolvedValue([])
    render(<Historico />)
    expect(await screen.findByRole('button', { name: 'Tentar novamente' })).toBeInTheDocument()
  })

  it('lê o formato antigo do localStorage (hábitos não se perdem na migração)', async () => {
    m.listarSeriesNoPeriodo.mockResolvedValue([])
    m.listarRefeicoesNoPeriodo.mockResolvedValue([])
    localStorage.setItem(
      'coach-performance:v1',
      JSON.stringify({ days: { [hoje()]: { date: hoje(), division: 'push', workoutDone: true, water: 500, sleepTime: '22:30', cardio: null, sets: {}, meals: {} } } })
    )
    render(<Historico />)
    expect(await screen.findByText('Concluído')).toBeInTheDocument()
  })
})
