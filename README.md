# Dashboard Fitness e Saúde — Documento de Requisitos do MVP

> **Natureza do documento:** personas e entrevistas foram geradas por IA (hipóteses, não dados). Os requisitos abaixo foram gerados com apoio de IA e precisam de validação humana e, depois, de entrevistas reais (3–5 usuários).

---

## 01 · CONTEXT — Contexto

Pessoas que treinam musculação costumam registrar treino, alimentação e sono em lugares diferentes (aplicativo da academia, relógio, anotações) ou simplesmente não registrar, e por isso têm dificuldade de perceber se estão evoluindo. As entrevistas simuladas indicam que o maior obstáculo é o **esforço de registrar**, não só a falta de visualização. O MVP é um sistema web **mobile-first** que permite registrar treino, refeição e sono com poucos toques e mostra um resumo semanal e um histórico de evolução. Restrições: sem integração com smartwatch ou apps externos, dados de saúde tratados como sensíveis (LGPD) e escopo mínimo para ser construído em semanas.

---

## 02 · PERSON — Persona primária

**Rafael Mendes**, 35 anos, supervisor de logística, Curitiba/PR. Familiaridade com tecnologia: média/alta.

- **Dor principal:** registrar tudo em vários lugares é trabalhoso demais; esquece de registrar e não tem histórico organizado.
- **Cenário de uso:** pelo celular, em pequenos intervalos do dia, registra rapidamente um treino, uma refeição e as horas de sono; no domingo consulta o resumo da semana.
- **Métrica de sucesso:** taxa de registro diário (% de dias com ao menos o registro essencial).

**Por que ele é a primária:** a hipótese mais forte das três entrevistas é que o registro precisa ser rápido. Se funcionar para o usuário com menos tempo e paciência, funciona para os outros.

**Personas secundárias** (detalhes em `personas_dashboard_fitness.md`): Mariana Costa (fitness consistente, quer comparar treino e sono) e Lucas Ferreira (iniciante, quer perceber evolução com indicadores explicados).

---

## 03 · RF — Requisitos funcionais

| ID | Requisito | Persona |
|---|---|---|
| RF01 | O sistema deve permitir criar conta (e-mail e senha), entrar, sair e editar o nome do perfil. | Todas |
| RF02 | O sistema deve permitir registrar treino com **data** e **tipo** (obrigatórios) e, opcionalmente, exercícios com séries, repetições e carga. O registro pode ser editado e excluído. | Rafael, Lucas, Mariana |
| RF03 | O sistema deve permitir registrar refeição com **data** e **descrição** (obrigatórios) e quantidade (opcional). O registro pode ser editado e excluído. | Rafael, Lucas |
| RF04 | O sistema deve permitir registrar sono com **data** e **duração em horas** (obrigatórios) e qualidade de 1 a 5 (opcional). O registro pode ser editado e excluído. | Rafael, Mariana |
| RF05 | O sistema deve exibir um dashboard com o resumo da semana ou do mês: nº de treinos, dias com refeição registrada, média de horas de sono e taxa de registro diário. | Rafael, Mariana |
| RF06 | O sistema deve permitir consultar registros anteriores filtrando por tipo e período, e exibir gráfico de evolução (ex.: carga por exercício, sono ao longo do tempo) quando houver 2 ou mais registros. | Lucas, Mariana |

---

## 04 · RNF — Requisitos não funcionais

> Os valores são **metas propostas**; ajuste se o professor ou o cliente definir outros.

| ID | Requisito | Métrica / como verificar |
|---|---|---|
| RNF01 | **Usabilidade e acessibilidade:** registro mínimo de treino, refeição ou sono em poucos passos; contraste de cores nível AA. | Até 3 toques e 30 s a partir da tela inicial (teste cronometrado com 5 pessoas); verificação de contraste AA. |
| RNF02 | **Responsividade (mobile-first):** interface utilizável em celular, tablet e desktop. | Sem rolagem horizontal de 320 px a 1920 px; testado em 2 navegadores mobile e 1 desktop. |
| RNF03 | **Segurança e privacidade (LGPD):** dados de saúde protegidos; coleta apenas do necessário. | Senhas com hash; tráfego em HTTPS; usuário A não acessa registros do usuário B (teste); chaves não expostas no client; consentimento no cadastro e opção de excluir conta e dados. |
| RNF04 | **Desempenho:** telas e registros sem atrasos perceptíveis. | Carregamento inicial < 2 s em 4G; salvar registro e atualizar a lista < 1 s. |

---

## 05 · US — Histórias de usuário

### US-01 · Registrar treino realizado
- **Como** usuário com rotina corrida (persona: Rafael),
- **quero** registrar um treino com data e tipo em poucos toques,
- **para** manter meu histórico sem gastar tempo.
- **Prioridade:** MUST (MoSCoW) · **Estimativa:** 3 pontos · **Depende de:** RF01 (conta) · **Relacionados:** RF02, RNF01

