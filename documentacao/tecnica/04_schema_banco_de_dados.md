# Schema do Banco de Dados — RemunaIA

**Versão:** 1.0  
**Banco:** PostgreSQL via Supabase  
**Atualizado em:** 04/04/2026  

---

## 1. Diagrama Entidade-Relacionamento

```
┌─────────────────────┐         ┌──────────────────────────────────────┐
│   auth.users        │         │   public.profiles                    │
│  (Supabase Auth)    │         │                                      │
│─────────────────────│    1:1  │──────────────────────────────────────│
│ id (uuid) PK        │────────▶│ id (uuid) PK FK → auth.users.id      │
│ email               │         │ nome (text)                          │
│ created_at          │         │ empresa (text)                       │
└─────────────────────┘         │ setor_empresa (text)                 │
                                │ plano (text)                         │
                                │ simulacoes_usadas_mes (int)          │
                                │ stripe_customer_id (text)            │
                                │ stripe_subscription_id (text)        │
                                │ trial_expira_em (timestamptz)        │
                                │ criado_em (timestamptz)              │
                                │ atualizado_em (timestamptz)          │
                                └────────────────┬─────────────────────┘
                                                 │ 1:N
                                                 ▼
                                ┌──────────────────────────────────────┐
                                │   public.simulacoes                  │
                                │──────────────────────────────────────│
                                │ id (uuid) PK                         │
                                │ user_id (uuid) FK → profiles.id      │
                                │ tipo (text)                          │
                                │ cargo_atual (text)                   │
                                │ cargo_proposto (text)                │
                                │ salario_atual (numeric)              │
                                │ salario_proposto (numeric)           │
                                │ regime (text)                        │
                                │ setor (text)                         │
                                │ estado (text)                        │
                                │ contexto_adicional (text)            │
                                │ budget_informado (boolean)           │
                                │ budget_valor (numeric)               │
                                │ pares_existem (boolean)              │
                                │ salario_medio_pares (numeric)        │
                                │ historico_avaliacao (text)           │
                                │ politica_salarial (text)             │
                                │ nivel_senioridade (text)             │
                                │ tempo_cargo (text)                   │
                                │ resultado (jsonb)                    │
                                │ prompt_version (text)                │
                                │ status (text)                        │
                                │ criado_em (timestamptz)              │
                                └──────────────────────────────────────┘
```

---

## 2. SQL Completo — Criação das Tabelas

### 2.1 Tabela: profiles

```sql
-- Extensão necessária (já habilitada no Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de perfis (estende auth.users do Supabase)
CREATE TABLE public.profiles (
  id                      UUID          PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome                    TEXT          NOT NULL,
  empresa                 TEXT          NOT NULL,
  setor_empresa           TEXT,
  
  -- Controle de plano
  plano                   TEXT          NOT NULL DEFAULT 'trial'
                          CHECK (plano IN ('trial', 'starter', 'professional', 'enterprise', 'cancelado')),
  simulacoes_usadas_mes   INTEGER       NOT NULL DEFAULT 0,
  mes_contagem_simulacoes DATE          DEFAULT DATE_TRUNC('month', NOW()),
  
  -- Stripe
  stripe_customer_id      TEXT          UNIQUE,
  stripe_subscription_id  TEXT          UNIQUE,
  
  -- Trial
  trial_expira_em         TIMESTAMPTZ   DEFAULT (NOW() + INTERVAL '14 days'),
  
  -- Timestamps
  criado_em               TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  atualizado_em           TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Comentários
COMMENT ON TABLE public.profiles IS 'Perfis de usuários do RemunaIA, estendendo auth.users';
COMMENT ON COLUMN public.profiles.plano IS 'trial | starter | professional | enterprise | cancelado';
COMMENT ON COLUMN public.profiles.simulacoes_usadas_mes IS 'Contador resetado mensalmente — usado para limitar plano Starter (20/mês)';
COMMENT ON COLUMN public.profiles.mes_contagem_simulacoes IS 'Mês de referência do contador atual';
```

### 2.2 Tabela: simulacoes

