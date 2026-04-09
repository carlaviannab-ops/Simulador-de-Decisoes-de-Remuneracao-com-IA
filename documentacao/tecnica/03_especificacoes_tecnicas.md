# Especificações Técnicas — RemunaIA

**Versão:** 1.0 | **Atualizado em:** 04/04/2026

---

## 1. Configuração do Ambiente de Desenvolvimento

### Pré-requisitos
```bash
Node.js >= 18.x
npm >= 9.x
Git
VS Code com extensões: GitHub Copilot, ESLint, Tailwind CSS IntelliSense
```

### Setup inicial (passo a passo)
```bash
# 1. Gerar projeto com Vite
npm create vite@latest remunaIA -- --template react-ts
cd remunaIA

# 2. Instalar dependências
npm install
npm install @supabase/supabase-js
npm install react-router-dom
npm install jspdf
npm install posthog-js

# 3. Instalar dependências de dev
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# 4. Configurar Tailwind (tailwind.config.ts)
# content: ["./index.html","./src/**/*.{js,ts,jsx,tsx}"]

# 5. Criar .env.local com as variáveis de ambiente
# (ver seção de variáveis em 01_arquitetura_do_sistema.md)

# 6. Rodar localmente
npm run dev
# Acessa http://localhost:5173
```

---

## 2. Dependências (package.json comentado)

```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.x",   // Cliente Supabase: auth, banco, edge functions
    "react": "^18.x",                   // Framework UI
    "react-dom": "^18.x",
    "react-router-dom": "^6.x",         // Roteamento SPA
    "jspdf": "^2.x",                    // Geração de PDF no browser
    "posthog-js": "^1.x"               // Analytics de produto
  },
  "devDependencies": {
    "typescript": "^5.x",
    "vite": "^5.x",
    "tailwindcss": "^3.x",
    "autoprefixer": "^10.x",
    "postcss": "^8.x",
    "@types/react": "^18.x",
    "@types/react-dom": "^18.x"
  }
}
```

---

## 3. Rotas do Frontend (React Router)

```typescript
// src/App.tsx
const router = createBrowserRouter([
  // Rotas públicas
  { path: "/",         element: <Landing /> },
  { path: "/login",    element: <Login /> },
  { path: "/cadastro", element: <Login mode="cadastro" /> },

  // Rotas protegidas (requer autenticação)
  {
    path: "/",
    element: <ProtectedRoute><Layout /></ProtectedRoute>,
    children: [
      { path: "dashboard",              element: <Dashboard /> },
      { path: "simulacao/nova",         element: <NovaSimulacao /> },
      { path: "simulacao/:id/resultado",element: <Resultado /> },
      { path: "historico",              element: <Historico /> },
      { path: "simulacao/:id",          element: <SimulacaoDetalhe /> },
      { path: "planos",                 element: <Planos /> },
      { path: "conta",                  element: <Conta /> },
    ]
  }
]);
```

**Componente ProtectedRoute:**
```typescript
// src/components/ProtectedRoute.tsx
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <Spinner />;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
```

---

## 4. Componentes React — Responsabilidades

### Layout
| Componente | Props | Responsabilidade |
|---|---|---|
| `Layout` | — | Wrapper com Header + Sidebar + área de conteúdo |
| `Header` | — | Logo, nome do usuário, menu de conta |
| `Sidebar` | — | Links de navegação (Dashboard, Nova Sim., Histórico, Planos) |

### Simulação (Wizard)
| Componente | Props | Responsabilidade |
|---|---|---|
| `NovaSimulacao` | — | Gerencia estado do wizard, avança/volta entre passos |
| `WizardProgress` | `passo: 1\|2\|3` | Barra de progresso visual |
| `Passo1Tipo` | `onSelect(tipo)` | 4 cards de seleção do tipo de movimento |
| `Passo2Dados` | `tipo, onChange, valores` | Campos de cargo, salário, regime, setor, estado |
| `Passo3Contexto` | `onChange, valores` | Textarea de contexto + campos opcionais |

### Resultado
| Componente | Props | Responsabilidade |
|---|---|---|
| `Resultado` | — | Busca dados da simulação pelo ID da rota e monta a tela |
| `ResumoScenario` | `texto: string` | Card com o texto do resumo |
| `TabelaFinanceira` | `tabela: TabelaItem[]` | Tabela com cenários e valores em R$ |
| `BenchmarkBar` | `p25, p50, p75, p90, proposto` | Barra visual de posicionamento |
| `EquidadeCard` | `analise, nivel` | Card de equidade com badge de risco |
| `TabelaRiscos` | `riscos: Risco[]` | Tabela com badges coloridos por nível |
| `RecomendacaoCard` | `recomendacao: Recomendacao` | Card azul em destaque com a decisão |
| `ConclusaoCard` | `texto: string` | Card com a conclusão estratégica |

