# Dashboard Fitness e Saúde — Documento consolidado do MVP

## Rodar o aplicativo

1. Instale as dependências com `npm install`.
2. Copie `.env.example` para `.env` e preencha `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` com os valores públicos do projeto Supabase. Não use a chave `service_role`.
3. Inicie o servidor local com `npm run dev`. Para rodar os testes: `npm test`. Para gerar o build de produção: `npm run build`.

O aplicativo usa Vite, React 19, Tailwind 4 e Supabase Auth. Séries de treino e refeições são armazenadas no Supabase; sono, hidratação, cardio e conclusão do treino continuam no `localStorage` deste navegador.

> Natureza do documento: este material reúne as personas, as entrevistas simuladas e os requisitos do MVP em um único arquivo. As hipóteses foram geradas por IA e precisam de validação humana com entrevistas reais (3–5 usuários) antes de qualquer implementação definitiva.

---

## 01 · Contexto e objetivo

Pessoas que treinam musculação costumam registrar treino, alimentação e sono em lugares diferentes — aplicativo da academia, relógio, anotações, planilhas ou até apenas na memória — e isso gera dificuldade para perceber evolução e manter consistência. A análise das entrevistas simuladas sugere que o principal obstáculo não é apenas a falta de visualização, mas o esforço de registrar dados com baixo atrito.

O MVP proposto é um sistema web mobile-first para registrar treino, refeição e sono em poucos toques e mostrar um resumo semanal, além de histórico de evolução. O escopo é intencionalmente enxuto: não há integração com smartwatch ou aplicativos externos; dado de saúde segue o tratamento sensível exigido pela LGPD; e a solução prioriza viabilidade de construção em um curto prazo.

---

## 02 · Personas

### Persona 01 — Mariana Costa

- Idade: 27 anos
- Profissão: Analista de Marketing
- Cidade: São Paulo, SP
- Perfil: fitness consistente
- Familiaridade com tecnologia: alta

Perfil e comportamento
- Treina musculação cinco vezes por semana.
- Busca melhorar a composição corporal e acompanhar alimentação com disciplina.
- Usa aplicativos de treino, relógio inteligente e, às vezes, apps de calorias.

Dor principal
> “Tenho meus dados espalhados em vários aplicativos, mas não consigo entender se realmente estou evoluindo.”

- Treino em um app.
- Alimentação em outro.
- Sono no smartwatch.
- Dificuldade para relacionar alimentação, descanso e desempenho.
- Necessidade de consultar múltiplas plataformas para avaliar progresso.

Métrica de sucesso
- Consistência semanal de treinos: percentual de treinos realizados em relação ao planejado.

### Persona 02 — Rafael Mendes

- Idade: 35 anos
- Profissão: Supervisor de Logística
- Cidade: Curitiba, PR
- Perfil: rotina corrida
- Familiaridade com tecnologia: média/alta

Perfil e comportamento
- Trabalha em rotina exigente e tenta manter hábitos saudáveis.
- Treina três vezes por semana, busca perder gordura corporal e melhorar disposição.
- Não tem disciplina regular para registrar detalhes da rotina.

Dor principal
> “Eu até tento acompanhar minha saúde, mas registrar tudo em vários lugares acaba sendo trabalhoso demais.”

- Esquece de registrar refeições e treinos.
- Não possui histórico organizado de sono e alimentação.
- Dificuldade para visualizar evolução ao longo dos meses.
- Prefere interfaces simples e objetivas.

Métrica de sucesso
- Taxa de registro diário: percentual de dias em que o usuário registra pelo menos as informações essenciais.

### Persona 03 — Lucas Ferreira

- Idade: 20 anos
- Profissão: Estudante universitário
- Cidade: Lages, SC
- Perfil: iniciante fitness
- Familiaridade com tecnologia: alta

Perfil e comportamento
- Começou a treinar há quatro meses.
- Deseja ganhar massa muscular, melhorar aparência física e construir hábitos.
- Consome conteúdos de fitness nas redes sociais, mas ainda entende pouco sobre organização de evolução.

