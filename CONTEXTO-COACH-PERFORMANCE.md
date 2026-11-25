# Coach de Performance — contexto do produto (handoff para o projeto SENAC)

> Este documento descreve o protótipo que já existe e funciona (um Artifact do Claude, mobile-first, com banco de documentos) e **para onde o Cristóvão quer levar o produto**. Ele é referência de comportamento e de dados, **não um desenho obrigatório**: layout, nomes de tabelas e organização do código podem mudar, desde que as regras de negócio e a experiência de uso sejam preservadas. Onde houver dúvida, **pergunte antes de assumir**.

Data de referência: 25/11/2026. Protótipo atual: `https://claude.ai/artifact/9q7LxvJL7Wpezsw9MR25Zp` (nome "Coach — Dashboard").

---

## 1. O que é e para quem

App pessoal de acompanhamento de **treino, nutrição, sono, suplementos e progresso**, centralizando o registro do dia a dia. Usuário atual: uma pessoa (o Cristóvão), uso quase exclusivo **pelo celular**, geralmente com pressa (na academia, entre séries, na hora das refeições).

Objetivo no curto prazo: acompanhar um plano de **cutting até 31/12/2026** (manter cargas e massa magra, perder gordura). Objetivo no longo prazo: virar um produto em que **várias pessoas** tenham conta própria e um **coach personalizado** cada uma.

### Divisão de papéis (importante)
- **O app** serve para **registrar** os dados do dia a dia e ser a fonte única de verdade.
- **O Coach (IA)** serve para **planejar e analisar**: lê os dados registrados e aponta ajustes. O usuário não quer digitar dados do dia no chat.
- Análises completas acontecem em **checkpoints** (02/11, 30/11 e 28/12/2026) e quando algo trava.

### Princípios de produto (preferências declaradas do usuário)
- Mobile-first, prático, poucos toques.
- Preferir soluções simples a complexidade desnecessária.
- **Nunca alterar documentos/código existentes sem avisar o que vai mudar.**
- Perguntar antes de assumir.
- Feedback direto e honesto, sem suavizar.
- Visual com "vida": emojis, cores, botões chamativos (sem poluir).

---

## 2. Navegação e telas (estado atual do protótipo)

Barra com 8 abas: **Início, Treino, Nutrição, Sono, Panorama, Coach, Plano, Pendências.**

### 2.1 Início (dashboard do dia)
- Dia atual em destaque, com resumo do **dia anterior** à esquerda e do **próximo dia** à direita (expansíveis).
- Treino do dia: só o primeiro exercício em destaque + botão para abrir o treino completo. Dá para **trocar a divisão do dia** direto dali.
- Refeições em 4 slots (café ~07:30, almoço 12:30, lanche 16:30, jantar 20:30) + extras; dá para marcar "não comi".
- Contador de calorias/macros do dia (soma das refeições registradas), passos, suplementos, hidratação, cardio e horário previsto de dormir.
- **"Ontem" é editável por completo** (treino concluído, séries, refeições, água, cardio, sono, passos, suplementos).

### 2.2 Treino
- Um botão por divisão. Cada exercício abre um **pop-up** com: GIF demonstrativo, séries salvas **individualmente** (peso × reps, ou tempo em segundos para prancha), edição/exclusão de cada série, **histórico de cargas** agrupado por data, e **cronômetro de descanso** (pré-definidos 1:30/2:00/2:30/3:00 + tempo livre, 3 bips no fim).
- **Trocar exercício do dia por equivalente** (vale só para aquele dia; as séries e o histórico ficam no exercício realmente feito).
- **Editor do plano**: remover, reordenar, ajustar alvo e adicionar exercício do catálogo (com GIF).

### 2.3 Nutrição
- Refeições com texto, **foto** e **macros (kcal, P, C, G)** por refeição; estimativa de calorias a partir da foto (feita por IA); contador do dia contra a meta.
- **Suplementos**: marcação simples de "tomei" por item (sem horário): creatina, whey, multivitamínico, ômega 3, pré-treino, blend natural.
- Hidratação em incrementos de 500 ml.

### 2.4 Sono
- Horário previsto de dormir (padrão 22:30, editável) e campo **"como foi a noite"** (horas + nota 1–5).
- Regra de ajuste: noite com **menos de 7 h ou nota 1–2** antecipa o horário em 30 min (mínimo 21:30); caso contrário volta para 22:30.

