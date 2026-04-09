# Guia de Deploy e Infraestrutura — RemunaIA

**Versão:** 1.0 | **Atualizado em:** 04/04/2026

---

## 1. Setup Inicial — Todos os Serviços

### Ordem de configuração (respeitar a sequência)
1. GitHub → 2. Supabase → 3. Vercel → 4. Google AI Studio → 5. Stripe → 6. Resend → 7. Posthog → 8. Registro.br

---

## 2. GitHub

```bash
# Criar repositório privado em github.com
# Nome: remunaIA

# Clonar localmente
git clone https://github.com/[seu-usuario]/remunaIA.git
cd remunaIA

# Criar .gitignore (adicionar .env.local)
echo ".env.local" >> .gitignore
echo "node_modules/" >> .gitignore
echo "dist/" >> .gitignore
```

---

## 3. Supabase — Passo a Passo

```
1. Acessar supabase.com → New Project
2. Nome: remunaIA | Região: South America (São Paulo) | Senha forte
3. Aguardar criação (~2 min)
4. Settings → API → copiar:
   - Project URL → VITE_SUPABASE_URL
   - anon/public key → VITE_SUPABASE_ANON_KEY
   - service_role key → SUPABASE_SERVICE_ROLE_KEY (apenas backend!)
5. SQL Editor → colar e executar o SQL de 04_schema_banco_de_dados.md
6. Authentication → Providers → habilitar Google OAuth
   - Criar projeto no Google Cloud Console
   - Obter Client ID e Client Secret
   - Adicionar redirect URL: https://[project-id].supabase.co/auth/v1/callback
7. Authentication → Email Templates → customizar templates de confirmação
8. Authentication → URL Configuration:
   - Site URL: https://remunaIA.com.br
   - Redirect URLs: https://remunaIA.com.br/**, http://localhost:5173/**
```

### Criar Edge Functions

```bash
# Instalar Supabase CLI
npm install -g supabase

# Login
supabase login

# Vincular ao projeto
supabase link --project-ref [project-id]

# Criar functions
supabase functions new simulate
supabase functions new stripe-webhook

# Configurar secrets (nunca no código)
supabase secrets set GEMINI_API_KEY=sua_chave
supabase secrets set STRIPE_SECRET_KEY=sk_live_...
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
supabase secrets set RESEND_API_KEY=re_...

# Deploy das functions
supabase functions deploy simulate
supabase functions deploy stripe-webhook
```

---

## 4. Vercel — Passo a Passo

```
1. Acessar vercel.com → Add New → Project
2. Importar repositório do GitHub (remunaIA)
3. Framework: Vite
4. Build command: npm run build
5. Output directory: dist
6. Adicionar variáveis de ambiente:
   VITE_SUPABASE_URL=...
   VITE_SUPABASE_ANON_KEY=...
   VITE_STRIPE_STARTER_LINK=...
   VITE_STRIPE_PROFESSIONAL_LINK=...
   VITE_STRIPE_ENTERPRISE_LINK=...
   VITE_POSTHOG_KEY=...
   VITE_APP_URL=https://remunaIA.com.br
7. Deploy → aguardar ~2 min
8. Verificar URL de preview (ex: remunaIA.vercel.app)
```

### Configurar Domínio Personalizado no Vercel

```
1. Vercel → projeto → Settings → Domains
2. Adicionar: remunaIA.com.br
3. Vercel mostra os registros DNS para configurar no Registro.br:
   - Tipo A: @ → 76.76.21.21
   - Tipo CNAME: www → cname.vercel-dns.com
4. No Registro.br → DNS → adicionar os registros
5. Aguardar propagação DNS (até 24h, geralmente < 1h)
6. SSL automático via Vercel (Let's Encrypt)
```

### CI/CD Automático

Cada `git push` para `main` dispara deploy automático no Vercel. Pull requests geram deploy de preview com URL única.

```bash
# Fluxo de trabalho
git add .
git commit -m "feat: adicionar seção de benchmark"
git push origin main
# → Vercel detecta push → build → deploy em ~2 min
```

---

## 5. Google AI Studio (Gemini API)

```
1. Acessar aistudio.google.com
2. Criar API Key → copiar
3. Testar no playground: modelo gemini-1.5-flash
4. Adicionar a chave nos secrets do Supabase:
   supabase secrets set GEMINI_API_KEY=AIza...
5. Free tier: 1.500 requests/dia, 1M tokens/min
   Monitorar uso em: aistudio.google.com/usage
```

---

## 6. Stripe — Passo a Passo Completo

### Criar produtos e preços

```
1. Acessar dashboard.stripe.com → Products → Add product
2. Criar Starter:
   Nome: RemunaIA Starter
   Preço: R$ 497,00 / mês recorrente
   Copiar price_id: price_xxxxx → STRIPE_PRICE_STARTER
3. Criar Professional:
   Nome: RemunaIA Professional
   Preço: R$ 1.297,00 / mês
   Copiar price_id → STRIPE_PRICE_PROFESSIONAL
4. Criar Enterprise:
   Nome: RemunaIA Enterprise
   Preço: R$ 2.997,00 / mês
   Copiar price_id → STRIPE_PRICE_ENTERPRISE
```

