import { useState } from 'react'
import type { FormEvent } from 'react'
import { upsertRefeicao } from '../lib/data'
import type { Refeicao } from '../lib/data'
import { hoje } from '../lib/datas'
import { mensagemDeErro } from '../lib/erros'
import type { DefinicaoRefeicao } from '../lib/plano'
import { Button } from './ui/Button'
import { Textarea } from './ui/Input'
import { Modal } from './ui/Modal'

const LIMITE = 1000 // igual ao CHECK do banco (char_length(descricao) <= 1000)

interface RefeicaoModalProps {
  refeicao: DefinicaoRefeicao
  atual: Refeicao | undefined
  onFechar: () => void
  onAlterou: () => void
}

export function RefeicaoModal({ refeicao, atual, onFechar, onAlterou }: RefeicaoModalProps) {
  const [texto, setTexto] = useState(atual?.status === 'done' ? atual.descricao : '')
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState('')

  async function gravar(status: 'done' | 'skipped') {
    setEnviando(true)
    setErro('')
    try {
      await upsertRefeicao({
        data: hoje(),
        refeicao: refeicao.id,
        status,
        descricao: status === 'done' ? texto.trim() : ''
      })
      onAlterou()
      onFechar()
    } catch (e) {
      setErro(mensagemDeErro(e, 'salvar a refeição'))
      setEnviando(false)
    }
  }

  function enviar(evento: FormEvent) {
    evento.preventDefault()
    void gravar('done')
  }

  return (
    <Modal titulo={`${refeicao.icone} ${refeicao.nome}`} onFechar={onFechar}>
      <form onSubmit={enviar} noValidate className="grid gap-3">
        <Textarea
          label="O que você comeu?"
          placeholder="Anote sua refeição"
          maxLength={LIMITE}
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          dica={`${texto.length}/${LIMITE} caracteres`}
        />
        {erro && (
          <p role="alert" className="rounded-xl border border-danger-line bg-danger-soft p-3 text-xs text-danger">
            {erro} O que você digitou foi mantido.
          </p>
        )}
        <div className="grid gap-2">
          <Button type="submit" disabled={enviando}>
            {enviando ? 'Salvando...' : 'Salvar refeição'}
          </Button>
          <Button variant="secondary" disabled={enviando} onClick={() => void gravar('skipped')}>
            Marcar como não comi
          </Button>
          <Button variant="ghost" onClick={onFechar}>Cancelar</Button>
        </div>
      </form>
    </Modal>
  )
}
