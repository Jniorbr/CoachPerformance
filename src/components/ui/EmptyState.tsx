import type { ReactNode } from 'react'

interface EmptyStateProps {
  icone?: string
  titulo: string
  descricao?: string
  /** CTA opcional (estado vazio é oportunidade de onboarding) */
  acao?: ReactNode
}

export function EmptyState({ icone = '🗒️', titulo, descricao, acao }: EmptyStateProps) {
  return (
    <div className="grid justify-items-center gap-2 rounded-2xl border border-dashed border-line bg-surface px-4 py-8 text-center">
      <span aria-hidden="true" className="text-3xl">{icone}</span>
      <p className="font-semibold text-ink">{titulo}</p>
      {descricao && <p className="max-w-sm text-sm text-muted">{descricao}</p>}
      {acao}
    </div>
  )
}
