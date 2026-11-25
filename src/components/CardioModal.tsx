import { useState } from 'react'
import type { FormEvent } from 'react'
import type { Cardio } from '../lib/habitos'
import { TIPOS_CARDIO } from '../lib/plano'
import { Button } from './ui/Button'
import { Input, Select } from './ui/Input'
import { Modal } from './ui/Modal'

interface CardioModalProps {
  atual: Cardio | null
  onSalvar: (cardio: Cardio) => void
  onRemover: () => void
  onFechar: () => void
}

export function CardioModal({ atual, onSalvar, onRemover, onFechar }: CardioModalProps) {
  const [tipo, setTipo] = useState(atual?.type ?? TIPOS_CARDIO[0])
  const [minutos, setMinutos] = useState(String(atual?.minutes ?? 30))
  const [erro, setErro] = useState('')

  function enviar(evento: FormEvent) {
    evento.preventDefault()
    const m = Number(minutos)
    if (minutos.trim() === '' || !Number.isInteger(m) || m < 1 || m > 600) {
      setErro('Informe de 1 a 600 minutos')
      return
    }
    onSalvar({ type: tipo, minutes: m })
    onFechar()
  }

  return (
    <Modal titulo="Registrar cardio" onFechar={onFechar}>
      <form onSubmit={enviar} noValidate className="grid gap-3">
        <Select label="Atividade" value={tipo} onChange={(e) => setTipo(e.target.value)}>
          {TIPOS_CARDIO.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </Select>
        <Input
          label="Duração (minutos)"
          type="number"
          inputMode="numeric"
          value={minutos}
          onChange={(e) => setMinutos(e.target.value)}
          erro={erro}
        />
        <div className="grid gap-2">
          <Button type="submit">Salvar cardio</Button>
          {atual && (
            <Button
              variant="danger"
              onClick={() => {
                onRemover()
                onFechar()
              }}
            >
              Remover cardio
            </Button>
          )}
          <Button variant="ghost" onClick={onFechar}>Cancelar</Button>
        </div>
      </form>
    </Modal>
  )
}
