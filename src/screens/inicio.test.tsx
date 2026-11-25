import '@testing-library/jest-dom/vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { hoje } from '../lib/datas'
import { Inicio } from './Inicio'

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

beforeEach(() => {
  vi.resetAllMocks()
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

describe('Início (resumo do dia)', () => {
  it('mostra um próximo passo quando ainda não há registros hoje', async () => {
    m.listarSeriesPorData.mockResolvedValue([])
    m.listarRefeicoesPorData.mockResolvedValue([])
    render(<Inicio onNavegar={() => {}} />)
    expect(await screen.findByText('Ainda sem registros de hoje')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Ir para o treino|Registrar uma refeição/ })).toBeInTheDocument()
  })

  it('loading → sucesso, com refeições do banco', async () => {
    m.listarSeriesPorData.mockResolvedValue([])
    m.listarRefeicoesPorData.mockResolvedValue([
      { data: hoje(), refeicao: 'cafe', status: 'done', descricao: 'Ovos' } as never
    ])
    render(<Inicio onNavegar={() => {}} />)
    expect(screen.getByRole('status')).toHaveAttribute('aria-busy', 'true')
    expect(await screen.findByText('1/4 registradas')).toBeInTheDocument()
    expect(screen.getByText('Ontem', { exact: false })).toBeInTheDocument()
  })

  it('erro com retry que recupera', async () => {
    m.listarSeriesPorData.mockRejectedValueOnce(new Error('x'))
    m.listarSeriesPorData.mockResolvedValue([])
    m.listarRefeicoesPorData.mockResolvedValue([])
    const u = userEvent.setup()
    render(<Inicio onNavegar={() => {}} />)
    await u.click(await screen.findByRole('button', { name: 'Tentar novamente' }))
    expect(await screen.findByText('0/4 registradas')).toBeInTheDocument()
  })

  it('hidratação soma, não passa de zero ao desfazer e persiste no formato antigo', async () => {
    m.listarSeriesPorData.mockResolvedValue([])
    m.listarRefeicoesPorData.mockResolvedValue([])
    const u = userEvent.setup()
    render(<Inicio onNavegar={() => {}} />)
    await u.click(await screen.findByRole('button', { name: '↩ 250' }))
    expect(screen.getByText(/^0 \/ 3,5 L$/)).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: '+500 ml' }))
    expect(screen.getByText(/^0,5 \/ 3,5 L$/)).toBeInTheDocument()
    const salvo = JSON.parse(localStorage.getItem('coach-performance:v1') ?? '{}')
    expect(salvo.days[hoje()].water).toBe(500)
  })

  it('cardio validado (1–600) e meta de água sobe 500 ml com cardio', async () => {
    m.listarSeriesPorData.mockResolvedValue([])
    m.listarRefeicoesPorData.mockResolvedValue([])
    const u = userEvent.setup()
    render(<Inicio onNavegar={() => {}} />)
    await u.click(await screen.findByRole('button', { name: 'Registrar cardio' }))
    const campo = screen.getByLabelText('Duração (minutos)')
    await u.clear(campo)
    await u.type(campo, '900')
    await u.click(screen.getByRole('button', { name: 'Salvar cardio' }))
    expect(screen.getByText('Informe de 1 a 600 minutos')).toBeInTheDocument()
    await u.clear(campo)
    await u.type(campo, '40')
    await u.click(screen.getByRole('button', { name: 'Salvar cardio' }))
    await waitFor(() => expect(screen.getByText('40 min')).toBeInTheDocument())
    expect(screen.getByText(/\/ 4 L$/)).toBeInTheDocument()
  })
})