### 2.5 Panorama (dashboard geral)
- Aderência dos últimos 7 dias, dias até 31/12, dias até o próximo checkpoint.
- Grade de 7/14/30 dias: ✅ treinou · ❌ faltou · 😴 descanso · ⚪ sem registro · ⏳ hoje · ⚠️ dado faltando.
- Treinos feitos × previstos + **fila de pendência**.
- Lista de **dados que faltaram** por dia (refeições, água, sono, passos, peso de segunda).
- **Frente ao plano**: médias de kcal, proteína, água, passos e ritmo de peso contra as metas.

### 2.6 Coach (chat rápido dentro do app)
- Perguntas livres; a cada envio o app manda ao modelo um **resumo dos últimos 14 dias, peso, checkpoints e metas**. Respostas curtas, em português, diretas.
- Conversa persistida (últimas 30 mensagens) com botão para limpar.
- Limitação conhecida: não tem a memória longa do coach principal; análises de checkpoint e mudanças de estratégia ficam no chat principal.

### 2.7 Plano (até 31/12)
- Registro de **peso semanal** (pesagem toda segunda, em jejum), **checkpoints** de bioimpedância/cintura/fotos (02/11, 30/11, 28/12) e passos.

### 2.8 Pendências
- Lista de assuntos a discutir que **não são funcionalidades** (decisões em aberto).

---

## 3. Regras de negócio

### Divisão semanal padrão
Seg **Push** · Ter **Pull** · Qua **Pernas A** · Qui **Upper** · Sex **Pernas B** · Sáb/Dom descanso.
(Internamente as chaves das divisões de perna continuam `quadriceps` e `posterior`; só os rótulos viraram Pernas A/B. Pernas A e B são **pernas completas** com a ordem dos exercícios invertida para dar ênfase diferente; máx. 6 exercícios por sessão, sempre com panturrilha e abdômen.)

### Agendamento adaptativo e fila de pendência
- O usuário pode **trocar livremente** o treino de qualquer dia.
- O grupo que ficou de fora vai para uma **fila de pendência** e assume o **próximo slot livre**; nenhum grupo deve passar mais de ~1 semana sem treino.
- Se ele marcar que **ontem** foi descanso em vez de treino, o grupo não feito entra na fila.

### Séries e volume
- Cada exercício tem séries de **aquecimento, preparação e válidas**; **só as válidas contam como volume**. Metas de séries válidas por exercício/grupo estão no plano (ex.: 4×6, 3×8-12).
- No cutting, a prioridade é **manter cargas e volume**, não somar volume.
- Exercícios com alvo em tempo (ex.: prancha) registram **segundos**, não repetições.

### Nutrição e metas (cutting)
- Metas diárias iniciais: ~**2.400 kcal**, proteína ~**185 g**, carboidrato ~**270 g**, gordura ~**70 g**; passos **8–10 mil**.
- Alvo de perda: **0,5 a 0,8 kg por semana**. Calorias só são ajustadas se o peso sair da faixa **por 2 semanas** (nunca por oscilação de um dia).
- Água: **3,5 L/dia** (+0,5 L em dia de cardio/futsal).
- Cardio: modalidades **escada, esteira, bicicleta, futsal**; intensidade leve/moderada/intensa; gasto estimado por **MET × peso × tempo** (líquido, só informativo, não soma na meta).
- Aderência (Panorama) = média de: treino feito/descanso, refeições registradas (de 4), água (% da meta) e passos (contra 8 mil).

### Sono
Meta de 7,5–8 h, dormir ~22:30, tela desligada às 22:00. Regra de ajuste do horário descrita em 2.4.

---

## 4. Modelo de dados atual (documentos, como no protótipo)

O protótipo guarda JSON em documentos chave-valor. Eles mostram **o que precisa existir**; ao migrar para banco relacional, mapear conforme fizer sentido.

| Documento | Conteúdo |
|---|---|
| `days/{AAAA-MM-DD}` | Um documento por dia (ver abaixo) |
| `plano/atual` | Divisões e exercícios do plano: `{divisoes: ...}` (lista de exercícios por divisão, alvos de séries/reps, ordem) |
| `schedule/state` | `{pendingQueue: [...]}` — fila de grupos pendentes |
| `config/perfil` | `{peso, atualizadoEm}` — peso usado nas estimativas de cardio |
| `log/peso` | `{m: {"AAAA-MM-DD": kg}}` — pesagens |
| `log/checkpoints` | `{m: {"AAAA-MM-DD": {peso, gord, musc, mg, cint}}}` — bioimpedância e cintura |
| `pendencias/lista` | Itens da aba Pendências |
| `chat/coach` | `{msgs: [{r:"u"|"a", t:"texto"}]}` — conversa do Coach (últimas 30) |