Dor principal
> “Não sei se estou fazendo as coisas corretamente ou se realmente estou evoluindo.”

- Histórico pouco estruturado de treino.
- Dificuldade para entender pequeno progresso.
- Falta de clareza na relação entre sono, treino e recuperação.
- Depende de anotações, redes sociais e apps dispersos.

Métrica de sucesso
- Evolução mensal de desempenho: aumento de carga ou repetições ao longo do tempo.

### Comparativo das personas

| Persona | Dor principal | Tecnologia | Métrica |
|---|---|---|---|
| Mariana Costa | Dados fragmentados e dificuldade de relacionar indicadores | Alta | Consistência semanal de treinos |
| Rafael Mendes | Registro trabalhoso e falta de tempo | Média/alta | Taxa de registro diário |
| Lucas Ferreira | Falta de orientação e dificuldade de perceber evolução | Alta | Evolução mensal de desempenho |

### Implicações para UX/UI do MVP

1. Dashboard centralizado
   - Consolidar treino, alimentação, sono e evolução em uma única visão.

2. Registro rápido
   - Permitir registrar informações com poucos passos, especialmente para usuários com rotina corrida.

3. Visualização de evolução
   - Transformar registros em indicadores compreensíveis, gráficos e comparações temporais.

### Direcionamento do produto

Para o MVP, recomendação de priorização:
- Dashboard inicial com resumo diário e semanal de treino, alimentação e sono.
- Registro simplificado com formulários curtos.
- Histórico por dia, semana e mês.
- Indicadores visuais de consistência e evolução.
- Experiência mobile-first.

---

## 03 · Pesquisa UX: entrevistas simuladas

> As entrevistas abaixo são simulações por IA, baseadas em personas hipotéticas. Não são evidências empíricas e servem como exercício de descoberta e preparação para pesquisa real.

### Entrevista simulada 01 — Mariana Costa

**Persona:** Mariana Costa, 27 anos, analista de marketing, São Paulo/SP  
**Contexto:** treina musculação cinco vezes por semana e acompanha alguns indicadores de saúde.

1. Como foi sua última semana de treino e cuidados com a saúde?
   - Mariana (simulada): “Treinei quatro vezes. Em alguns dias consegui seguir a alimentação que planejei, em outros não. Meu relógio registrou o sono, mas não olhei os dados todos os dias. Normalmente só percebo como foi a semana quando chega o domingo.”

2. Como você costuma registrar ou lembrar dessas informações?
   - “O treino fica no aplicativo da academia. O sono está no relógio. Alimentação eu registro de vez em quando em um aplicativo de calorias, mas não tenho constância. Algumas coisas ficam só na minha cabeça.”

3. Quando foi a última vez que você quis consultar seu histórico? O que aconteceu?
   - “Queria entender se estava dormindo menos nos dias em que meu treino rendia pior. Consegui olhar o sono, mas comparar com o treino foi trabalhoso. Acabei fazendo uma comparação meio superficial.”

4. O que você faz quando não consegue registrar alguma informação?
   - “Geralmente deixo para depois e esqueço. Se for algo importante, tento lembrar aproximadamente. Não gosto de preencher tudo manualmente.”

5. O que você considera mais importante acompanhar? Por quê?
   - “Meu desempenho nos exercícios e a consistência. Peso também, mas não quero que ele seja o único indicador. Às vezes o peso não muda e eu sinto que estou evoluindo.”

6. Existe alguma informação que você não gostaria de registrar?
   - “Não gostaria de ter que registrar cada ingrediente ou cada detalhe do treino. Isso ficaria muito demorado. Também teria cuidado com dados pessoais e informações de saúde.”

7. O que faria você abandonar uma ferramenta de acompanhamento?
   - “Se ela exigisse muito tempo, se os dados não fossem confiáveis ou se eu não conseguisse entender o que os gráficos significam. Não usaria só porque tem muitas funcionalidades.”

