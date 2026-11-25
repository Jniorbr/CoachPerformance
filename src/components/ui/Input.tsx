import { useId } from 'react'
import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes
} from 'react'

interface CampoProps {
  label: string
  erro?: string
  dica?: ReactNode
}

const base =
  'w-full rounded-xl border bg-surface px-3 py-2.5 text-sm text-ink ' +
  'focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary'

function classes(erro?: string) {
  return `${base} ${erro ? 'border-danger' : 'border-line'}`
}

function Rodape({ id, erro, dica }: { id: string; erro?: string; dica?: ReactNode }) {
  if (erro) {
    return (
      <p id={id} role="alert" className="text-xs font-medium text-danger">
        {erro}
      </p>
    )
  }
  return dica ? (
    <p id={id} className="text-xs text-muted">
      {dica}
    </p>
  ) : null
}

/** Input controlado: o valor vem do state do pai, nunca do DOM. */
export function Input({
  label,
  erro,
  dica,
  className = '',
  ...resto
}: CampoProps & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId()
  return (
    <div className="grid gap-1.5">
      <label htmlFor={id} className="text-xs font-semibold text-muted">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={Boolean(erro)}
        aria-describedby={erro || dica ? `${id}-msg` : undefined}
        className={`${classes(erro)} ${className}`}
        {...resto}
      />
      <Rodape id={`${id}-msg`} erro={erro} dica={dica} />
    </div>
  )
}

export function Textarea({
  label,
  erro,
  dica,
  className = '',
  ...resto
}: CampoProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId()
  return (
    <div className="grid gap-1.5">
      <label htmlFor={id} className="text-xs font-semibold text-muted">
        {label}
      </label>
      <textarea
        id={id}
        aria-invalid={Boolean(erro)}
        aria-describedby={erro || dica ? `${id}-msg` : undefined}
        className={`${classes(erro)} min-h-24 resize-y ${className}`}
        {...resto}
      />
      <Rodape id={`${id}-msg`} erro={erro} dica={dica} />
    </div>
  )
}

export function Select({
  label,
  erro,
  dica,
  className = '',
  children,
  ...resto
}: CampoProps & SelectHTMLAttributes<HTMLSelectElement>) {
  const id = useId()
  return (
    <div className="grid gap-1.5">
      <label htmlFor={id} className="text-xs font-semibold text-muted">
        {label}
      </label>
      <select
        id={id}
        aria-invalid={Boolean(erro)}
        aria-describedby={erro || dica ? `${id}-msg` : undefined}
        className={`${classes(erro)} ${className}`}
        {...resto}
      >
        {children}
      </select>
      <Rodape id={`${id}-msg`} erro={erro} dica={dica} />
    </div>
  )
}
