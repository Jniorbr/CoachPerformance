# 03 · Estados de UI e tratamento de erros

```
# CONTEXTO
Toda chamada ao Supabase pode estar em quatro estados: loading, success, empty, error.

# TAREFA
Crie o hook useConsulta(buscar, acao, ehVazio, chave) que devolve { status, dados, erro, recarregar,
tentarNovamente }. Ignore respostas antigas (corrida entre requisições). Crie mensagemDeErro(erro, acao)
que traduz rede, JWT expirado (PGRST301) e RLS (42501) em texto claro e manda o erro técnico só para o console.
Adicione ErrorBoundary em volta de cada tela e na raiz.

# QUEM
Desenvolvedor front-end sênior focado em resiliência.

# FORMATO
src/hooks/useConsulta.ts, src/lib/erros.ts e src/components/ui/ErrorBoundary.tsx.
```
