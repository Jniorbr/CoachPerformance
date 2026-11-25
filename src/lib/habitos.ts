// Hábitos que ainda NÃO vão para o banco: conclusão do treino, hidratação,
// horário de sono e cardio. Continuam no localStorage, no MESMO formato
// (chave e campos) do app antigo, para não perder o que já foi salvo.
import { divisaoDoDia } from './plano'

const STORAGE_KEY = 'coach-performance:v1'
export const SONO_PADRAO = '22:30'

export interface Cardio {
  type: string
  minutes: number
}

export interface HabitosDia {
  workoutDone: boolean
  water: number
  sleepTime: string
  cardio: Cardio | null
}

export type MapaHabitos = Record<string, HabitosDia>

export const HABITOS_PADRAO: HabitosDia = {
  workoutDone: false,
  water: 0,
  sleepTime: SONO_PADRAO,
  cardio: null
}

export interface ResultadoLeitura {
  dias: MapaHabitos
  erro: string
  bloqueado: boolean
}

function ehObjeto(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === 'object' && valor !== null && !Array.isArray(valor)
}

function lerDia(bruto: unknown): HabitosDia {
  const r = ehObjeto(bruto) ? bruto : {}
  const cardio = ehObjeto(r.cardio) && typeof r.cardio.type === 'string' &&
    typeof r.cardio.minutes === 'number' && Number.isFinite(r.cardio.minutes)
    ? { type: r.cardio.type, minutes: r.cardio.minutes }
    : null
  return {
    workoutDone: r.workoutDone === true,
    water: typeof r.water === 'number' && Number.isFinite(r.water)
      ? Math.max(0, Math.min(9999, r.water))
      : 0,
    sleepTime: typeof r.sleepTime === 'string' && /^\d{2}:\d{2}$/.test(r.sleepTime)
      ? r.sleepTime
      : SONO_PADRAO,
    cardio
  }
}

export function carregarHabitos(): ResultadoLeitura {
  try {
    const salvo = localStorage.getItem(STORAGE_KEY)
    if (!salvo) return { dias: {}, erro: '', bloqueado: false }
    const lido: unknown = JSON.parse(salvo)
    if (!ehObjeto(lido) || !ehObjeto(lido.days)) throw new Error('Formato de dados inválido.')
    const dias: MapaHabitos = {}
    for (const [chave, bruto] of Object.entries(lido.days)) dias[chave] = lerDia(bruto)
    return { dias, erro: '', bloqueado: false }
  } catch {
    // Mesmo comportamento do app antigo: não sobrescreve dados ilegíveis.
    return {
      dias: {},
      erro: 'Os dados salvos neste navegador não puderam ser lidos e não serão sobrescritos. Limpe os dados do site apenas se quiser recomeçar.',
      bloqueado: true
    }
  }
}

/** Devolve '' se salvou, ou a mensagem de erro. */
export function salvarHabitos(dias: MapaHabitos): string {
  try {
    const dados: Record<string, unknown> = {}
    for (const [chave, dia] of Object.entries(dias)) {
      dados[chave] = { date: chave, division: divisaoDoDia(chave), ...dia }
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ days: dados }))
    return ''
  } catch {
    return 'Não foi possível salvar neste navegador. Verifique o espaço disponível e as permissões de armazenamento.'
  }
}

export function temAtividadeLocal(dia: HabitosDia): boolean {
  return dia.workoutDone || dia.water > 0 || dia.cardio !== null || dia.sleepTime !== SONO_PADRAO
}
