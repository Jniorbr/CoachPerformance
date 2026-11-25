import { useState } from 'react'
import type { FormEvent } from 'react'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { Modal } from './ui/Modal'

interface SonoModalProps {
  atual: string
  onSalvar: (horario: string) => void
  onFechar: () => void
}

export function SonoModal({ atual, onSalvar, onFechar }: SonoModalProps) {
  const [horario, setHorario] = useState(atual)
  const [erro, setErro] = useState('')

  function enviar(evento: FormEvent) {
    evento.preventDefault()
    if (!/^\d{2}:\d{2}$/.test(horario)) {
      setErro('Informe um horário válido')
      return
    }
    onSalvar(horario)
    onFechar()
  }

  return (
    <Modal titulo="Horário de dormir" onFechar={onFechar}>
      <form onSubmit={enviar} noValidate className="grid gap-3">
        <Input
          label="Horário previsto"
          type="time"
          value={horario}
          onChange={(e) => setHorario(e.target.value)}
          erro={erro}
        />
        <Button type="submit" fullWidth>Salvar horário</Button>
      </form>
    </Modal>
  )
}