### Documento do dia (`days/{data}`) — campos principais
```
date, weekday, divisao, treinoStatus ("planejado" | "concluido"),
refeicoes: { cafe, almoco, lanche, jantar: {status, texto, kcal, p, c, g, foto?}, extras: [...] },
sono: { horaPrevista, noite: { horas, nota } },
hidratacao: { ml, meta },
cardio: { fez, duracaoMin, tipo, intensidade?, kcal? },
passos, sup: { creatina, whey, multi, omega, pre, blend: true/false },
series: { "<idExercicio>": [ { peso, reps | segundos, ts } ] }
```
Observações:
- Os ids de exercício seguem o padrão `push1…`, `pull1…`, `quad1…`, `post1…`, `up1…`; **o exercício realmente feito** é quem recebe as séries (por isso a troca por equivalente preserva o histórico).
- Equivalentes pré-definidos (pares/trios de ids intercambiáveis): puxadas, elevações laterais, tríceps, panturrilha, abdominal, desenvolvimento, supino plano ↔ inclinado, crucifixo máquina ↔ polia inclinado.
- O app **não** grava, hoje, o tipo da série (aquecimento/preparação/válida) por série; isso está no plano e na conversa com o coach. Vale decidir se o novo modelo passa a gravar.
- Detalhes exatos de cada campo estão no código do Artifact (`emptyDay`, `totais`, `kcalCardio`, `renderPanorama`).

### Sugestão (não obrigatória) de tabelas relacionais
`users`, `exercises` (catálogo + gif + equivalências), `workout_plans` / `plan_days` / `plan_exercises` (ordem, séries alvo, reps alvo), `workout_days` (data, divisão, status), `set_logs` (workout_day, exercício, peso, reps/segundos, tipo da série, timestamp), `meals` (+ `meal_photos`), `daily_logs` (água, passos, sono, cardio, suplementos), `weight_logs`, `checkpoints`, `pending_groups`, `coach_messages`. Toda tabela com `user_id` e RLS por usuário (já pensando em multiusuário).

---

## 5. Mídia dos exercícios

- GIFs do repositório `github.com/hasaneyldrm/exercises-dataset` (MIT para dados/código; mídia © Gym visual, redistribuída com permissão). **Manter a atribuição** "© Gym visual — https://gymvisual.com/".
- Cada exercício do plano está mapeado a um arquivo do repositório (ex.: `videos/0314-ns0SIbU.gif`). No protótipo os GIFs foram **embutidos em base64**; no projeto real, preferir servir como arquivos estáticos ou via CDN.

---

## 6. Para onde ele quer chegar (próximos passos — "Lote E")

1. **App real fora do Artifact**, com camadas de backend e frontend bem separadas (WebAPI, Services, Domain, Business etc.), seguindo padrões como **SOLID e DDD**. Os padrões exatos ainda serão definidos com ele.
2. **Alertas com o app fechado ou a tela desligada**: cronômetro de descanso, horário de dormir, refeições, hidratação.
3. **Multiusuário**: cada pessoa com acesso próprio e **coach personalizado**.
4. **Formato** (app de celular, PWA ou site) — decisão do usuário, tomada por fora deste chat. Ele usa Android hoje e deve migrar para iPhone, o que pesa em PWA × nativo e em notificações.
5. **Migração do histórico de treino** do Artifact para o novo banco (exercícios, cargas, repetições, datas): será o próximo pedido.
6. Melhorias já pedidas e não feitas: adicionar exercícios novos **com GIF direto pela interface**; editar qualquer dia antigo (hoje só "ontem" é editável).

### Pontos em aberto que exigem decisão dele
- Gravar ou não o **tipo da série** (aquecimento/preparação/válida) por série.
- Onde guardar as **fotos** das refeições e dos checkpoints (hoje ficam dentro do documento do dia).
- Como o coach de IA no app terá acesso à memória/histórico longo (hoje recebe só um resumo de 14 dias).

---

## 7. Como trabalhar com este projeto

- Trate o Artifact como **especificação viva do comportamento**; qualquer divergência intencional deve ser avisada.
- Antes de refatorar ou trocar uma regra de negócio, **liste o que vai mudar** e espere a aprovação dele.
- Prefira entregas pequenas, testáveis no celular.