```sql
CREATE TABLE public.simulacoes (
  id                      UUID          PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id                 UUID          NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- Tipo de movimento
  tipo                    TEXT          NOT NULL
                          CHECK (tipo IN ('promocao', 'aumento', 'contratacao', 'ajuste_faixa')),
  
  -- Dados do caso
  cargo_atual             TEXT          NOT NULL,
  cargo_proposto          TEXT,                          -- Null em caso de aumento/ajuste
  salario_atual           NUMERIC(10,2) NOT NULL,
  salario_proposto        NUMERIC(10,2) NOT NULL,
  regime                  TEXT          NOT NULL DEFAULT 'clt'
                          CHECK (regime IN ('clt', 'pj')),
  setor                   TEXT          NOT NULL,
  estado                  TEXT          NOT NULL,
  
  -- Contexto adicional
  contexto_adicional      TEXT,
  budget_informado        BOOLEAN       NOT NULL DEFAULT FALSE,
  budget_valor            NUMERIC(10,2),
  pares_existem           BOOLEAN       NOT NULL DEFAULT FALSE,
  salario_medio_pares     NUMERIC(10,2),
  historico_avaliacao     TEXT,
  politica_salarial       TEXT,
  nivel_senioridade       TEXT
                          CHECK (nivel_senioridade IN ('junior', 'pleno', 'senior', 'especialista', 'lideranca', NULL)),
  tempo_cargo             TEXT,
  
  -- Resultado da IA
  resultado               JSONB,                         -- Output completo do Gemini
  prompt_version          TEXT          NOT NULL DEFAULT '1.0',
  
  -- Status do processamento
  status                  TEXT          NOT NULL DEFAULT 'pendente'
                          CHECK (status IN ('pendente', 'processando', 'concluido', 'erro')),
  erro_mensagem           TEXT,                          -- Preenchido se status = 'erro'
  
  -- Timestamps
  criado_em               TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  concluido_em            TIMESTAMPTZ
);

-- Comentários
COMMENT ON TABLE public.simulacoes IS 'Todas as simulações de remuneração realizadas na plataforma';
COMMENT ON COLUMN public.simulacoes.resultado IS 'JSON completo retornado pelo Gemini: resumo, financeiro, benchmark, equidade, riscos, recomendacao, conclusao';
COMMENT ON COLUMN public.simulacoes.prompt_version IS 'Versão do prompt master usado — permite auditar e reprocessar com versão mais nova';
COMMENT ON COLUMN public.simulacoes.status IS 'pendente: aguardando processamento | processando: chamada IA em andamento | concluido: resultado disponível | erro: falha no processamento';
```

---

## 3. Índices

```sql
-- profiles: busca por Stripe IDs (webhook de pagamento)
CREATE INDEX idx_profiles_stripe_customer   ON public.profiles(stripe_customer_id);
CREATE INDEX idx_profiles_stripe_sub        ON public.profiles(stripe_subscription_id);
CREATE INDEX idx_profiles_plano             ON public.profiles(plano);

-- simulacoes: listagem do histórico do usuário (query mais comum)
CREATE INDEX idx_simulacoes_user_id         ON public.simulacoes(user_id);
CREATE INDEX idx_simulacoes_user_criado     ON public.simulacoes(user_id, criado_em DESC);

-- simulacoes: filtro por tipo (para analytics)
CREATE INDEX idx_simulacoes_tipo            ON public.simulacoes(tipo);

-- simulacoes: busca por status (para reprocessar erros)
CREATE INDEX idx_simulacoes_status          ON public.simulacoes(status) WHERE status != 'concluido';

-- simulacoes: resultado JSONB (busca dentro do JSON — útil no futuro)
CREATE INDEX idx_simulacoes_resultado_gin   ON public.simulacoes USING GIN(resultado);
```

---

## 4. Row Level Security (RLS) — Supabase

### 4.1 Habilitar RLS

```sql
ALTER TABLE public.profiles  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.simulacoes ENABLE ROW LEVEL SECURITY;
```

### 4.2 Políticas: profiles

```sql
-- Usuário vê apenas seu próprio perfil
CREATE POLICY "profiles: usuario ve o proprio"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Usuário atualiza apenas seu próprio perfil
CREATE POLICY "profiles: usuario atualiza o proprio"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Perfil é criado automaticamente via trigger (não pelo usuário direto)
CREATE POLICY "profiles: insercao via service_role"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);
```

### 4.3 Políticas: simulacoes

```sql
-- Usuário vê apenas suas próprias simulações
CREATE POLICY "simulacoes: usuario ve as proprias"
  ON public.simulacoes FOR SELECT
  USING (auth.uid() = user_id);

-- Usuário cria simulações apenas para si mesmo
CREATE POLICY "simulacoes: usuario cria para si"
  ON public.simulacoes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Usuário não pode deletar simulações (preservar histórico)
-- Sem política de DELETE = nenhum usuário pode deletar
```

### 4.4 Trigger: Criar perfil automaticamente após cadastro

