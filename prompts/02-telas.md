# 02 · As 4 telas

Mapeamento do exemplo do professor (Serena) para o Coach: lista com SELECT = **Histórico**; cadastro com INSERT = **Treino**; formulário com select + INSERT = **Nutrição**; agenda do dia = **Início**.

```
# CONTEXTO
O Coach já funciona com Supabase (auth, RLS, tabelas treinos_series e refeicoes). A camada de dados é
src/lib/data.ts (inserirSerie, excluirSerie, listarSeriesPorData, upsertRefeicao, listarRefeicoesNoPeriodo...).
A UI antiga era src/app.js (JS puro, 773 linhas); sono, hidratação, cardio e conclusão do treino ficam no
localStorage (chave coach-performance:v1) e não podem perder os dados já salvos.

# TAREFA
Recrie Início, Treino, Nutrição e Histórico como componentes React + Tailwind, com a MESMA função das telas
antigas, usando os componentes de src/components/ui. Cada tela trata loading, vazio (quando fizer sentido),
erro com "Tentar novamente" e sucesso. Formulários controlados, com validação no front (mesmas faixas do
CHECK do banco) e mensagem ao lado do campo. Data enviada ao banco = data local do dispositivo.
Grid responsivo: 1 coluna no celular, 2 no tablet, 3 no desktop.

# QUEM
Desenvolvedor front-end sênior, mantendo o código simples (sem biblioteca de estado global).

# FORMATO
screens/*.tsx e components/*Modal.tsx em TypeScript. Não alterar src/lib/data.ts, exceto bug comprovado.
```
