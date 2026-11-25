import type { ButtonHTMLAttributes, ElementType, ReactNode } from 'react'

interface CardProps {
  as?: ElementType
  /** Versão em destaque (gradiente), usada nos "heróis" das telas */
  destaque?: boolean
  className?: string
  children: ReactNode
}

export function Card({ as: Tag = 'section', destaque = false, className = '', children }: CardProps) {
  const visual = destaque
    ? 'border-transparent bg-linear-to-br from-primary to-accent text-white'
    : 'border-line bg-surface text-ink'
  return (
    <Tag className={`rounded-2xl border p-4 shadow-sm ${visual} ${className}`}>{children}</Tag>
  )
}

/** Card inteiro clicável: um <button> de verdade (teclado e leitor de tela). */
export function CardButton({
  className = '',
  type = 'button',
  ...resto
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      className={[
        'w-full cursor-pointer rounded-2xl border border-line bg-surface p-4 text-left text-ink shadow-sm',
        'transition hover:border-primary hover:shadow-md',
        'focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary',
        className
      ].join(' ')}
      {...resto}
    />
  )
}