```sql
-- Função que cria o perfil quando um novo usuário se cadastra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, nome, empresa)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nome', 'Usuário'),
    COALESCE(NEW.raw_user_meta_data->>'empresa', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger associado ao evento de novo usuário
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 4.5 Trigger: Atualizar timestamp automaticamente

```sql
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
```

### 4.6 Trigger: Reset mensal do contador de simulações

```sql
CREATE OR REPLACE FUNCTION public.reset_simulacoes_counter()
RETURNS TRIGGER AS $$
BEGIN
  -- Se estamos em um mês diferente do último contador, resetar
  IF DATE_TRUNC('month', NOW()) > NEW.mes_contagem_simulacoes THEN
    NEW.simulacoes_usadas_mes = 0;
    NEW.mes_contagem_simulacoes = DATE_TRUNC('month', NOW());
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_reset_counter
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.reset_simulacoes_counter();
```

---

## 5. Queries Mais Usadas

### 5.1 Buscar perfil completo do usuário logado

```sql
SELECT 
  p.*,
  CASE 
    WHEN p.plano = 'trial' AND p.trial_expira_em < NOW() THEN 'trial_expirado'
    ELSE p.plano
  END AS plano_efetivo
FROM public.profiles p
WHERE p.id = auth.uid();
```

### 5.2 Listar histórico de simulações do usuário

```sql
SELECT 
  s.id,
  s.tipo,
  s.cargo_atual,
  s.cargo_proposto,
  s.salario_atual,
  s.salario_proposto,
  s.regime,
  s.setor,
  s.estado,
  s.resultado->>'resumo_cenario' AS resumo,
  s.resultado->'recomendacao'->>'decisao' AS decisao_recomendada,
  (s.resultado->'recomendacao'->>'salario_recomendado')::numeric AS salario_recomendado,
  s.status,
  s.criado_em
FROM public.simulacoes s
WHERE s.user_id = auth.uid()
ORDER BY s.criado_em DESC
LIMIT 50;
```

### 5.3 Verificar limite de simulações antes de processar

```sql
SELECT
  p.plano,
  p.simulacoes_usadas_mes,
  CASE p.plano
    WHEN 'starter'      THEN 20
    WHEN 'professional' THEN 999999
    WHEN 'enterprise'   THEN 999999
    WHEN 'trial'        THEN 3
    ELSE 0
  END AS limite_mensal,
  CASE p.plano
    WHEN 'starter'      THEN (p.simulacoes_usadas_mes < 20)
    WHEN 'professional' THEN true
    WHEN 'enterprise'   THEN true
    WHEN 'trial'        THEN (p.simulacoes_usadas_mes < 3 AND p.trial_expira_em > NOW())
    ELSE false
  END AS pode_simular
FROM public.profiles p
WHERE p.id = auth.uid();
```

### 5.4 Incrementar contador de simulações

```sql
UPDATE public.profiles
SET simulacoes_usadas_mes = simulacoes_usadas_mes + 1
WHERE id = auth.uid();
```

### 5.5 Atualizar plano via webhook do Stripe

```sql
-- Chamado pela Edge Function após receber webhook do Stripe
UPDATE public.profiles
SET 
  plano = $1,           -- 'starter' | 'professional' | 'enterprise' | 'cancelado'
  stripe_subscription_id = $2,
  atualizado_em = NOW()
WHERE stripe_customer_id = $3;
```

---

## 6. Política de Retenção de Dados (LGPD)

| Tipo de dado | Tabela | Retenção | Ação ao expirar |
|---|---|---|---|
| Dados cadastrais | profiles | Enquanto conta ativa + 1 ano após cancelamento | Anonimizar nome e empresa |
| Simulações completas | simulacoes | 2 anos | Deletar resultado JSONB, manter metadados |
| Dados de pagamento | Stripe (externo) | Conforme política Stripe | N/A (não armazenamos no banco) |
| Logs de acesso | Supabase logs | 30 dias | Automático pelo Supabase |

### Script de anonimização (rodar anualmente)

```sql
-- Anonimizar perfis de usuários cancelados há mais de 1 ano
UPDATE public.profiles
SET 
  nome = 'Usuário Removido',
  empresa = 'Empresa Removida',
  atualizado_em = NOW()
WHERE 
  plano = 'cancelado' 
  AND atualizado_em < NOW() - INTERVAL '1 year';

-- Remover resultados de simulações antigas (manter só metadados)
UPDATE public.simulacoes
SET resultado = NULL
WHERE criado_em < NOW() - INTERVAL '2 years';
```

---

## 7. Plano de Migração para Escala

### Fase 1 — Piloto (0–100 clientes) — Free tier Supabase
- Configuração atual é suficiente
- Monitorar: tamanho do banco (limite 500MB free)
- Estimativa: ~1MB por 1.000 simulações → free tier aguenta ~500k simulações

### Fase 2 — Crescimento (100–500 clientes) — Supabase Pro (~R$125/mês)
- Banco ilimitado + backups automáticos + mais conexões simultâneas
- Adicionar tabela `eventos_auditoria` para rastrear ações sensíveis

### Fase 3 — Escala (500+ clientes)
```sql
-- Particionamento da tabela simulacoes por data
-- (Migração futura quando > 1M registros)
CREATE TABLE simulacoes_2026 PARTITION OF simulacoes
  FOR VALUES FROM ('2026-01-01') TO ('2027-01-01');
```