Síntese
- Usa ferramentas diferentes e registra de forma irregular.
- Dificuldade: comparar dados de treino e sono exige esforço.
- Necessidade possível: consulta histórica simples e indicadores que façam sentido.
- Objeção relevante: registro detalhado demais e gráficos pouco interpretáveis.
- Hipótese: uma visão integrada pode facilitar comparações, desde que não aumente o trabalho de registro.

### Entrevista simulada 02 — Rafael Mendes

**Persona:** Rafael Mendes, 35 anos, supervisor de logística, Curitiba/PR  
**Contexto:** rotina profissional exigente e objetivo de melhorar condicionamento e composição corporal.

1. Como você encaixou atividade física e alimentação nos últimos sete dias?
   - “Consegui ir à academia duas vezes. Em um dia saí tarde do trabalho e não fui. Alimentação durante a semana depende bastante de onde estou e do tempo disponível.”

2. Você acompanha alguma informação sobre treino, alimentação ou sono? Como?
   - “Anoto algumas cargas no celular, mas não sempre. Sei mais ou menos quantas vezes fui à academia. Sono eu acompanho pelo horário em que vou dormir e acordo.”

3. Já tentou utilizar algum aplicativo para acompanhar sua rotina? Como foi?
   - “Já baixei um aplicativo de alimentação. No começo registrava tudo, depois parei. Precisava procurar os alimentos e colocar as quantidades. Era mais trabalhoso do que eu esperava.”

4. Quando você quer saber se está evoluindo, o que consulta?
   - “Olho o peso e como as roupas estão vestindo. Também percebo se estou conseguindo fazer os exercícios com mais facilidade. Não tenho um histórico muito organizado.”

5. O que normalmente impede você de registrar informações?
   - “Tempo e esquecimento. Se eu tiver que parar o que estou fazendo para preencher várias coisas, não vou manter isso por muito tempo.”

6. Que tipo de acompanhamento você considera dispensável?
   - “Não preciso saber cada detalhe do dia. Um resumo que me diga se estou mantendo uma rotina já seria útil. Não quero transformar isso em outra obrigação.”

7. O que faria você continuar usando um sistema de acompanhamento?
   - “Se fosse rápido, fácil de acessar e me mostrasse algo que eu não consigo perceber sozinho. Se só armazenasse dados, provavelmente não continuaria.”

Síntese
- Acompanhamento informal e registros esporádicos.
- Dificuldade: ferramentas anteriores exigiram esforço excessivo.
- Necessidade: acompanhamento básico com baixa fricção.
- Objeção: excesso de campos e sensação de obrigação.
- Hipótese: fluxo de registro rápido aumenta a continuidade do uso.

### Entrevista simulada 03 — Lucas Ferreira

**Persona:** Lucas Ferreira, 20 anos, estudante universitário, Lages/SC  
**Contexto:** iniciante na musculação, interessado em ganhar massa muscular e construir hábitos.

1. Como você organiza seus treinos atualmente?
   - “Sigo uma ficha que recebi na academia. Às vezes anoto as cargas no celular, mas também lembro de algumas. Quando esqueço, tento repetir o que fiz na última vez.”

2. Como você percebe se está evoluindo?
   - “Percebo quando consigo aumentar a carga ou fazer mais repetições. Também olho meu peso de vez em quando. Não sei muito bem como avaliar outras coisas.”

3. Já teve alguma dúvida sobre sua rotina que tentou resolver?
   - “Já fiquei em dúvida se estava comendo o suficiente ou descansando bem. Procurei vídeos e posts, mas cada pessoa fala uma coisa. Não sei sempre em quem confiar.”

4. O que você registra hoje e o que deixa de registrar?
   - “Registro algumas cargas e meu peso. Não registro alimentação nem sono. Acho que seria difícil lembrar de tudo no final do dia.”

5. Quando você consulta informações sobre fitness, o que procura?
   - “Normalmente procuro algo específico, como execução de exercício, alimentação para ganhar massa ou como melhorar determinado treino. Não costumo consultar um painel de dados.”

6. O que você gostaria de entender melhor sobre sua evolução?
   - “Gostaria de saber se estou aumentando meu desempenho e se minha rotina está consistente. Também seria interessante ver o histórico sem ter que procurar anotações antigas.”