### Criar Payment Links

```
1. Stripe → Payment Links → New
2. Selecionar produto Starter → gerar link
3. Adicionar parâmetro: ?client_reference_id={user_id} (para identificar usuário)
4. URL de sucesso: https://remunaIA.com.br/conta?payment=success
5. Copiar link → VITE_STRIPE_STARTER_LINK
6. Repetir para Professional e Enterprise
```

### Configurar Webhook

```
1. Stripe → Developers → Webhooks → Add endpoint
2. URL: https://[project-id].supabase.co/functions/v1/stripe-webhook
3. Eventos a escutar:
   - customer.subscription.created
   - customer.subscription.updated
   - customer.subscription.deleted
4. Copiar Signing secret → whsec_xxx → STRIPE_WEBHOOK_SECRET
5. Supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
```

### Modo Teste → Produção

```
Usar chaves sk_test_ e pk_test_ durante o desenvolvimento.
Trocar para sk_live_ e pk_live_ apenas no lançamento público.
Atualizar variáveis no Vercel ao mudar para produção.
```

---

## 7. Resend (Emails)

```
1. resend.com → Criar conta
2. Domains → Add Domain → remunaIA.com.br
3. Adicionar registros DNS no Registro.br (SPF, DKIM, DMARC)
4. API Keys → Create API Key → copiar
5. supabase secrets set RESEND_API_KEY=re_...
6. Testar envio para email real antes do lançamento
```

---

## 8. Posthog (Analytics)

```
1. posthog.com → Criar conta
2. Projeto: RemunaIA | Região: EU Cloud (LGPD)
3. Copiar API key (phc_...)
4. Adicionar VITE_POSTHOG_KEY no Vercel
5. Eventos a rastrear (adicionar no código):
   - user_signed_up
   - simulation_started
   - simulation_completed
   - pdf_exported
   - upgrade_clicked
   - subscription_started
```

```typescript
// src/lib/analytics.ts
import posthog from 'posthog-js'

export const track = (event: string, props?: Record<string, any>) => {
  posthog.capture(event, props)
}
// Uso: track('simulation_completed', { tipo: 'promocao', plano: 'trial' })
```

---

## 9. Limites Free Tier e Quando Escalar

| Serviço | Limite Free | Quando escalar | Custo próximo nível |
|---|---|---|---|
| Supabase | 500MB banco, 50k req/dia | ~400MB ou 40k req/dia | R$125/mês (Pro) |
| Vercel | 100GB bandwidth/mês | Tráfego alto (>500 usuários ativos) | R$100/mês (Pro) |
| Gemini API | 1.500 req/dia | Quando ultrapassar ~1.200/dia | ~R$0,07/1M tokens |
| Resend | 3.000 emails/mês | >2.500 emails/mês | R$50/mês (3k/dia) |
| Posthog | 1M eventos/mês | >800k eventos/mês | R$0 até 1M (gratuito para sempre) |
| GitHub | Repositórios ilimitados | — | Gratuito |

**Estimativa de quando cada free tier é atingido:**
- Supabase 500MB: ~500.000 simulações armazenadas (bem além do piloto)
- Gemini 1.500/dia: ~1.500 usuários fazendo 1 simulação/dia
- Resend 3.000/mês: ~3.000 usuários cadastrados
- **Conclusão:** free tiers suportam confortavelmente os primeiros 200 clientes

---

## 10. Procedimento de Deploy de Nova Versão

```bash
# 1. Desenvolver e testar localmente
npm run dev

# 2. Verificar que não há erros de TypeScript
npm run build

# 3. Commit com mensagem descritiva
git add .
git commit -m "feat: adicionar análise de equidade interna"

# 4. Push para main → deploy automático no Vercel
git push origin main

# 5. Acompanhar deploy em vercel.com/[seu-usuario]/remunaIA
# 6. Verificar preview URL antes de promover (Vercel faz automaticamente)
# 7. Após deploy: testar 1 simulação completa no produto real
```

---

## 11. Procedimento de Rollback

Se algo der errado após um deploy:

```
1. Acessar vercel.com → projeto remunaIA → Deployments
2. Identificar o último deploy estável (antes do problema)
3. Clicar nos 3 pontos → "Promote to Production"
4. Vercel reverte para aquele deploy em < 30 segundos
5. Investigar o problema no código antes de tentar novo deploy
```

Para rollback do banco de dados (ex: migração com problema):
```sql
-- Manter script de rollback para cada migração
-- Exemplo: reverter adição de coluna
ALTER TABLE public.simulacoes DROP COLUMN IF EXISTS nova_coluna;
```

---

## 12. Monitoramento

### O que verificar semanalmente
- Posthog: usuários ativos, simulações realizadas, PDFs exportados
- Vercel Analytics: página mais acessada, taxa de erro
- Supabase: tamanho do banco, queries lentas
- Stripe: MRR, churn, novas assinaturas
- Google AI Studio: uso da Gemini API (% do free tier)

### Alertas a configurar
- Supabase: alerta por email quando banco atingir 400MB
- Vercel: alerta de erro rate > 1%
- Stripe: alerta de pagamento com falha
