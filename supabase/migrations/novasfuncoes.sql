-- ------------------------------------------------------------
-- MIGRAÇÃO: novas funcionalidades para a plataforma LearnEnglishBR
-- ------------------------------------------------------------
-- Extensão UUID (necessária caso ainda não exista)
create extension if not exists "uuid-ossp";

-- 1️⃣ user_goals – Objetivos do usuário
create table user_goals (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) not null,
  goal_type text not null,      -- travel, work, interview, …
  goal_label text not null,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- 2️⃣ user_learning_plans – Planos gerados pela IA
create table user_learning_plans (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) not null,
  goal_id uuid references user_goals(id),
  recommended_level text,
  estimated_months int,
  competencies jsonb,            -- [{"name":"Speaking","weight":20}, …]
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- 3️⃣ user_plan_history – Histórico de versões de plano
create table user_plan_history (
  id uuid primary key default uuid_generate_v4(),
  plan_id uuid references user_learning_plans(id) not null,
  version int not null,
  plan_json jsonb not null,
  created_at timestamp default now()
);

-- 4️⃣ interview_simulations – Simulações de entrevista
create table interview_simulations (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) not null,
  started_at timestamp default now(),
  finished_at timestamp,
  completed boolean default false
);

-- 5️⃣ interview_questions – Perguntas da simulação
create table interview_questions (
  id uuid primary key default uuid_generate_v4(),
  simulation_id uuid references interview_simulations(id) not null,
  question_text text not null,
  "order" int not null
);

-- 6️⃣ interview_answers – Respostas do usuário
create table interview_answers (
  id uuid primary key default uuid_generate_v4(),
  question_id uuid references interview_questions(id) not null,
  answer_text text,
  created_at timestamp default now()
);

-- 7️⃣ interview_feedback – Avaliação da IA
create table interview_feedback (
  id uuid primary key default uuid_generate_v4(),
  simulation_id uuid references interview_simulations(id) not null,
  feedback_json jsonb not null,
  rating int,
  created_at timestamp default now()
);

-- 8️⃣ fluency_maps – Mapa de fluência por objetivo
create table fluency_maps (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) not null,
  goal_id uuid references user_goals(id),
  current_level text not null,
  target_level text not null,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- 9️⃣ fluency_progress – Progresso diário
create table fluency_progress (
  id uuid primary key default uuid_generate_v4(),
  map_id uuid references fluency_maps(id) not null,
  "date" date not null,
  progress_percent int not null,
  hours_studied numeric,
  streak int,
  unique(map_id, "date")
);

-- 🔟 learning_metrics – Métricas genéricas
create table learning_metrics (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) not null,
  metric_key text not null,
  metric_value numeric,
  period_start date,
  period_end date,
  created_at timestamp default now()
);

-- 1️⃣1️⃣ user_streaks – Streaks de estudo
create table user_streaks (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) not null,
  current_streak int default 0,
  longest_streak int default 0,
  last_active timestamp,
  updated_at timestamp default now()
);

-- 1️⃣2️⃣ ai_recommendations – Recomendações da IA
create table ai_recommendations (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) not null,
  recommendation_text text not null,
  created_at timestamp default now(),
  expires_at timestamp
);

-- ------------------------------------------------------------
-- Triggers – auto‑update `updated_at`
-- ------------------------------------------------------------
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare
  tbl text;
begin
  for tbl in
    select tablename from pg_tables where schemaname='public' and tablename like '%_%'
  loop
    execute format('create trigger trg_%I_updated before update on %I for each row execute function set_updated_at();', tbl, tbl);
  end loop;
end $$;

-- ------------------------------------------------------------
-- Row‑Level Security – apenas o dono pode ler/escrever
-- ------------------------------------------------------------
alter table user_goals enable row level security;
create policy "owner can read/write" on user_goals
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

alter table user_learning_plans enable row level security;
create policy "owner can read/write" on user_learning_plans
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Repita a política para as demais tabelas se necessário.