7. O que faria um sistema parecer confuso ou pouco útil?
   - “Muitos números sem explicação. Se mostrar um gráfico, eu gostaria de entender o que ele representa e o que posso concluir. Também não quero receber recomendações que pareçam certezas sem explicar de onde vêm.”

Síntese
- Registros simples e busca de orientação em conteúdos externos.
- Dificuldade: falta de histórico e dificuldade de avaliar progresso.
- Necessidade: histórico de desempenho e indicadores explicados.
- Objeção: gráficos sem contexto e recomendações pouco confiáveis.
- Hipótese: visualização de evolução pode ajudar iniciantes a perceber progresso.

### Síntese transversal

| Tema | Mariana | Rafael | Lucas |
|---|---|---|---|
| Registro | Fragmentado | Irregular | Parcial |
| Principal dificuldade | Comparar indicadores | Tempo e esforço | Falta de histórico |
| Interesse | Relação entre treino e sono | Rotina e consistência | Evolução do desempenho |
| Risco de abandono | Registro complexo | Registro demorado | Informação confusa |
| Necessidade provável | Visão integrada | Simplicidade | Clareza e contexto |

### Insights e hipóteses

1. Registrar dados pode ser tão importante quanto visualizá-los.
2. Nem todos os usuários precisam acompanhar tudo; o sistema pode permitir acompanhamento básico e aprofundamento opcional.
3. Histórico e comparação podem ter mais valor que indicadores isolados.
4. A clareza dos gráficos importa.
5. A centralização não é suficiente; o usuário pode esperar interpretação, praticidade ou ajuda para perceber evolução.
6. Privacidade e controle dos dados devem ser considerados desde o início.

### Perguntas recomendadas para entrevistas reais

- Me conte como você acompanhou seu último treino.
- Como você lembra o que fez no treino anterior?
- Quando foi a última vez que tentou avaliar sua evolução?
- O que foi fácil ou difícil nesse processo?
- Já abandonou alguma ferramenta? O que aconteceu?
- Que informação você gostaria de consultar e não conseguiu?
- O que você não gostaria que uma ferramenta desse tipo exigisse?
- Como você decide se uma informação ou recomendação é confiável?

Evite perguntar inicialmente: “Você gostaria de um dashboard que centralizasse tudo?” Essa formulação apresenta a solução e pode induzir resposta positiva.

---

## 04 · Requisitos do MVP

### RF — Requisitos funcionais

| ID | Requisito | Persona |
|---|---|---|
| RF01 | O sistema deve permitir criar conta (e-mail e senha), entrar, sair e editar o nome do perfil. | Todas |
| RF02 | O sistema deve permitir registrar treino com data e tipo (obrigatórios) e, opcionalmente, exercícios com séries, repetições e carga. O registro pode ser editado e excluído. | Rafael, Lucas, Mariana |
| RF03 | O sistema deve permitir registrar refeição com data e descrição (obrigatórios) e quantidade (opcional). O registro pode ser editado e excluído. | Rafael, Lucas |
| RF04 | O sistema deve permitir registrar sono com data e duração em horas (obrigatórios) e qualidade de 1 a 5 (opcional). O registro pode ser editado e excluído. | Rafael, Mariana |
| RF05 | O sistema deve exibir um dashboard com resumo da semana ou do mês: número de treinos, dias com refeição registrada, média de horas de sono e taxa de registro diário. | Rafael, Mariana |
| RF06 | O sistema deve permitir consultar registros anteriores filtrando por tipo e período e exibir gráfico de evolução quando houver 2 ou mais registros. | Lucas, Mariana |

### RNF — Requisitos não funcionais

> Os valores são metas propostas; ajuste conforme cliente ou professor.

