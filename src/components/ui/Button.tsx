import type { ButtonHTMLAttributes } from 'react'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: 'md' | 'sm'
  fullWidth?: boolean
}

const variantes: Record<ButtonVariant, string> = {
  primary: 'border-transparent bg-linear-to-br from-primary to-accent text-white hover:brightness-95',
  secondary: 'border-line bg-soft text-ink hover:bg-line/60',
  ghost: 'border-transparent bg-transparent text-primary hover:bg-soft',
  danger: 'border-danger-line bg-danger-soft text-danger hover:bg-danger-line/50'
}

const tamanhos = {
  md: 'px-4 py-2.5 text-sm',
  sm: 'px-3 py-2 text-xs'
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  type = 'button',
  ...resto
}: ButtonProps) {
  return (
    <button
      type={type}
      className={[
        'cursor-pointer rounded-xl border font-bold transition',
        'focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary',
        'disabled:cursor-not-allowed disabled:opacity-60',
        variantes[variant],
        tamanhos[size],
        fullWidth ? 'w-full' : '',
        className
      ].join(' ')}
      {...resto}
    />
  )
}