**Critérios de aceitação**
- [ ] AC1. Data e tipo de treino são obrigatórios; a data vem preenchida com hoje e não pode ser futura.
- [ ] AC2. Séries e repetições aceitam apenas inteiros positivos; carga aceita número maior ou igual a 0.
- [ ] AC3. É possível salvar um registro mínimo (data + tipo) em no máximo 3 toques a partir da tela inicial.
- [ ] AC4. Após salvar, o treino aparece no histórico do dia em menos de 1 s.
- [ ] AC5. Em erro de rede, é exibida mensagem clara e os dados preenchidos são mantidos.

### US-02 · Consultar resumo semanal no dashboard
- **Como** usuário que quer saber se está mantendo a rotina (persona: Rafael),
- **quero** ver um resumo da semana com treinos, alimentação e sono,
- **para** perceber minha consistência sem abrir vários aplicativos.
- **Prioridade:** MUST (MoSCoW) · **Estimativa:** 5 pontos · **Depende de:** US-01 · **Relacionados:** RF05, RF06, RNF04

**Critérios de aceitação**
- [ ] AC1. Ao abrir, o dashboard mostra a semana atual (segunda a domingo) com nº de treinos, dias com refeição registrada e média de horas de sono.
- [ ] AC2. Alternar entre semana e mês atualiza os números em menos de 2 s.
- [ ] AC3. Dias sem registro aparecem como "sem registro", nunca como zero.
- [ ] AC4. A taxa de registro diário é exibida (dias com ao menos 1 registro ÷ dias do período).
- [ ] AC5. Sem nenhum registro, aparece uma mensagem orientando o primeiro registro.

### US-03 · Registrar horas de sono
- **Como** usuário que quer entender seu descanso (persona: Rafael),
- **quero** informar quantas horas dormi,
- **para** acompanhar meu sono junto com meus treinos.
- **Prioridade:** SHOULD (MoSCoW) · **Estimativa:** 2 pontos · **Depende de:** RF01 (conta) · **Relacionados:** RF04, RNF01

**Critérios de aceitação**
- [ ] AC1. Data e duração em horas são obrigatórias; qualidade de 1 a 5 é opcional.
- [ ] AC2. Duração fora do intervalo de 0,5 a 24 h é rejeitada com mensagem clara.
- [ ] AC3. Existe no máximo um registro de sono por data; ao registrar de novo na mesma data, o sistema pergunta se deseja substituir.
- [ ] AC4. Após salvar, o resumo do dashboard reflete o novo valor.
- [ ] AC5. Em erro de rede, é exibida mensagem clara e os dados preenchidos são mantidos.

---

## 06 · AC — Critérios de aceite (visão geral)

**Rastreabilidade**

| Requisito | História | Verificado por |
|---|---|---|
| RF01 | US-01, US-03 (dependência) | Teste de cadastro/login |
| RF02 | US-01 | AC1–AC5 da US-01 |
| RF04 | US-03 | AC1–AC5 da US-03 |
| RF05, RF06 | US-02 | AC1–AC5 da US-02 |
| RF03 | — (sem história neste exercício) | A escrever na próxima iteração |
| RNF01–RNF04 | Transversais | Métricas da seção 04 |

**Definição de pronto (vale para toda história)**
- [ ] Todos os ACs da história passam.
- [ ] Funciona em tela de 320 px.
- [ ] Nenhum dado de outro usuário é exibido.
- [ ] Mensagens de erro estão em português e são compreensíveis.

---

## 07 · OUT — Fora de escopo do MVP

- Importação automática de dados de smartwatch ou outros aplicativos.
- Recomendações de treino ou dieta, inclusive por IA.
- Banco de alimentos com cálculo de calorias e macronutrientes.
- Planejamento de treinos e metas (por isso a métrica de Mariana, "consistência vs. planejado", não é medida no MVP).
- Notificações e lembretes.
- Recursos sociais e gamificação.
- Aplicativo nativo e uso offline.
- Login social e exportação de dados.

---

## 08 · Checklist de validação humana

| Item | Situação | Observação |
|---|---|---|
| **Cruzamento:** cada RF tem persona associada? | Verificado | Tabela da seção 03. RF03 não tem história ainda. |
| **Cruzamento:** cada RNF é mensurável? | Verificado | Seção 04. Os valores são propostas a confirmar. |
| **Viés:** a IA inventou APIs, bibliotecas ou padrões? | Verificado | Nenhuma tecnologia específica é citada nos requisitos. |
| **Viés:** personas e entrevistas são hipóteses? | Pendente | Foram geradas por IA. Validar com 3–5 entrevistas reais. |
| **Clareza:** um dev novo entende em 5 minutos? | Pendente (revisão humana) | Peça a um colega para ler e cronometrar. |
| **Segurança:** RNFs cobrem autenticação, dados sensíveis e LGPD? | Verificado | RNF03. Dados de saúde são dados pessoais sensíveis pela LGPD. |

**Revisado por:** _______________ **Data:** ___/___/______