| ID | Requisito | Métrica / como verificar |
|---|---|---|
| RNF01 | Usabilidade e acessibilidade: registro mínimo de treino, refeição ou sono em poucos passos; contraste de cores nível AA. | Até 3 toques e 30 s a partir da tela inicial; verificação de contraste AA. |
| RNF02 | Responsividade (mobile-first): interface utilizável em celular, tablet e desktop. | Sem rolagem horizontal de 320 px a 1920 px; teste em 2 navegadores mobile e 1 desktop. |
| RNF03 | Segurança e privacidade (LGPD): dados de saúde protegidos e coleta apenas do necessário. | Senhas com hash; tráfego em HTTPS; usuário A não acessa registros do usuário B; chaves não expostas no client; consentimento no cadastro e opção de excluir conta e dados. |
| RNF04 | Desempenho: telas e registros sem atrasos perceptíveis. | Carregamento inicial < 2 s em 4G; salvar registro e atualizar lista < 1 s. |

---

## 05 · Histórias de usuário e critérios de aceite

### US-01 · Registrar treino realizado
- Como usuário com rotina corrida (persona: Rafael),
- quero registrar um treino com data e tipo em poucos toques,
- para manter meu histórico sem gastar tempo.
- Prioridade: MUST (MoSCoW) · Estimativa: 3 pontos · Depende de: RF01 · Relacionados: RF02, RNF01

Critérios de aceite
- [ ] AC1. Data e tipo de treino são obrigatórios; a data vem preenchida com hoje e não pode ser futura.
- [ ] AC2. Séries e repetições aceitam apenas inteiros positivos; carga aceita número maior ou igual a 0.
- [ ] AC3. É possível salvar um registro mínimo (data + tipo) em no máximo 3 toques a partir da tela inicial.
- [ ] AC4. Após salvar, o treino aparece no histórico do dia em menos de 1 s.
- [ ] AC5. Em erro de rede, é exibida mensagem clara e os dados preenchidos são mantidos.

### US-02 · Consultar resumo semanal no dashboard
- Como usuário que quer saber se está mantendo a rotina (persona: Rafael),
- quero ver um resumo da semana com treinos, alimentação e sono,
- para perceber minha consistência sem abrir vários aplicativos.
- Prioridade: MUST · Estimativa: 5 pontos · Depende de: US-01 · Relacionados: RF05, RF06, RNF04

Critérios de aceite
- [ ] AC1. Ao abrir, o dashboard mostra a semana atual (segunda a domingo) com número de treinos, dias com refeição registrada e média de horas de sono.
- [ ] AC2. Alternar entre semana e mês atualiza os números em menos de 2 s.
- [ ] AC3. Dias sem registro aparecem como “sem registro”, nunca como zero.
- [ ] AC4. A taxa de registro diário é exibida (dias com ao menos 1 registro ÷ dias do período).
- [ ] AC5. Sem nenhum registro, aparece mensagem orientando o primeiro registro.

### US-03 · Registrar horas de sono
- Como usuário que quer entender seu descanso (persona: Rafael),
- quero informar quantas horas dormi,
- para acompanhar meu sono junto com meus treinos.
- Prioridade: SHOULD · Estimativa: 2 pontos · Depende de: RF01 · Relacionados: RF04, RNF01

Critérios de aceite
- [ ] AC1. Data e duração em horas são obrigatórias; qualidade de 1 a 5 é opcional.
- [ ] AC2. Duração fora do intervalo de 0,5 a 24 h é rejeitada com mensagem clara.
- [ ] AC3. Existe no máximo um registro de sono por data; ao registrar de novo na mesma data, o sistema pergunta se deseja substituir.
- [ ] AC4. Após salvar, o resumo do dashboard reflete o novo valor.
- [ ] AC5. Em erro de rede, é exibida mensagem clara e os dados preenchidos são mantidos.

### Rastreabilidade

| Requisito | História | Verificado por |
|---|---|---|
| RF01 | US-01, US-03 | Teste de cadastro/login |
| RF02 | US-01 | AC1–AC5 da US-01 |
| RF04 | US-03 | AC1–AC5 da US-03 |
| RF05, RF06 | US-02 | AC1–AC5 da US-02 |
| RF03 | — | A escrever na próxima iteração |
| RNF01–RNF04 | Transversais | Métricas da seção 04 |

