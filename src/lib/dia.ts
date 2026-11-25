// Junta as duas consultas (séries + refeições) que as telas usam sempre juntas.
import {
  listarRefeicoesNoPeriodo,
  listarRefeicoesPorData,
  listarSeriesNoPeriodo,
  listarSeriesPorData
} from './data'
import type { Refeicao, TreinoSerie } from './data'

export interface DadosDia {
  series: TreinoSerie[]
  refeicoes: Refeicao[]
}

export async function carregarDia(data: string): Promise<DadosDia> {
  const [series, refeicoes] = await Promise.all([
    listarSeriesPorData(data),
    listarRefeicoesPorData(data)
  ])
  return { series, refeicoes }
}

export async function carregarPeriodo(inicio: string, fim: string): Promise<DadosDia> {
  const [series, refeicoes] = await Promise.all([
    listarSeriesNoPeriodo(inicio, fim),
    listarRefeicoesNoPeriodo(inicio, fim)
  ])
  return { series, refeicoes }
}
