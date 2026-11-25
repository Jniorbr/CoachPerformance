// Skeleton (slide 15: melhor que spinner para listas).
export function LoadingState({ linhas = 3, texto = 'Carregando...' }: { linhas?: number; texto?: string }) {
  return (
    <div role="status" aria-busy="true" className="grid gap-3">
      <span className="sr-only">{texto}</span>
      {Array.from({ length: linhas }, (_, i) => (
        <div
          key={i}
          aria-hidden="true"
          className="h-16 animate-pulse rounded-2xl border border-line bg-soft"
        />
      ))}
    </div>
  )
}