Definição de pronto
- [ ] Todos os ACs da história passam.
- [ ] Funciona em tela de 320 px.
- [ ] Nenhum dado de outro usuário é exibido.
- [ ] Mensagens de erro estão em português e são compreensíveis.

---

## 06 · Fora de escopo do MVP

- Importação automática de dados de smartwatch ou outros aplicativos.
- Recomendações de treino ou dieta, inclusive por IA.
- Banco de alimentos com cálculo de calorias e macronutrientes.
- Planejamento de treinos e metas (por isso a métrica de Mariana, “consistência vs. planejado”, não é medida no MVP).
- Notificações e lembretes.
- Recursos sociais e gamificação.
- Aplicativo nativo e uso offline.
- Login social e exportação de dados.

---

## Implementação inicial

O `index.html` é o ponto de entrada do Vite; a interface mantém quatro telas principais: Início, Treino, Nutrição e Histórico. A autenticação usa Supabase Auth. Séries de treino e refeições são lidas e gravadas no Supabase com RLS; cardio, hidratação, horário de sono e conclusão do treino continuam no `localStorage`. O mapa de telas, wireframes lo-fi, tokens visuais e avaliação heurística estão em [UX_UI.md](./UX_UI.md).

Os dados mantidos no `localStorage` não são sincronizados entre dispositivos e podem ser apagados ao limpar os dados do site. Ainda não há integração com Claude/Firebase, estimativa de macros ou envio de fotos. Use um navegador moderno.

A autenticação e as políticas RLS protegem o acesso aos dados remotos. Os hábitos mantidos localmente permanecem restritos ao navegador deste dispositivo.

Séries e refeições que já estavam salvas localmente por versões anteriores não são migradas automaticamente.

---

## Front-end (Aula 04) — React + Tailwind integrado ao Supabase

As quatro telas do app são componentes React + Tailwind que leem e gravam no Supabase pela camada `src/lib/data.ts`. A tela de login continua em TypeScript puro (`src/main.ts`) e, depois do login, monta o React em `#app` (`src/mount.tsx`).

### Mapa das 4 telas

| Tela | O que faz | Dados |
|---|---|---|
| **Início** | Resumo do dia: treino do dia e progresso, refeições, sono, cardio, hidratação, ontem e amanhã | Séries e refeições de hoje (Supabase) + hábitos (localStorage) |
| **Treino** | Divisões, exercícios, registrar e remover séries (carga e repetições) | `treinos_series` (INSERT, SELECT, DELETE) |
| **Nutrição** | Quatro refeições do dia: registrar o que comeu ou marcar "não comi" | `refeicoes` (UPSERT em `user_id, data, refeicao`) |
| **Histórico** | Últimos 30 dias: treino concluído, refeições e séries por dia | SELECT por período nas duas tabelas |

### Estados de UI em cada tela

Toda chamada ao Supabase passa pelo hook `useConsulta`, que devolve um de quatro estados. Cada tela desenha todos eles:

| Estado | O que o usuário vê |
|---|---|
| `loading` | Skeleton (`LoadingState`), com texto para leitor de tela |
| `success` | O conteúdo |
| `empty` | `EmptyState` com orientação do próximo passo (Treino, Nutrição e Histórico) |
| `error` | `ErrorState` com mensagem amigável e **Tentar novamente** |

O **Início** não tem estado vazio de propósito: é um resumo, e zero registros é um valor válido para ele.

### Validação em duas camadas

- **Front (formato e experiência):** campos controlados, mensagem ao lado do campo, botão desabilitado enquanto envia. Carga de 0 a 9999,99 kg; repetições inteiras de 1 a 999; descrição da refeição até 1000 caracteres; cardio de 1 a 600 minutos.
- **Banco (integridade e segurança):** CHECK constraints, RLS por `auth.uid()` e unicidade da refeição por dia (veja `schema.sql`).

### Tratamento de erros em 3 níveis