---

## 5. Edge Functions do Supabase

### 5.1 `simulate` — Processar Simulação

**Endpoint:** `POST /functions/v1/simulate`  
**Auth:** Bearer JWT (obrigatório)

```typescript
// supabase/functions/simulate/index.ts
import { serve } from "https://deno.land/std/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js"

serve(async (req) => {
  // 1. Autenticar usuário via JWT
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )
  const jwt = req.headers.get('Authorization')?.replace('Bearer ', '')
  const { data: { user } } = await supabase.auth.getUser(jwt)
  if (!user) return new Response('Unauthorized', { status: 401 })

  // 2. Verificar limite do plano
  const { data: profile } = await supabase
    .from('profiles')
    .select('plano, simulacoes_usadas_mes, trial_expira_em')
    .eq('id', user.id)
    .single()

  const podeSim = verificarLimite(profile)
  if (!podeSim) return new Response(
    JSON.stringify({ error: 'limite_atingido' }), { status: 403 }
  )

  // 3. Receber dados do formulário
  const body = await req.json()

  // 4. Criar registro no banco com status 'processando'
  const { data: simulacao } = await supabase
    .from('simulacoes')
    .insert({ user_id: user.id, ...body, status: 'processando' })
    .select()
    .single()

  // 5. Montar e enviar prompt para Gemini
  const prompt = montarPrompt(body)
  const resultado = await chamarGemini(prompt)

  // 6. Atualizar simulação com resultado
  await supabase
    .from('simulacoes')
    .update({ resultado, status: 'concluido', concluido_em: new Date() })
    .eq('id', simulacao.id)

  // 7. Incrementar contador
  await supabase
    .from('profiles')
    .update({ simulacoes_usadas_mes: profile.simulacoes_usadas_mes + 1 })
    .eq('id', user.id)

  return new Response(
    JSON.stringify({ simulacao_id: simulacao.id, resultado }),
    { headers: { 'Content-Type': 'application/json' } }
  )
})
```

**Input esperado:**
```typescript
{
  tipo: 'promocao' | 'aumento' | 'contratacao' | 'ajuste_faixa',
  cargo_atual: string,
  cargo_proposto?: string,
  salario_atual: number,
  salario_proposto: number,
  regime: 'clt' | 'pj',
  setor: string,
  estado: string,
  contexto_adicional?: string,
  budget_informado?: boolean,
  budget_valor?: number,
  pares_existem?: boolean,
  salario_medio_pares?: number,
  historico_avaliacao?: string,
  politica_salarial?: string,
  nivel_senioridade?: string,
  tempo_cargo?: string
}
```

**Output retornado:**
```typescript
{
  simulacao_id: string,  // UUID da simulação salva
  resultado: ResultadoSimulacao  // JSON completo da análise
}
```

---

### 5.2 `stripe-webhook` — Processar Pagamentos

**Endpoint:** `POST /functions/v1/stripe-webhook`  
**Auth:** Stripe-Signature header (sem JWT)

```typescript
// supabase/functions/stripe-webhook/index.ts
serve(async (req) => {
  const signature = req.headers.get('stripe-signature')!
  const body = await req.text()

  // Validar assinatura do Stripe
  const event = stripe.webhooks.constructEvent(
    body, signature, Deno.env.get('STRIPE_WEBHOOK_SECRET')!
  )

  // Mapear price_id do Stripe para plano
  const planoMap: Record<string, string> = {
    [Deno.env.get('STRIPE_PRICE_STARTER')!]: 'starter',
    [Deno.env.get('STRIPE_PRICE_PROFESSIONAL')!]: 'professional',
    [Deno.env.get('STRIPE_PRICE_ENTERPRISE')!]: 'enterprise',
  }

  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
      const sub = event.data.object
      const plano = planoMap[sub.items.data[0].price.id] ?? 'starter'
      await atualizarPlano(sub.customer, plano, sub.id)
      break

    case 'customer.subscription.deleted':
      await atualizarPlano(sub.customer, 'cancelado', null)
      break
  }

  return new Response('ok', { status: 200 })
})
```

