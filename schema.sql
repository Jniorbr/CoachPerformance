-- =====================================================================
-- Coach — schema do back-end (Supabase / PostgreSQL)
-- Como usar: Supabase > SQL Editor > New query > colar este arquivo > Run
-- Pode ser executado em um projeto vazio. Não é idempotente: rodar duas
-- vezes dá erro de "já existe" (apague as tabelas antes, se precisar refazer).
--
-- Entidades (2 tabelas):
--   treinos_series  -> cada série registrada num exercício (RF02)
--   refeicoes       -> uma linha por refeição do dia (RF03)
--
-- Relacionamento: cada linha pertence a um usuário (auth.users) via user_id.
--   auth.users 1 --- N treinos_series
--   auth.users 1 --- N refeicoes
--
-- Segurança (RNF03): RLS ligado nas duas tabelas. Cada usuário só enxerga
-- e altera as próprias linhas (user_id = auth.uid()). Sem login, nada
-- é lido nem gravado.
--
-- Fora do banco por enquanto: sono, hidratação e cardio (continuam no
-- localStorage do navegador).
-- =====================================================================


-- ---------------------------------------------------------------------
-- 1) treinos_series
-- ---------------------------------------------------------------------
create table public.treinos_series (
  id             uuid primary key default gen_random_uuid(),
  -- user_id é preenchido automaticamente com o usuário logado;
  -- o front não precisa (nem deve) enviá-lo.
  user_id        uuid not null default auth.uid()
                   references auth.users (id) on delete cascade,
  data           date not null default current_date,
  -- mesmas divisões usadas no app (descanso não gera série)
  divisao        text not null
                   check (divisao in ('push', 'pull', 'quadriceps', 'posterior', 'upper')),
  exercicio_id   text not null,            -- ex.: 'push1' (id do plano no front)
  exercicio_nome text not null,            -- ex.: 'Supino inclinado com halteres'
  carga_kg       numeric(6, 2) not null
                   check (carga_kg >= 0),  -- AC2 da US-01: carga >= 0
  repeticoes     integer not null
                   check (repeticoes between 1 and 999), -- inteiro positivo
  created_at     timestamptz not null default now()
);

comment on table public.treinos_series is
  'Séries registradas por exercício. Pertence a um usuário.';

-- Consultas típicas: "meus treinos de um período" e histórico por exercício
create index treinos_series_user_data_idx
  on public.treinos_series (user_id, data desc);
create index treinos_series_user_exercicio_idx
  on public.treinos_series (user_id, exercicio_id, data desc);


-- ---------------------------------------------------------------------
-- 2) refeicoes
-- ---------------------------------------------------------------------
create table public.refeicoes (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null default auth.uid()
               references auth.users (id) on delete cascade,
  data       date not null default current_date,
  refeicao   text not null
               check (refeicao in ('cafe', 'almoco', 'lanche', 'jantar')),
  -- 'done' = registrada; 'skipped' = marcou que não comeu.
  -- "pendente" no app = ausência de linha.
  status     text not null default 'done'
               check (status in ('done', 'skipped')),
  descricao  text not null default ''
               check (char_length(descricao) <= 1000), -- mesmo limite do formulário
  created_at timestamptz not null default now(),
  -- uma refeição por tipo por dia, igual ao comportamento do app
  unique (user_id, data, refeicao)
);

comment on table public.refeicoes is
  'Uma linha por refeição por dia. Pertence a um usuário.';

create index refeicoes_user_data_idx
  on public.refeicoes (user_id, data desc);


-- ---------------------------------------------------------------------
-- 3) Row Level Security (RLS)
-- ---------------------------------------------------------------------
alter table public.treinos_series enable row level security;
alter table public.refeicoes      enable row level security;

-- treinos_series: 4 policies (select / insert / update / delete)
create policy "treinos_series: ler as proprias"
  on public.treinos_series for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "treinos_series: inserir as proprias"
  on public.treinos_series for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "treinos_series: atualizar as proprias"
  on public.treinos_series for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "treinos_series: excluir as proprias"
  on public.treinos_series for delete to authenticated
  using ((select auth.uid()) = user_id);

-- refeicoes: 4 policies
create policy "refeicoes: ler as proprias"
  on public.refeicoes for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "refeicoes: inserir as proprias"
  on public.refeicoes for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "refeicoes: atualizar as proprias"
  on public.refeicoes for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "refeicoes: excluir as proprias"
  on public.refeicoes for delete to authenticated
  using ((select auth.uid()) = user_id);


-- ---------------------------------------------------------------------
-- 4) Permissões de tabela (GRANT)
-- ---------------------------------------------------------------------
-- O RLS filtra LINHAS, mas antes disso o papel precisa ter permissão na
-- TABELA. Em projetos novos do Supabase, tabelas criadas pelo SQL Editor
-- não vêm com esse GRANT, e a API devolve 403 "permission denied for
-- table ...". Só o papel "authenticated" (usuário logado) recebe acesso;
-- o "anon" (sem login) continua sem nenhuma permissão.
grant select, insert, update, delete on public.treinos_series to authenticated;
grant select, insert, update, delete on public.refeicoes      to authenticated;


-- ---------------------------------------------------------------------
-- 5) Conferência rápida (opcional) — rode depois e veja rowsecurity = true
-- ---------------------------------------------------------------------
-- select tablename, rowsecurity from pg_tables where schemaname = 'public';
-- select tablename, policyname, cmd from pg_policies where schemaname = 'public';
