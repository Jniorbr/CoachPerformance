import { supabase } from './supabase'

export type TreinoSerieId = string | number

export interface TreinoSerie {
  id: TreinoSerieId
  data: string
  divisao: string
  exercicio_id: string
  exercicio_nome: string
  carga_kg: number
  repeticoes: number
}

export type NovaTreinoSerie = Omit<TreinoSerie, 'id'>
export type AtualizacaoTreinoSerie = Partial<Omit<NovaTreinoSerie, 'data' | 'exercicio_id'>>

export type StatusRefeicao = 'done' | 'skipped'

export interface Refeicao {
  data: string
  refeicao: string
  status: StatusRefeicao
  descricao: string
}

export type AtualizacaoRefeicao = Partial<Pick<Refeicao, 'status' | 'descricao'>>

const seriesColumns = 'id,data,divisao,exercicio_id,exercicio_nome,carga_kg,repeticoes'
const refeicaoColumns = 'data,refeicao,status,descricao'

export async function inserirSerie(serie: NovaTreinoSerie): Promise<TreinoSerie> {
  const { data, error } = await supabase
    .from('treinos_series')
    .insert(serie)
    .select(seriesColumns)
    .single()

  if (error) throw error
  return data
}

export async function listarSeriesPorData(data: string): Promise<TreinoSerie[]> {
  const { data: series, error } = await supabase
    .from('treinos_series')
    .select(seriesColumns)
    .eq('data', data)
    .order('id', { ascending: true })

  if (error) throw error
  return series
}

export async function listarSeriesNoPeriodo(inicio: string, fim: string): Promise<TreinoSerie[]> {
  const { data: series, error } = await supabase
    .from('treinos_series')
    .select(seriesColumns)
    .gte('data', inicio)
    .lte('data', fim)
    .order('data', { ascending: false })
    .order('id', { ascending: true })

  if (error) throw error
  return series
}

export async function atualizarSerie(
  id: TreinoSerieId,
  alteracoes: AtualizacaoTreinoSerie
): Promise<TreinoSerie> {
  const { data, error } = await supabase
    .from('treinos_series')
    .update(alteracoes)
    .eq('id', id)
    .select(seriesColumns)
    .single()

  if (error) throw error
  return data
}

export async function excluirSerie(id: TreinoSerieId): Promise<void> {
  const { data, error } = await supabase
    .from('treinos_series')
    .delete()
    .eq('id', id)
    .select('id')
    .single()

  if (error) throw error
  if (!data) throw new Error('A série não foi encontrada para exclusão.')
}

export async function inserirRefeicao(refeicao: Refeicao): Promise<Refeicao> {
  const { data, error } = await supabase
    .from('refeicoes')
    .insert(refeicao)
    .select(refeicaoColumns)
    .single()

  if (error) throw error
  return data
}

export async function listarRefeicoesPorData(data: string): Promise<Refeicao[]> {
  const { data: refeicoes, error } = await supabase
    .from('refeicoes')
    .select(refeicaoColumns)
    .eq('data', data)

  if (error) throw error
  return refeicoes
}

export async function listarRefeicoesNoPeriodo(inicio: string, fim: string): Promise<Refeicao[]> {
  const { data: refeicoes, error } = await supabase
    .from('refeicoes')
    .select(refeicaoColumns)
    .gte('data', inicio)
    .lte('data', fim)
    .order('data', { ascending: false })

  if (error) throw error
  return refeicoes
}

export async function atualizarRefeicao(
  data: string,
  refeicao: string,
  alteracoes: AtualizacaoRefeicao
): Promise<Refeicao> {
  const { data: atualizada, error } = await supabase
    .from('refeicoes')
    .update(alteracoes)
    .eq('data', data)
    .eq('refeicao', refeicao)
    .select(refeicaoColumns)
    .single()

  if (error) throw error
  return atualizada
}

export async function upsertRefeicao(refeicao: Refeicao): Promise<Refeicao> {
  const { data, error } = await supabase
    .from('refeicoes')
    .upsert(refeicao, { onConflict: 'user_id,data,refeicao' })
    .select(refeicaoColumns)
    .single()

  if (error) throw error
  return data
}

export async function excluirRefeicao(data: string, refeicao: string): Promise<void> {
  const { data: excluida, error } = await supabase
    .from('refeicoes')
    .delete()
    .eq('data', data)
    .eq('refeicao', refeicao)
    .select('data,refeicao')
    .single()

  if (error) throw error
  if (!excluida) throw new Error('A refeição não foi encontrada para exclusão.')
}
