import { useState } from 'react'
import type { FormEvent } from 'react'
import { excluirSerie, inserirSerie } from '../lib/data'
import type { TreinoSerie } from '../lib/data'
import { hoje } from '../lib/datas'
import { mensagemDeErro } from '../lib/erros'
import type { DivisaoId, Exercicio } from '../lib/plano'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { Modal } from './ui/Modal'

interface SerieModalProps {
  exercicio: Exercicio
  divisao: DivisaoId
  /** séries de hoje DESTE exercício, da mais antiga para a mais nova */
  series: TreinoSerie[]
  onFechar: () => void
  /** avisa a tela que o banco mudou (ela busca de novo) */
  onAlterou: () => void
}

interface Erros {
  carga?: string
  reps?: string
}

// UX (formato): faixas iguais às do banco (CHECK carga_kg >= 0, repeticoes 1..999,
// numeric(6,2)). O banco continua sendo a última linha de defesa.
function validar(carga: string, reps: string): Erros {
  const erros: Erros = {}
  const c = Number(carga)
  if (carga.trim() === '') erros.carga = 'Informe a carga'
  else if (!Number.isFinite(c)) erros.carga = 'Número inválido'
  else if (c < 0) erros.carga = 'A carga não pode ser negativa'
  else if (c > 9999.99) erros.carga = 'Máximo de 9999,99 kg'

  const r = Number(reps)
  if (reps.trim() === '') erros.reps = 'Informe as repetições'
  else if (!Number.isInteger(r)) erros.reps = 'Use um número inteiro'
  else if (r < 1 || r > 999) erros.reps = 'Entre 1 e 999'
  return erros
}

export function SerieModal({ exercicio, divisao, series, onFechar, onAlterou }: SerieModalProps) {
  const [carga, setCarga] = useState('')
  const [reps, setReps] = useState('')
  const [erros, setErros] = useState<Erros>({})
  const [enviando, setEnviando] = useState(false)
  const [removendo, setRemovendo] = useState<string | number | null>(null)
  const [erroEnvio, setErroEnvio] = useState('')

  async function salvar(evento: FormEvent) {
    evento.preventDefault()
    const encontrados = validar(carga, reps)
    setErros(encontrados)
    if (Object.keys(encontrados).length > 0) return

    setEnviando(true)
    setErroEnvio('')
    try {
      await inserirSerie({
        data: hoje(),
        divisao,
        exercicio_id: exercicio.id,
        exercicio_nome: exercicio.nome,
        carga_kg: Number(carga),
        repeticoes: Number(reps)
      })
      setCarga('')
      setReps('')
      onAlterou()
    } catch (e) {
      // os campos continuam preenchidos
      setErroEnvio(mensagemDeErro(e, 'salvar a série'))
    } finally {
      setEnviando(false)
    }
  }

  async function remover(serie: TreinoSerie) {
    setRemovendo(serie.id)
    setErroEnvio('')
    try {
      await excluirSerie(serie.id)
      onAlterou()
    } catch (e) {
      setErroEnvio(mensagemDeErro(e, 'excluir a série'))
    } finally {
      setRemovendo(null)
    }
  }

  return (
    <Modal titulo={exercicio.nome} onFechar={onFechar}>
      <p className="mb-3 text-xs text-muted">Alvo: {exercicio.alvo}</p>

      {series.length === 0 ? (
        <p className="text-sm text-muted">Ainda não há séries registradas.</p>
      ) : (
        <ul>
          {series.map((serie, i) => (
            <li
              key={serie.id}
              className="flex items-center justify-between gap-2 border-b border-line py-2 text-sm"
            >
              <span>
                Série {i + 1} · {serie.carga_kg} kg × {serie.repeticoes}
              </span>
              <Button
                variant="danger"
                size="sm"
                disabled={removendo === serie.id}
                onClick={() => void remover(serie)}
              >
                {removendo === serie.id ? 'Removendo...' : 'Remover'}
              </Button>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={(e) => void salvar(e)} noValidate className="mt-5 grid gap-3">
        <h3 className="text-sm font-bold">Adicionar série</h3>
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Carga (kg)"
            type="number"
            inputMode="decimal"
            step="0.5"
            value={carga}
            onChange={(e) => setCarga(e.target.value)}
            erro={erros.carga}
          />
          <Input
            label="Repetições"
            type="number"
            inputMode="numeric"
            step="1"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            erro={erros.reps}
          />
        </div>
        {erroEnvio && (
          <p role="alert" className="rounded-xl border border-danger-line bg-danger-soft p-3 text-xs text-danger">
            {erroEnvio} Os dados preenchidos foram mantidos.
          </p>
        )}
        <div className="grid gap-2">
          <Button type="submit" disabled={enviando}>
            {enviando ? 'Salvando...' : 'Salvar série'}
          </Button>
          <Button variant="secondary" onClick={onFechar}>Fechar</Button>
        </div>
      </form>
    </Modal>
  )
}
