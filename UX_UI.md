# Protótipo UX/UI — Coach

Este documento registra os entregáveis do Exercício 02 da Aula 02. O protótipo é uma aplicação pessoal de navegador, com dados guardados localmente no dispositivo.

## 1. Mapa de telas e fluxo

```text
Início (dashboard)
├── Treino
│   ├── escolher divisão
│   └── exercício → registrar/remover série → voltar
├── Nutrição
│   └── refeição → registrar ou marcar que não comeu → voltar
├── Histórico
└── Ações rápidas no dashboard
    ├── horário de sono
    ├── cardio
    └── hidratação
```

O fluxo principal parte do resumo do dia. Os quatro destinos de primeiro nível são Início, Treino, Nutrição e Histórico; formulários curtos aparecem como diálogos sobre a tela atual, sem interromper a navegação principal.

| Etapa | Necessidade | Fricção provável | Resposta do protótipo |
|---|---|---|---|
| Abrir Início | Entender o que está planejado hoje | Informação espalhada | Resumo do treino, refeições e hábitos no mesmo lugar |
| Registrar treino | Anotar uma série sem interromper muito o treino | Formulários longos e teclado | Carga e repetições em campos diretos |
| Registrar refeição | Lembrar o que comeu | Registrar tudo em detalhe toma tempo | Texto livre e opção de marcar que não comeu |
| Consultar histórico | Lembrar o que já registrou | Datas sem dados podem parecer “zero” | Histórico lista apenas dias com alguma atividade registrada |

## 2. Wireframes lo-fi

Os esboços abaixo são wireframes textuais: priorizam hierarquia e fluxo, não estilo visual.

### Tela 1 — Início

```text
┌─────────────────────────────────────┐
│ Coach                       Local   │
├────────┬────────┬────────┬──────────┤
│ Início │ Treino │Nutrição│ Histórico│
├─────────────────────────────────────┤
│ Hoje · divisão do treino            │
│ Estado do treino        [Concluir]  │
│ Progresso de exercícios             │
├─────────────────────────────────────┤
│ Refeições do dia (atalhos)          │
├──────────────────┬──────────────────┤
│ Sono              │ Cardio           │
├──────────────────┴──────────────────┤
│ Hidratação             [+250] [+500] │
└─────────────────────────────────────┘
```

### Tela 2 — Treino

```text
┌─────────────────────────────────────┐
│ Navegação principal                 │
├─────────────────────────────────────┤
│ [Push] [Pull] [Quadríceps] [...]    │
├─────────────────────────────────────┤
│ Exercício · alvo           séries   │
│ Exercício · alvo           séries   │
│ Exercício · alvo           séries   │
└─────────────────────────────────────┘
  → exercício → carga/repetições → salvar
```

### Tela 3 — Nutrição

```text
┌─────────────────────────────────────┐
│ Navegação principal                 │
├─────────────────────────────────────┤
│ Nutrição de hoje · progresso        │
├─────────────────────────────────────┤
│ Café da manhã       estado/resumo   │
│ Almoço              estado/resumo   │
│ Lanche              estado/resumo   │
│ Jantar              estado/resumo   │
└─────────────────────────────────────┘
  → refeição → descrição → salvar/pular
```

### Tela 4 — Histórico

```text
┌─────────────────────────────────────┐
│ Navegação principal                 │
├─────────────────────────────────────┤
│ Últimos registros                   │
│ Resumo do período                   │
│ Data · divisão · estado · refeições│
│ Data · divisão · estado · refeições│
│ ...                                 │
└─────────────────────────────────────┘
```

## 3. Tokens visuais

| Token | Valor | Uso |
|---|---|---|
| Fundo | `#f5f3ff` | Fundo geral |
| Superfície | `#ffffff` | Cartões e diálogos |
| Superfície suave | `#efedfa` | Áreas secundárias |
| Texto principal | `#201d31` | Títulos e conteúdo |
| Texto secundário | `#625e75` | Dicas e metadados |
| Primária | `#5938db` | Ações e destaque |
| Secundária | `#006b8e` | Gradientes de destaque |
| Verde | `#237b4b` / `#e5f5eb` | Registro concluído |
| Laranja | `#a45b08` / `#fff1dc` | Pendente/atenção |
| Tipografia | `system-ui`, sans-serif | Interface |
| Escala | 11, 12, 13, 15, 18, 22, 23 px | Metadados a títulos |
| Espaçamento | 7, 8, 10, 12, 16, 18, 22 px | Ritmo e agrupamento |
| Cantos | 10, 11, 13, 14, 18, 22 px | Botões, cartões, diálogos |
| Elevação | `0 8px 26px #30205d0c` | Cartões |

