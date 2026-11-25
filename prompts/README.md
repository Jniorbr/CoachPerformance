# Prompts usados com IA (Aula 04)

Cada arquivo segue o formato CTQ do professor (**C**ontexto, **T**arefa, **Q**uem, **F**ormato). Foram usados no Claude, com acesso ao repositório e ao Supabase do projeto.

| Arquivo | Passo do cronograma |
|---|---|
| `01-componentes-base.md` | Passo 1: Button, Input, Card, Badge (+ estados) |
| `02-telas.md` | Passos 2 a 5: as 4 telas |
| `03-estados-e-erros.md` | Estados de UI e tratamento de erros |
| `04-testes.md` | Verificação do comportamento |

## Revisão crítica (checklist do slide 20)

Preencher com suas palavras depois de ler o código. Pontos que merecem atenção, porque são "não óbvios":

- **`useConsulta`:** por que existe um contador `pedido` (evita que uma resposta lenta e antiga sobrescreva a nova) e por que o `useEffect` devolve uma função de limpeza.
- **Refs de função:** `buscarRef` guarda a versão mais recente da função sem disparar o efeito de novo.
- **`<dialog>` no `Modal`:** o navegador cuida de foco, Esc e camada acima da página.
- **`key={tela}` no `ErrorBoundary`:** força a tela a recomeçar (e buscar dados) ao trocar de aba.
- **Ordenação:** `treinos_series.id` é `uuid`, então ordenar por `id` dá ordem aleatória; a ordenação correta é por `created_at`.
- **Validação duplicada de propósito:** o front usa as mesmas faixas do CHECK do banco só para dar feedback rápido; a garantia continua no banco.
