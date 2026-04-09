# RemunaIA — Documento de Arquitetura do Sistema

**Versão:** 1.0  
**Data:** Abril 2026  
**Autora:** Carla Vianna  
**Produto:** RemunaIA — SaaS B2B de Simulação de Decisões de Remuneração

---

## Sumário

1. [Visão Geral da Arquitetura](#1-visão-geral-da-arquitetura)
2. [Diagrama de Arquitetura (ASCII)](#2-diagrama-de-arquitetura-ascii)
3. [Descrição de Cada Camada](#3-descrição-de-cada-camada)
4. [Fluxo de Dados Completo](#4-fluxo-de-dados-completo)
5. [Fluxo de Autenticação e Autorização](#5-fluxo-de-autenticação-e-autorização)
6. [Fluxo de Pagamento (Stripe → Supabase)](#6-fluxo-de-pagamento-stripe--supabase)
7. [Fluxo de Geração de Recomendação por IA](#7-fluxo-de-geração-de-recomendação-por-ia)
8. [Diagrama de Componentes React](#8-diagrama-de-componentes-react)
9. [Decisões Arquiteturais e Justificativas](#9-decisões-arquiteturais-e-justificativas)
10. [Limitações Conhecidas e Plano de Evolução](#10-limitações-conhecidas-e-plano-de-evolução)
11. [Configuração de Variáveis de Ambiente](#11-configuração-de-variáveis-de-ambiente)

---

## 1. Visão Geral da Arquitetura

O RemunaIA é construído sobre uma arquitetura **serverless e orientada a serviços gerenciados**, projetada para minimizar custo operacional durante o estágio inicial (MVP), enquanto mantém capacidade de escalar para centenas de empresas sem refatoração estrutural.

### Princípios Arquiteturais Adotados

| Princípio | Descrição |
|-----------|-----------|
| **Serverless-first** | Sem servidores próprios para gerenciar. Todo backend roda em Edge Functions do Supabase e CDN do Vercel. |
| **BaaS (Backend as a Service)** | Supabase entrega banco de dados PostgreSQL, autenticação, storage e Edge Functions em um único serviço. |
| **IA como serviço** | O motor de IA é consumido via API (Google Gemini), sem infraestrutura própria de ML. |
| **Free tiers primeiro** | Todos os serviços operam em planos gratuitos no MVP, com upgrade planejado conforme crescimento de receita. |
| **Segurança por padrão** | Row Level Security (RLS) no banco, tokens JWT para cada requisição, HTTPS em toda a comunicação. |
| **Isolamento de tenants** | Dados de cada empresa são isolados por `company_id` em todas as tabelas, com RLS aplicando o isolamento automaticamente. |

### Serviços Utilizados

| Serviço | Papel | Plano inicial | Limite free |
|---------|-------|--------------|-------------|
| Vercel | Hospedagem do frontend (React/Vite) | Free (Hobby) | 100 GB bandwidth/mês |
| Supabase | Banco de dados, Auth, Edge Functions | Free | 500 MB DB, 500k Edge invocations/mês |
| Google Gemini 1.5 Flash | IA geradora de recomendações | Free API Key | 1.500 req/dia |
| Stripe | Processamento de pagamentos | Pay-as-you-go | Sem mensalidade (2,9% + R$0,30/transação) |
| Resend | Envio de e-mails transacionais | Free | 3.000 e-mails/mês |
| PostHog | Analytics de produto | Free | 1 milhão de eventos/mês |
| GitHub | Repositório de código | Free | Ilimitado para repos públicos/privados |

---

## 2. Diagrama de Arquitetura (ASCII)

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                              USUÁRIO FINAL (Browser)                             │
│                    RH Estratégico / Gestor / Diretor de Gente                    │
└────────────────────────────────────┬─────────────────────────────────────────────┘
                                     │ HTTPS
                                     ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                              VERCEL (CDN Global)                                 │
│                        Frontend React + Tailwind CSS                             │
│                                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐ │
│  │  Landing     │  │  Dashboard   │  │  Simulador   │  │  Relatório PDF       │ │
│  │  Page        │  │  Principal   │  │  4 tipos     │  │  jsPDF               │ │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────────────┘ │
│                                                                                  │
│  ┌────────────────────────────────────────────────────────────────────────────┐  │
│  │                    React Router + Context API + React Query                │  │
│  └────────────────────────────────────────────────────────────────────────────┘  │
└───────────┬──────────────────────────────────────────────────┬───────────────────┘
            │ Supabase JS Client (REST + Realtime)             │ Stripe.js
            ▼                                                  ▼
┌───────────────────────────────────┐          ┌──────────────────────────────────┐
│         SUPABASE (Backend)        │          │         STRIPE (Pagamentos)      │
│                                   │          │                                  │
│  ┌─────────────────────────────┐  │          │  ┌────────────────────────────┐  │
│  │  PostgreSQL Database        │  │          │  │  Checkout Session          │  │
│  │  ─ users                    │  │          │  │  Subscription Management   │  │
│  │  ─ companies                │  │          │  │  Webhook Events            │  │
│  │  ─ subscriptions            │  │          │  └──────────┬─────────────────┘  │
│  │  ─ simulations              │  │          │             │ Webhook HTTPS POST  │
│  │  ─ simulation_results       │  │          └─────────────┼────────────────────┘
│  │  ─ salary_benchmarks        │  │                        │
│  │  ─ audit_logs               │  │◄───────────────────────┘
│  └─────────────────────────────┘  │   Edge Function: stripe-webhook
│                                   │
│  ┌─────────────────────────────┐  │
│  │  Supabase Auth              │  │
│  │  ─ JWT tokens               │  │
│  │  ─ Magic Link               │  │
│  │  ─ Google OAuth             │  │
│  └─────────────────────────────┘  │
│                                   │
│  ┌─────────────────────────────┐  │          ┌──────────────────────────────────┐
│  │  Edge Functions (Deno)      │  │          │      GOOGLE GEMINI 1.5 FLASH     │
│  │  ─ generate-recommendation  │◄─┼──────────┤  API REST                        │
│  │  ─ stripe-webhook           │  │          │  Prompt Engineering              │
│  │  ─ send-email               │  │          │  JSON Response                   │
│  │  ─ calculate-benchmark      │  │          └──────────────────────────────────┘
│  └─────────────────────────────┘  │
│                                   │          ┌──────────────────────────────────┐
│  ┌─────────────────────────────┐  │          │         RESEND (E-mail)          │
│  │  Row Level Security (RLS)   │  │          │  Templates HTML                  │
│  │  Policies por company_id    │  │◄─────────┤  Boas-vindas, Trial, Fatura     │
│  └─────────────────────────────┘  │          └──────────────────────────────────┘
└───────────────────────────────────┘
                    │
                    ▼
┌───────────────────────────────────┐
│         POSTHOG (Analytics)       │
│  Eventos de uso do produto        │
│  Funil de conversão               │
│  Retenção e engajamento           │
└───────────────────────────────────┘
```

---

## 3. Descrição de Cada Camada

### 3.1 Camada de Apresentação (Frontend)

**Tecnologias:** React 18, Vite, Tailwind CSS, React Router v6, React Query (TanStack Query v5), Zustand (estado global leve), jsPDF

**Responsabilidades:**
- Renderizar todas as telas do produto (landing, autenticação, dashboard, simulador, relatório)
- Gerenciar estado local dos formulários de simulação
- Consumir a API do Supabase via SDK oficial (`@supabase/supabase-js`)
- Iniciar checkout no Stripe via `@stripe/stripe-js`
- Gerar arquivos PDF no lado do cliente usando jsPDF
- Enviar eventos de analytics para o PostHog via SDK
- Gerenciar sessão do usuário (tokens JWT armazenados no localStorage)

**Estratégia de build:**
- Vite como bundler (mais rápido que CRA para desenvolvimento)
- Build estático gerado e hospedado no Vercel
- Code splitting automático por rota via React.lazy + Suspense

**Estrutura de estado:**
- **React Query:** Cache de dados remotos (simulações salvas, plano atual, histórico)
- **Zustand:** Estado de UI global (sidebar aberta/fechada, tema, notificações)
- **React Hook Form:** Estado local de formulários de simulação
- **Context API:** Sessão do usuário autenticado (AuthContext)

---

### 3.2 Camada de Backend (Supabase)

**Tecnologias:** Supabase (PostgreSQL 15, GoTrue Auth, PostgREST, Deno Edge Functions)

O Supabase atua como o backend completo do produto. Ele expõe uma API REST automática gerada a partir do schema do banco (via PostgREST), além de permitir funções customizadas via Edge Functions em Deno/TypeScript.

**Sub-componentes:**

#### 3.2.1 Banco de Dados (PostgreSQL)
- 8 tabelas principais (detalhadas no Documento 04)
- Row Level Security habilitado em todas as tabelas
- Funções SQL para cálculos de benchmark e posicionamento de mercado
- Triggers para criação automática de registros relacionados (ex: company_settings ao criar empresa)

#### 3.2.2 Autenticação (GoTrue)
- Suporte a Magic Link (link por e-mail, sem senha)
- OAuth com Google (login social)
- JWT com expiração configurável (1h + refresh token por 7 dias)
- Middleware automático de validação de token em todas as requisições

#### 3.2.3 Edge Functions (Deno Runtime)
Funções serverless que encapsulam lógica de negócio que não deve ficar no cliente:

| Função | Trigger | Descrição |
|--------|---------|-----------|
| `generate-recommendation` | POST do frontend | Chama Gemini API, valida resultado, persiste no banco |
| `stripe-webhook` | POST do Stripe | Processa eventos de pagamento, atualiza subscription |
| `send-email` | Chamada interna | Envia e-mails via Resend API |
| `calculate-benchmark` | POST do frontend | Calcula P25/P50/P75 para o cargo/setor/localização |

#### 3.2.4 Storage
- Bucket `reports`: Armazena PDFs gerados (opção futura para envio por e-mail)
- Bucket `company-logos`: Logos das empresas para personalização de relatórios

---

### 3.3 Camada de IA (Google Gemini)

**Modelo:** gemini-1.5-flash (rápido, custo baixo, ótimo para análise de dados estruturados)

**Papel:** Receber os dados da simulação já calculados e formatados, e retornar:
- Análise qualitativa de riscos
- Recomendação clara ("Aprovar", "Aprovar com ressalvas" ou "Não recomendado")
- Justificativa textual em linguagem executiva
- Conclusão estratégica

**Consumo:** Apenas via Edge Function `generate-recommendation`. O frontend NUNCA chama a Gemini API diretamente — isso protege a chave de API e permite logging centralizado.

---

### 3.4 Camada de Pagamento (Stripe)

**Fluxo:** O frontend redireciona o usuário para o Checkout hospedado do Stripe. Após pagamento, o Stripe envia um webhook para a Edge Function `stripe-webhook`, que atualiza o banco de dados.

**Dados nunca armazenados no RemunaIA:** número de cartão, CVV, dados de cobrança sensíveis. O Stripe é o único que processa e armazena dados de pagamento (compliance PCI-DSS).

---

### 3.5 Camada de Infraestrutura e DevOps

**Vercel:**
- Deploy automático a cada push na branch `main`
- Preview deploys para cada Pull Request
- CDN global (edge network) para servir os assets estáticos
- Variáveis de ambiente gerenciadas via painel

**GitHub:**
- Repositório privado
- Branch protection em `main` (requer PR)
- GitHub Actions para CI (lint + type check antes do merge)
- GitHub Copilot para assistência no desenvolvimento

**Monitoramento:**
- PostHog: eventos de produto (simulações iniciadas, concluídas, tipo de simulação, plano do usuário)
- Vercel Analytics: performance do frontend (Core Web Vitals)
- Supabase Dashboard: logs de Edge Functions, uso de banco, erros de auth

---

## 4. Fluxo de Dados Completo

### Do formulário ao resultado com PDF

```
1. USUÁRIO preenche formulário de simulação
   ├── Tipo: Promoção / Aumento / Contratação / Ajuste de Faixa
   ├── Dados do colaborador (cargo atual, salário atual, tempo de empresa)
   ├── Dados da proposta (cargo proposto, salário proposto)
   └── Contexto (setor, localização, regime CLT/PJ)

2. FRONTEND valida o formulário (React Hook Form + Zod)
   ├── Campos obrigatórios preenchidos
   ├── Salário proposto > 0
   └── Cargo proposto selecionado na lista

3. FRONTEND faz chamada à Edge Function `calculate-benchmark`
   ├── Input: { cargo, setor, localizacao, regime }
   └── Output: { p25, p50, p75, fonte, data_referencia }

4. FRONTEND calcula métricas financeiras (no cliente)
   ├── Custo mensal atual = salário_atual × encargos
   ├── Custo mensal proposto = salário_proposto × encargos
   ├── Delta mensal = custo_proposto - custo_atual
   ├── Delta anual = delta_mensal × 12
   └── % de aumento = (salário_proposto / salário_atual - 1) × 100

5. FRONTEND faz chamada à Edge Function `generate-recommendation`
   ├── Input: { dados_colaborador, proposta, benchmark, metricas_financeiras, contexto_empresa }
   └── A Edge Function:
       a. Valida o token JWT do usuário (Supabase Auth)
       b. Verifica se a empresa tem simulações disponíveis (checar plano)
       c. Monta o prompt para o Gemini com todos os dados
       d. Chama a Gemini API (POST /v1/models/gemini-1.5-flash:generateContent)
       e. Parseia o JSON retornado pelo Gemini
       f. Valida os campos obrigatórios do JSON
       g. Persiste a simulação no banco (tabela simulations + simulation_results)
       h. Decrementa contador de simulações da empresa (se plano Starter)
       i. Retorna o resultado completo para o frontend

6. FRONTEND recebe o resultado e renderiza:
   ├── Tabela de impacto financeiro
   ├── Gráfico de posicionamento de mercado (P25/P50/P75)
   ├── Análise de equidade interna
   ├── Tabela de riscos (financeiro, equidade, retenção, mercado)
   ├── Recomendação da IA (badge + justificativa)
   └── Conclusão estratégica

7. USUÁRIO clica em "Exportar PDF"
   ├── Frontend usa jsPDF para gerar o documento no browser
   ├── Formata: cabeçalho com logo da empresa, seções, tabelas, rodapé
   └── Dispara download do arquivo: "simulacao_[nome_colaborador]_[data].pdf"

8. POSTHOG registra evento
   └── { event: 'simulation_completed', properties: { type, plan, sector, location } }
```

---

## 5. Fluxo de Autenticação e Autorização

### 5.1 Autenticação (Quem é o usuário)

```
OPÇÃO A — Magic Link (recomendado)
─────────────────────────────────
1. Usuário informa e-mail na tela de login
2. Frontend chama supabase.auth.signInWithOtp({ email })
3. Supabase GoTrue envia e-mail com link único (válido por 1h)
4. Usuário clica no link → redirecionado para /auth/callback
5. Frontend intercepta o hash da URL, chama supabase.auth.exchangeCodeForSession()
6. Supabase retorna { access_token (JWT), refresh_token, user }
7. SDK armazena tokens no localStorage
8. Redirect para /dashboard

OPÇÃO B — Google OAuth
──────────────────────
1. Usuário clica em "Entrar com Google"
2. Frontend chama supabase.auth.signInWithOAuth({ provider: 'google' })
3. Redirecionamento para Google OAuth consent screen
4. Google redireciona para /auth/callback com code
5. Supabase troca o code pelo token de acesso
6. Cria/atualiza o usuário na tabela auth.users
7. Retorna JWT para o frontend
8. Redirect para /dashboard ou /onboarding (primeiro acesso)
```

### 5.2 Autorização (O que o usuário pode fazer)

A autorização no RemunaIA funciona em **3 camadas**:

**Camada 1 — Frontend (React Router)**
```javascript
// ProtectedRoute component
const ProtectedRoute = ({ children, requiredPlan }) => {
  const { session, company } = useAuth();
  
  if (!session) return <Navigate to="/login" />;
  if (requiredPlan && !hasAccess(company.plan, requiredPlan)) {
    return <Navigate to="/upgrade" />;
  }
  return children;
};
```

**Camada 2 — Row Level Security no Banco**
Toda query ao banco passa pelo RLS, que verifica se o `auth.uid()` (user_id do JWT) pertence à empresa dona do dado:
```sql
-- Exemplo: usuário só vê simulações da sua empresa
CREATE POLICY "users_see_own_company_simulations"
ON simulations FOR SELECT
USING (
  company_id IN (
    SELECT company_id FROM company_users
    WHERE user_id = auth.uid()
  )
);
```

**Camada 3 — Edge Functions**
Cada Edge Function valida o JWT antes de processar:
```typescript
const { data: { user }, error } = await supabase.auth.getUser(
  req.headers.get('Authorization')?.replace('Bearer ', '') ?? ''
);
if (error || !user) return new Response('Unauthorized', { status: 401 });
```

### 5.3 Controle de Plano

```
                    ┌─────────────────────────┐
                    │   Tabela: subscriptions  │
                    │   company_id             │
                    │   plan: starter/pro/ent  │
                    │   status: active/trial   │
                    │   simulations_used       │
                    │   simulations_limit      │
                    └─────────────┬───────────┘
                                  │
              ┌───────────────────┼───────────────────┐
              ▼                   ▼                   ▼
        Starter (20/mês)    Pro (ilimitado)    Enterprise (ilimitado)
        Verifica limite     Sem limite         Sem limite
        Decrementa          Registra apenas    Registra + API key
```

---

## 6. Fluxo de Pagamento (Stripe → Supabase)

```
1. USUÁRIO seleciona plano na tela /pricing
   └── Frontend chama Edge Function: POST /create-checkout-session
       ├── Input: { plan_id, company_id, user_email }
       └── A função cria uma Stripe Checkout Session com:
           ├── price_id (ID do produto no Stripe)
           ├── customer_email
           ├── success_url: https://remunaia.com.br/dashboard?payment=success
           └── cancel_url: https://remunaia.com.br/pricing

2. FRONTEND redireciona para a URL do Stripe Checkout
   └── O Stripe hospeda a página de pagamento (PCI-DSS compliant)

3. USUÁRIO insere dados do cartão e confirma
   └── Stripe processa o pagamento

4. STRIPE envia webhook para Edge Function `stripe-webhook`
   Endpoint: https://[project].supabase.co/functions/v1/stripe-webhook
   
   Evento: checkout.session.completed
   ├── Extrai: customer_id, subscription_id, metadata.company_id, metadata.plan
   ├── Atualiza tabela subscriptions:
   │   └── UPDATE subscriptions SET 
   │         status = 'active',
   │         stripe_customer_id = customer_id,
   │         stripe_subscription_id = subscription_id,
   │         plan = metadata.plan,
   │         current_period_end = period_end
   │       WHERE company_id = metadata.company_id
   └── Chama Edge Function `send-email` (e-mail de confirmação)

   Evento: invoice.payment_failed
   ├── Atualiza status para 'past_due'
   └── Envia e-mail de alerta ao admin da empresa

   Evento: customer.subscription.deleted
   ├── Atualiza status para 'canceled'
   └── Downgrade para plano free (sem simulações)

5. STRIPE valida assinatura do webhook
   └── Edge Function verifica header Stripe-Signature com STRIPE_WEBHOOK_SECRET
       Se inválido → retorna 400 (ignora evento)

6. FRONTEND verifica payment=success na URL
   └── Invalidar cache do React Query → recarrega dados do plano
       Exibe modal de boas-vindas com instruções de uso
```

---

## 7. Fluxo de Geração de Recomendação por IA

```
1. EDGE FUNCTION `generate-recommendation` recebe:
   {
     "tipo_simulacao": "promocao",
     "colaborador": {
       "nome": "Ana Silva",
       "cargo_atual": "Analista de RH Junior",
       "salario_atual": 4500,
       "tempo_empresa_meses": 18,
       "regime": "CLT"
     },
     "proposta": {
       "cargo_proposto": "Analista de RH Pleno",
       "salario_proposto": 6200
     },
     "benchmark": {
       "p25": 5200, "p50": 6000, "p75": 7100,
       "setor": "Educação", "localizacao": "Rio de Janeiro"
     },
     "metricas_financeiras": {
       "custo_mensal_atual": 7155,
       "custo_mensal_proposto": 9858,
       "delta_mensal": 2703,
       "delta_anual": 32436,
       "percentual_aumento": 37.8
     },
     "contexto_empresa": {
       "numero_funcionarios": 120,
       "setor": "Educação"
     }
   }

2. MONTA O PROMPT (ver Documento 05 para prompt completo)
   ├── System prompt: instrução de papel e formato de saída
   └── User prompt: dados estruturados da simulação

3. CHAMA GEMINI API
   POST https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent
   Headers: { 'x-goog-api-key': GEMINI_API_KEY }
   Body: { contents: [{ parts: [{ text: prompt }] }] }
   
   Configurações:
   ├── temperature: 0.3 (respostas mais consistentes e conservadoras)
   ├── maxOutputTokens: 2048
   └── topP: 0.8

4. PARSEIA A RESPOSTA
   ├── Extrai o texto do response.candidates[0].content.parts[0].text
   ├── Remove markdown code fences (```json ... ```) se presentes
   ├── JSON.parse() o conteúdo
   └── Valida campos obrigatórios (ver esquema de validação no Doc 05)

5. EM CASO DE ERRO DO GEMINI
   ├── Erro 429 (rate limit): aguarda 2s e tenta novamente (máx 3 tentativas)
   ├── Erro 503 (indisponível): usa resposta de fallback baseada em regras
   └── JSON inválido: tenta extrair JSON parcial; se falhar, usa fallback

6. PERSISTE NO BANCO
   INSERT INTO simulations (company_id, user_id, type, input_data, created_at)
   INSERT INTO simulation_results (simulation_id, benchmark, financials, risks, recommendation, ai_raw_response)

7. RETORNA PARA O FRONTEND
   {
     "simulation_id": "uuid",
     "benchmark": { ... },
     "financials": { ... },
     "equity_analysis": { ... },
     "risks": [ ... ],
     "recommendation": {
       "verdict": "Aprovar com ressalvas",
       "justification": "...",
       "strategic_conclusion": "..."
     }
   }
```

---

## 8. Diagrama de Componentes React

```
App.tsx
├── AuthProvider (Context)
│   └── Provê: { session, user, company, signOut }
│
├── Router (React Router v6)
│   │
│   ├── / → LandingPage
│   │   ├── HeroSection
│   │   ├── FeaturesSection
│   │   ├── HowItWorksSection
│   │   ├── PricingSection
│   │   └── CTASection
│   │
│   ├── /login → LoginPage
│   │   └── MagicLinkForm | GoogleOAuthButton
│   │
│   ├── /auth/callback → AuthCallback (processa token)
│   │
│   ├── /onboarding → OnboardingFlow (primeiro acesso)
│   │   ├── Step1_CompanyData
│   │   ├── Step2_TeamSetup
│   │   └── Step3_FirstSimulation
│   │
│   ├── /dashboard → DashboardPage [PROTEGIDA]
│   │   ├── Sidebar
│   │   │   ├── Logo
│   │   │   ├── NavMenu (links para cada seção)
│   │   │   ├── PlanBadge (plano atual + uso)
│   │   │   └── UserMenu (foto, nome, sair)
│   │   ├── DashboardHeader
│   │   ├── MetricsCards (simulações do mês, economy gerada, etc)
│   │   ├── RecentSimulations (tabela com últimas 5)
│   │   └── QuickStartButton → /simulacao/nova
│   │
│   ├── /simulacao/nova → SimulationPage [PROTEGIDA]
│   │   ├── SimulationTypeSelector (4 cards: promoção, aumento, etc)
│   │   ├── SimulationForm (muda conforme tipo selecionado)
│   │   │   ├── EmployeeDataSection
│   │   │   ├── ProposalDataSection
│   │   │   └── ContextSection
│   │   └── SubmitButton (com loading state)
│   │
│   ├── /simulacao/:id → SimulationResultPage [PROTEGIDA]
│   │   ├── ResultHeader (tipo, colaborador, data)
│   │   ├── FinancialImpactTable
│   │   ├── MarketBenchmarkChart
│   │   ├── InternalEquityAnalysis
│   │   ├── RisksTable
│   │   ├── AIRecommendationCard
│   │   ├── StrategicConclusion
│   │   └── ExportPDFButton
│   │
│   ├── /historico → HistoryPage [PROTEGIDA]
│   │   ├── FilterBar (tipo, data, status)
│   │   └── SimulationsTable (com paginação)
│   │
│   ├── /configuracoes → SettingsPage [PROTEGIDA]
│   │   ├── CompanySettings
│   │   ├── TeamManagement (convidar usuários)
│   │   └── BillingSection
│   │
│   └── /upgrade → UpgradePage
│       ├── PlanComparison
│       └── CheckoutButton
│
└── Shared Components
    ├── Button (variantes: primary, secondary, danger, ghost)
    ├── Input, Select, Textarea (com validação visual)
    ├── Modal (backdrop + conteúdo)
    ├── Toast (notificações)
    ├── LoadingSpinner
    ├── ErrorBoundary
    ├── Badge (plano, status, risco)
    └── Table (reusável com sorting)
```

---

## 9. Decisões Arquiteturais e Justificativas

### 9.1 Por que Supabase em vez de Firebase?

| Critério | Supabase | Firebase |
|----------|----------|----------|
| Banco de dados | PostgreSQL (relacional, queries complexas) | Firestore (NoSQL, limites de queries) |
| Queries complexas | SQL nativo (JOINs, agregações) | Requer múltiplas reads |
| RLS | Nativo e granular | Regras de segurança menos expressivas |
| Edge Functions | Deno (TypeScript nativo) | Cloud Functions (Node.js, mais lento cold start) |
| Custo | Free tier mais generoso para DB | Custos escalam mais rápido com leitura |
| Open source | Sim (pode self-host) | Não (lock-in Google) |

**Decisão:** Supabase, por ser PostgreSQL (familiaridade, poder de queries), RLS nativo e melhor custo-benefício.

### 9.2 Por que Gemini 1.5 Flash em vez de GPT-4o?

| Critério | Gemini 1.5 Flash | GPT-4o |
|----------|-----------------|--------|
| Free tier | 1.500 req/dia | Sem free tier (pago desde o início) |
| Velocidade | Muito rápido (< 2s) | Rápido (< 3s) |
| Qualidade para análise estruturada | Excelente | Excelente |
| Custo escala | $0.075/1M tokens input | $5/1M tokens input |
| Formato JSON | Suporta nativo | Suporta com json_mode |

**Decisão:** Gemini 1.5 Flash para viabilizar o MVP sem custo de IA, com qualidade suficiente para o caso de uso.

### 9.3 Por que jsPDF no cliente em vez de geração no servidor?

- Sem custo de Edge Function para gerar PDF
- Sem armazenamento necessário (o usuário faz download diretamente)
- Sem latência adicional de rede para upload/download do PDF
- Trade-off: PDFs gerados no cliente têm menos controle tipográfico que Puppeteer no servidor. Aceitável para MVP.

### 9.4 Por que Vercel em vez de Netlify ou AWS Amplify?

- Integração nativa com GitHub (deploy em 30s)
- Preview deployments automáticos por PR
- Edge Network global sem configuração
- Free tier generoso (100 GB/mês bandwidth)
- Variáveis de ambiente simples de configurar

---

## 10. Limitações Conhecidas e Plano de Evolução

### Limitações do MVP

| Limitação | Impacto | Solução futura |
|-----------|---------|----------------|
| Benchmark baseado em dados do prompt Gemini (não DB real) | Dados de mercado podem ser genéricos | V2: integrar base de dados real (CAGED, Glassdoor API, pesquisas próprias) |
| 1.500 req/dia Gemini free | Bloqueia se > 1.500 simulações/dia | V1.5: upgrade para Gemini pay-as-you-go |
| PDF gerado no cliente (jsPDF) | Limitações de layout/tipografia | V2: PDF gerado via Puppeteer no servidor com template HTML |
| Sem multi-tenancy real isolado | Todos os dados no mesmo DB Supabase | Aceitável: RLS garante isolamento lógico |
| Sem testes automatizados | Risco de regressões | V1.5: adicionar Vitest + Testing Library |
| E-mails limitados a 3.000/mês (Resend free) | Limitante com > 1.000 clientes | V2: upgrade Resend ($20/mês para 50k e-mails) |
| Supabase free: pausa após 7 dias sem uso | Ambiente dev pode ficar indisponível | Manter ativo fazendo ping diário (cron job simples) |

### Roadmap de Evolução Arquitetural

**V1.5 (3 meses após MVP):**
- Upgrade Gemini para pay-as-you-go
- Testes unitários e de integração (Vitest)
- Supabase Pro plan ($25/mês) para remover limitações
- Dashboard de analytics interno (além do PostHog)

**V2.0 (6 meses após MVP):**
- Base de dados própria de benchmark salarial (pesquisa com clientes)
- API pública para clientes Enterprise
- PDF via Puppeteer (server-side)
- SSO SAML para empresas Enterprise
- Webhooks para integração com sistemas de RH

**V3.0 (12 meses após MVP):**
- Migração para infraestrutura dedicada (se justificado por volume)
- Machine learning próprio para benchmark (treinado com dados anonimizados dos clientes)
- App mobile (React Native)

---

## 11. Configuração de Variáveis de Ambiente

### 11.1 Arquivo `.env.local` (desenvolvimento local)

```bash
# ─── SUPABASE ────────────────────────────────────────────────────────────────
# URL do projeto Supabase (visível, não é segredo)
VITE_SUPABASE_URL=https://[seu-project-id].supabase.co

# Chave anon/public do Supabase (visível, protegida por RLS)
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...

# ─── STRIPE ──────────────────────────────────────────────────────────────────
# Chave pública do Stripe (visível no frontend)
VITE_STRIPE_PUBLIC_KEY=pk_live_... (ou pk_test_... para dev)

# ─── POSTHOG ─────────────────────────────────────────────────────────────────
# Chave pública do PostHog (visível no frontend)
VITE_POSTHOG_KEY=phc_...
VITE_POSTHOG_HOST=https://app.posthog.com

# ─── APP ─────────────────────────────────────────────────────────────────────
VITE_APP_URL=http://localhost:5173
VITE_APP_ENV=development
```

### 11.2 Variáveis de Ambiente das Edge Functions (Supabase Dashboard > Settings > Edge Functions)

```bash
# ─── GEMINI API ──────────────────────────────────────────────────────────────
# Chave da Google AI Studio (SECRETA — nunca no frontend)
GEMINI_API_KEY=AIzaSy...

# ─── STRIPE (servidor) ───────────────────────────────────────────────────────
# Chave secreta do Stripe (SECRETA)
STRIPE_SECRET_KEY=sk_live_... (ou sk_test_...)

# Segredo para validar webhooks do Stripe (SECRETO)
STRIPE_WEBHOOK_SECRET=whsec_...

# IDs dos produtos/preços no Stripe
STRIPE_PRICE_STARTER=price_...
STRIPE_PRICE_PROFESSIONAL=price_...
STRIPE_PRICE_ENTERPRISE=price_...

# ─── RESEND ──────────────────────────────────────────────────────────────────
# Chave da API do Resend (SECRETA)
RESEND_API_KEY=re_...

# E-mail remetente verificado no Resend
RESEND_FROM_EMAIL=noreply@remunaia.com.br
RESEND_FROM_NAME=RemunaIA

# ─── SUPABASE (para Edge Functions acessarem o DB com permissão de service) ──
# Service role key — TEM ACESSO TOTAL AO BANCO, nunca exposta ao frontend
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...
SUPABASE_URL=https://[seu-project-id].supabase.co
```

### 11.3 Variáveis de Ambiente no Vercel (painel do projeto)

Todas as variáveis prefixadas com `VITE_` do `.env.local`, mais:

```bash
# Necessário para Stripe checkout (precisa saber a URL de retorno)
VITE_APP_URL=https://remunaia.com.br
VITE_APP_ENV=production
```

### 11.4 Checklist de Segurança das Variáveis

- [ ] `GEMINI_API_KEY` NUNCA aparece no código do frontend
- [ ] `STRIPE_SECRET_KEY` NUNCA aparece no código do frontend
- [ ] `SUPABASE_SERVICE_ROLE_KEY` NUNCA aparece no código do frontend
- [ ] `STRIPE_WEBHOOK_SECRET` NUNCA aparece no código do frontend
- [ ] `.env.local` está no `.gitignore`
- [ ] Chaves de produção são diferentes das chaves de desenvolvimento/teste
- [ ] Rotação de chaves planejada a cada 90 dias

---

*Documento gerado em Abril 2026 — RemunaIA v1.0*  
*Próxima revisão prevista: após lançamento do MVP (início da operação)*
