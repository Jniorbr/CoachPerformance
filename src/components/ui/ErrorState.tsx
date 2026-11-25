import { Button } from './Button'

interface ErrorStateProps {
  mensagem: string
  onTentarNovamente?: () => void
}

export function ErrorState({ mensagem, onTentarNovamente }: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="grid justify-items-center gap-3 rounded-2xl border border-danger-line bg-danger-soft px-4 py-8 text-center"
    >
      <span aria-hidden="true" className="text-3xl">⚠️</span>
      <p className="max-w-sm text-sm font-medium text-danger">{mensagem}</p>
      {onTentarNovamente && (
        <Button variant="secondary" size="sm" onClick={onTentarNovamente}>
          Tentar novamente
        </Button>
      )}
    </div>
  )
}
