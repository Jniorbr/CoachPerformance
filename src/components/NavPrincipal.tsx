export type Tela = 'inicio' | 'treino' | 'nutricao' | 'historico'

const ITENS: { id: Tela; icone: string; rotulo: string }[] = [
  { id: 'inicio', icone: '🏠', rotulo: 'Início' },
  { id: 'treino', icone: '🏋️', rotulo: 'Treino' },
  { id: 'nutricao', icone: '🍽️', rotulo: 'Nutrição' },
  { id: 'historico', icone: '📅', rotulo: 'Histórico' }
]

export function NavPrincipal({ ativa, onNavegar }: { ativa: Tela; onNavegar: (tela: Tela) => void }) {
  return (
    <nav aria-label="Navegação" className="grid grid-cols-4 gap-2">
      {ITENS.map((item) => {
        const ativo = item.id === ativa
        return (
          <button
            key={item.id}
            type="button"
            aria-current={ativo ? 'page' : undefined}
            onClick={() => onNavegar(item.id)}
            className={[
              'cursor-pointer rounded-2xl border px-1 py-2.5 text-xs font-semibold transition',
              'focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary',
              ativo
                ? 'border-transparent bg-linear-to-br from-primary to-accent text-white'
                : 'border-line bg-surface text-muted hover:border-primary'
            ].join(' ')}
          >
            <span aria-hidden="true" className="block text-xl leading-tight">{item.icone}</span>
            {item.rotulo}
          </button>
        )
      })}
    </nav>
  )
}