Contraste verificado para pares de texto/controles principais: texto secundário contra superfícies claras (mínimo 5,38:1), texto branco nas cores primária e secundária (6,97:1 e 6,01:1) e texto dos estados verde/laranja (mínimo 4,63:1). A validação não substitui testes com usuários e tecnologias assistivas.

## 4. Telas hi-fi e navegação

As telas de alta fidelidade estão implementadas no app carregado por Vite, com navegação funcional entre Início, Treino, Nutrição e Histórico e acesso por e-mail e senha. Sono, cardio, refeição e série usam formulários contextuais; eles mantêm o usuário dentro da tela e oferecem cancelar/fechar. Layout responsivo, foco visível, rótulos de formulário e estados vazios fazem parte da implementação.

## 5. Avaliação heurística

Revisão qualitativa com cinco heurísticas: visibilidade do estado; correspondência com o mundo real; controle e liberdade; consistência e padrões; prevenção de erros. “Parcial” indica oportunidade não crítica para uma próxima iteração.

### Início

| Heurística | Resultado e evidência |
|---|---|
| Visibilidade do estado | Atende: conclusão do treino, progresso, refeições, cardio e água refletem os registros. |
| Correspondência com o mundo real | Atende: usa termos cotidianos, horários, carga, repetições e mililitros. |
| Controle e liberdade | Atende: permite desfazer conclusão, ajustar água e cancelar formulários. |
| Consistência e padrões | Atende: navegação, cartões, botões e diálogos mantêm o mesmo padrão visual. |
| Prevenção de erros | Parcial: o volume de água é limitado e a conclusão é reversível; não há confirmação antes de marcar como concluído. |

### Treino

| Heurística | Resultado e evidência |
|---|---|
| Visibilidade do estado | Atende: mostra alvo, última série e quantidade de séries registradas. |
| Correspondência com o mundo real | Atende: carga em kg e repetições correspondem ao vocabulário de treino. |
| Controle e liberdade | Parcial: é possível remover uma série, mas a remoção não tem desfazer. |
| Consistência e padrões | Atende: seletores de divisão, cartões e diálogos seguem os padrões comuns do app. |
| Prevenção de erros | Atende: carga não negativa, repetições inteiras positivas e validação no formulário. |

### Nutrição

| Heurística | Resultado e evidência |
|---|---|
| Visibilidade do estado | Atende: progresso e cada refeição distinguem registrada, pendente e não consumida. |
| Correspondência com o mundo real | Atende: refeições usam nomes familiares e aceitam descrição livre. |
| Controle e liberdade | Atende: é possível editar o texto, pular ou cancelar o registro. |
| Consistência e padrões | Atende: cartões e diálogos mantêm os padrões das outras telas. |
| Prevenção de erros | Atende: texto tem limite de tamanho e pular uma refeição não apaga as demais. |

### Histórico

| Heurística | Resultado e evidência |
|---|---|
| Visibilidade do estado | Atende: lista data, divisão, refeições e estado do treino por dia. |
| Correspondência com o mundo real | Atende: apresenta datas e nomes de divisões legíveis. |
| Controle e liberdade | Parcial: nesta primeira versão, o histórico é somente leitura; não há edição retroativa. |
| Consistência e padrões | Atende: navegação e apresentação dos registros seguem os cartões do app. |
| Prevenção de erros | Atende: a tela não oferece ações destrutivas sobre registros anteriores. |

## 6. Limites conhecidos

- Séries e refeições ficam no Supabase e exigem autenticação/RLS; sono, hidratação, cardio e conclusão do treino continuam no `localStorage` deste navegador e podem ser apagados ao limpar os dados do site. Esses hábitos locais não sincronizam entre dispositivos.
- O histórico lista até 30 dias com atividade, combinando dados remotos de séries/refeições com hábitos locais.
- O protótipo não implementa gráficos, macros, envio de fotos ou recomendações.
- A revisão heurística é uma autoavaliação inicial; testes com usuários e verificação de contraste/teclado em dispositivos reais ainda são necessários.
