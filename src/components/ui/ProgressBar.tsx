interface ProgressBarProps {
  percentual: number
  rotulo: string
  /** 'claro' para fundo em gradiente; 'agua' para hidratação */
  tom?: 'claro' | 'agua'
}

export function ProgressBar({ percentual, rotulo, tom = 'claro' }: ProgressBarProps) {
  const valor = Math.max(0, Math.min(100, Math.round(percentual)))
  const trilho = tom === 'claro' ? 'bg-white/30' : 'bg-soft'
  const barra = tom === 'claro' ? 'bg-white' : 'bg-linear-to-r from-cyan-500 to-primary'
  return (
    <div
      role="progressbar"
      aria-label={rotulo}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={valor}
      className={`h-2.5 overflow-hidden rounded-full ${trilho}`}
    >
      <div className={`h-full rounded-full transition-[width] ${barra}`} style={{ width: `${valor}%` }} />
    </div>
  )
}