---

## 6. Tipos TypeScript

```typescript
// src/types/index.ts

export type TipoMovimento = 'promocao' | 'aumento' | 'contratacao' | 'ajuste_faixa'
export type Regime = 'clt' | 'pj'
export type Plano = 'trial' | 'starter' | 'professional' | 'enterprise' | 'cancelado'
export type NivelRisco = 'baixo' | 'medio' | 'alto'
export type Urgencia = 'imediata' | 'pode aguardar' | 'não recomendado agora'
export type StatusSimulacao = 'pendente' | 'processando' | 'concluido' | 'erro'

export interface Profile {
  id: string
  nome: string
  empresa: string
  setor_empresa?: string
  plano: Plano
  simulacoes_usadas_mes: number
  trial_expira_em: string
  stripe_customer_id?: string
  criado_em: string
}

export interface FormularioSimulacao {
  tipo: TipoMovimento
  cargo_atual: string
  cargo_proposto?: string
  salario_atual: number
  salario_proposto: number
  regime: Regime
  setor: string
  estado: string
  contexto_adicional?: string
  budget_informado: boolean
  budget_valor?: number
  pares_existem: boolean
  salario_medio_pares?: number
  historico_avaliacao?: string
  politica_salarial?: string
  nivel_senioridade?: string
  tempo_cargo?: string
}

export interface ResultadoSimulacao {
  resumo_cenario: string
  simulacao_financeira: {
    tabela: Array<{
      cenario: string
      salario_mensal: number
      variacao_percentual: number
      custo_anual_incremental: number
    }>
    nota: string
  }
  benchmark_mercado: {
    fonte: string
    p25: number
    p50: number
    p75: number
    p90: number
    posicionamento_atual: string
    posicionamento_proposto: string
    ajuste_setor: string
    nota: string
  }
  equidade_interna: {
    analise: string
    risco_distorcao: NivelRisco
    recomendacao_equidade: string
  }
  riscos: Array<{
    risco: string
    nivel: NivelRisco
    descricao: string
    mitigacao: string
  }>
  recomendacao: {
    decisao: string
    salario_recomendado: number
    justificativa: string
    condicoes: string
    urgencia: Urgencia
  }
  conclusao_estrategica: string
  suposicoes_adotadas: string[]
}

export interface Simulacao {
  id: string
  user_id: string
  tipo: TipoMovimento
  cargo_atual: string
  cargo_proposto?: string
  salario_atual: number
  salario_proposto: number
  regime: Regime
  setor: string
  estado: string
  resultado?: ResultadoSimulacao
  status: StatusSimulacao
  criado_em: string
  concluido_em?: string
}
```

---

## 7. Templates de Email (Resend)

### Boas-vindas (enviado após cadastro)
```
Assunto: Bem-vinda ao RemunaIA, {nome}! Suas 3 simulações estão esperando.

Olá, {nome}!

Sua conta no RemunaIA está ativa. Você tem 3 simulações gratuitas para usar nos próximos 14 dias.

👉 Comece sua primeira simulação: {link_dashboard}

Dica: para aproveitar ao máximo, use um caso real que você tenha em mãos agora.

Carla
Fundadora, RemunaIA
```

### Trial expirando (enviado 2 dias antes)
```
Assunto: Sua avaliação gratuita expira em 2 dias

{nome}, suas 3 simulações gratuitas estão quase acabando.

Para continuar tendo acesso, escolha um plano que se encaixa na sua necessidade:
→ Starter (R$497/mês): 20 simulações + 3 usuários
→ Professional (R$1.297/mês): ilimitado + benchmark avançado

{link_planos}

Carla
```

### Pagamento confirmado
```
Assunto: Assinatura confirmada — Bem-vinda ao plano {plano}!

{nome}, sua assinatura {plano} está ativa!

A partir de agora você tem acesso completo a todas as funcionalidades do seu plano.

Qualquer dúvida, estou aqui: carla@remunaIA.com.br

Carla
```

---

## 8. Padrões de Código

- **Nomenclatura:** camelCase para variáveis e funções; PascalCase para componentes e tipos
- **Async/await:** sempre, nunca `.then()` encadeado
- **Error handling:** try/catch em todas as chamadas de API; nunca deixar erro silencioso
- **Formatação R$:** sempre usar `Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })`
- **Comentários:** apenas onde a lógica não é óbvia
- **Componentes:** pequenos e focados (< 150 linhas); extrair quando ficar grande