1. **Local:** `try/catch` em cada chamada; `mensagemDeErro` (`src/lib/erros.ts`) traduz rede, sessão expirada (JWT) e RLS para texto claro. O erro técnico vai só para o console.
2. **Contextual:** `ErrorBoundary` em volta de cada tela.
3. **Global:** `ErrorBoundary` na raiz (`src/mount.tsx`).

O SDK do Supabase já renova o JWT automaticamente; se a sessão se perder, o app volta para o login.

### Componentes reutilizáveis (`src/components/ui`)

`Button` (primary, secondary, ghost, danger), `Input`/`Textarea`/`Select` (com label e erro), `Card`/`CardButton`, `Badge`, `ProgressBar`, `Modal` (usa `<dialog>` nativo), `LoadingState`, `EmptyState`, `ErrorState` e `ErrorBoundary`.

### Estrutura

```
src/
  main.ts            login (Supabase Auth) e montagem do React
  mount.tsx          raiz React (monta ao logar, desmonta ao sair)
  App.tsx            navegação entre as 4 telas
  screens/           Inicio, Treino, Nutricao, Historico
  components/        modais e navegação; ui/ = componentes base
  hooks/             useConsulta (4 estados), useHabitos (localStorage)
  lib/               data.ts (Supabase), dia.ts, datas.ts, plano.ts, habitos.ts, erros.ts
prompts/             prompts usados com IA (formato CTQ) e revisão crítica
```

### Responsividade

Mobile-first com `sm:` (640 px), `md:` (768 px) e `lg:` (1024 px). Conferir no DevTools (Toggle device toolbar):

- [ ] 375 px (celular)
- [ ] 768 px (tablet)
- [ ] 1280 px (desktop)

### Prints das telas

Adicionar em `docs/prints/` e referenciar aqui: `inicio.png`, `treino.png`, `nutricao.png`, `historico.png` (e, se possível, um print de cada estado: loading, vazio e erro).

### Deploy

Link do deploy: _(preencher)_. No Vercel ou Netlify, defina `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` e adicione a URL do deploy em **Authentication → URL Configuration** no Supabase.

### Testes

`npm test` roda 16 testes (Vitest + Testing Library) cobrindo os estados de cada tela, validação dos formulários, mensagens de erro e compatibilidade com os dados antigos do `localStorage`. Os testes simulam `data.ts`; eles não acessam o banco real.

---

## 07 · Checklist de validação humana

| Item | Situação | Observação |
|---|---|---|
| Cruzamento: cada RF tem persona associada? | Verificado | Tabela da seção 04. RF03 não tem história ainda. |
| Cruzamento: cada RNF é mensurável? | Verificado | Seção 04. Os valores são propostas a confirmar. |
| Viés: a IA inventou APIs, bibliotecas ou padrões? | Verificado | Nenhuma tecnologia específica é citada nos requisitos. |
| Viés: personas e entrevistas são hipóteses? | Pendente | Foram geradas por IA. Validar com 3–5 entrevistas reais. |
| Clareza: um dev novo entende em 5 minutos? | Pendente (revisão humana) | Solicitar revisão por colega. |
| Segurança: RNFs cobrem autenticação, dados sensíveis e LGPD? | Verificado | RNF03. Dados de saúde são dados pessoais sensíveis pela LGPD. |

**Revisado por:** _______________ **Data:** ___/___/______

---

## 08 · Documento final: resumo executivo

O produto proposto tem como principal hipótese resolver o problema de registros fragmentados e de baixa consistência em rotinas de fitness. A evidência simulada reforça que o maior bloqueio não é apenas a falta de informação, mas a fricção de registrar. Por isso, o MVP prioriza:

- registro rápido e simples;
- histórico organizacional e fácil de consultar;
- dashboard com visão semanal;
- evolução por indicadores de treino, alimentação e sono;
- experiência mobile-first;
- tratamento cuidadoso de dados sensíveis.

O próximo passo real para a validação do conceito é conduzir entrevistas com 3–5 usuários reais, ajustar hipóteses, e então transformar este documento em especificação técnica e backlog de desenvolvimento.
