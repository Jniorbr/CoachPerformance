import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'

interface ModalProps {
  titulo: string
  onFechar: () => void
  children: ReactNode
}

/**
 * Usa o <dialog> nativo: o navegador cuida do foco preso dentro do diálogo,
 * da tecla Esc e da camada acima da página.
 */
export function Modal({ titulo, onFechar, children }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialogo = ref.current
    if (dialogo && !dialogo.open) dialogo.showModal()
    return () => dialogo?.close()
  }, [])

  return (
    <dialog
      ref={ref}
      aria-label={titulo}
      onClose={onFechar}
      onClick={(e) => {
        // clique no fundo escuro (o próprio <dialog>) fecha
        if (e.target === ref.current) onFechar()
      }}
      className="m-auto max-h-[88vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-bg p-5 text-ink backdrop:bg-black/50 max-sm:mt-auto max-sm:mb-0 max-sm:max-w-full max-sm:rounded-b-none"
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold">{titulo}</h2>
        <button
          type="button"
          aria-label="Fechar"
          onClick={onFechar}
          className="size-9 cursor-pointer rounded-full border border-line bg-surface text-lg text-muted focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          ×
        </button>
      </div>
      {children}
    </dialog>
  )
}
