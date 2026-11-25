# 04 · Verificação do comportamento

Seguindo o passo 5 do slide 18 ("valide a solução: teste antes de aceitar").

```
# CONTEXTO
Telas React do Coach com data.ts simulado (vi.mock). Testing Library + Vitest + jsdom.

# TAREFA
Para cada tela, teste: loading, sucesso, vazio e erro (com retry que recupera). Nos formulários, teste que dado
inválido mostra mensagem e NÃO chama o banco, e que falha ao salvar mantém os campos. Teste que o formato
antigo do localStorage continua sendo lido.

# QUEM
Engenheiro de qualidade front-end.

# FORMATO
Arquivos *.test.tsx em src/screens, sem depender do dia da semana.
```

Observação do processo: o primeiro teste falhou porque assumia a aba Push; hoje (terça) o app abre em Pull. O app estava certo e o teste foi corrigido.
