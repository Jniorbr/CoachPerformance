import { dataDeChave } from './datas'

export type DivisaoId = 'push' | 'pull' | 'quadriceps' | 'posterior' | 'upper'
export type DivisaoDoDia = DivisaoId | 'descanso'
export type TipoRefeicao = 'cafe' | 'almoco' | 'lanche' | 'jantar'

export interface Exercicio {
  id: string
  nome: string
  alvo: string
  icone: string
}

export interface DefinicaoRefeicao {
  id: TipoRefeicao
  nome: string
  icone: string
}

export const DIVISOES: DivisaoId[] = ['push', 'pull', 'quadriceps', 'posterior', 'upper']

export const ROTULOS: Record<DivisaoDoDia, string> = {
  push: 'Push',
  pull: 'Pull',
  quadriceps: 'Quadríceps',
  posterior: 'Posterior e glúteo',
  upper: 'Upper',
  descanso: 'Descanso'
}

export const PLANO: Record<DivisaoId, Exercicio[]> = {
  push: [
    { id: 'push1', nome: 'Supino inclinado com halteres', alvo: '4 × 8–12', icone: '🏋️' },
    { id: 'push2', nome: 'Crucifixo na máquina', alvo: '3 × 10–12', icone: '💪' },
    { id: 'push3', nome: 'Supino na polia', alvo: '3 × 10–12', icone: '🏋️' },
    { id: 'push4', nome: 'Elevação lateral', alvo: '3 × 12–15', icone: '🙆' },
    { id: 'push5', nome: 'Tríceps na polia', alvo: '3 × 10–12', icone: '💪' }
  ],
  pull: [
    { id: 'pull1', nome: 'Puxada na máquina', alvo: '4 × 8–12', icone: '🧗' },
    { id: 'pull2', nome: 'Puxada fechada', alvo: '3 × 8–12', icone: '🧗' },
    { id: 'pull3', nome: 'Remada', alvo: '3 × 8–12', icone: '🏋️' },
    { id: 'pull4', nome: 'Crucifixo inverso', alvo: '3 × 12–15', icone: '🙆' },
    { id: 'pull5', nome: 'Rosca bíceps', alvo: '3 × 10–12', icone: '💪' }
  ],
  quadriceps: [
    { id: 'quad1', nome: 'Agachamento no hack', alvo: '4 × 8–12', icone: '🦵' },
    { id: 'quad2', nome: 'Cadeira extensora', alvo: '3 × 10–12', icone: '🦵' },
    { id: 'quad3', nome: 'Leg press', alvo: '3 × 10–12', icone: '🏋️' },
    { id: 'quad4', nome: 'Panturrilha', alvo: '4 × 12–15', icone: '🦵' }
  ],
  posterior: [
    { id: 'post1', nome: 'Levantamento terra romeno', alvo: '4 × 8–12', icone: '🏋️' },
    { id: 'post2', nome: 'Mesa flexora', alvo: '3 × 10–12', icone: '🦵' },
    { id: 'post3', nome: 'Elevação pélvica', alvo: '3 × 8–12', icone: '🍑' },
    { id: 'post4', nome: 'Abdutora', alvo: '3 × 12–15', icone: '🦵' }
  ],
  upper: [
    { id: 'upper1', nome: 'Supino reto', alvo: '3 × 8–12', icone: '🏋️' },
    { id: 'upper2', nome: 'Remada baixa', alvo: '3 × 8–12', icone: '🧗' },
    { id: 'upper3', nome: 'Desenvolvimento', alvo: '3 × 8–12', icone: '🙆' },
    { id: 'upper4', nome: 'Puxada alta', alvo: '3 × 8–12', icone: '🧗' },
    { id: 'upper5', nome: 'Braços', alvo: '3 × 10–12', icone: '💪' }
  ]
}

export const REFEICOES: DefinicaoRefeicao[] = [
  { id: 'cafe', nome: 'Café da manhã', icone: '☕' },
  { id: 'almoco', nome: 'Almoço', icone: '🍛' },
  { id: 'lanche', nome: 'Lanche', icone: '🍎' },
  { id: 'jantar', nome: 'Jantar', icone: '🍽️' }
]

export const TIPOS_CARDIO = ['Escada', 'Esteira', 'Bicicleta', 'Futsal', 'Outro']

// getDay(): 0 = domingo ... 6 = sábado
const DIVISAO_POR_DIA_DA_SEMANA: Record<number, DivisaoId> = {
  1: 'push',
  2: 'pull',
  3: 'quadriceps',
  4: 'upper',
  5: 'posterior'
}

export function divisaoDoDia(chave: string): DivisaoDoDia {
  return DIVISAO_POR_DIA_DA_SEMANA[dataDeChave(chave).getDay()] ?? 'descanso'
}
