# Estrutura de Custos — RemunaIA

**Versão:** 1.0 | **Atualizado em:** 04/04/2026

---

## 1. Custos — Fase Piloto (0–100 clientes)

| Item | Tipo | Custo/mês | Observação |
|---|---|---|---|
| Microsoft 365 Copilot Personal | Já pago | R$ 0 adicional | Desenvolvimento + Copilot + Office |
| Canva Pro | Já pago | R$ 0 adicional | Design + landing page + conteúdo |
| Domínio remunaIA.com.br | Fixo | R$ 4 | R$50/ano via Registro.br |
| Supabase | Gratuito | R$ 0 | Free tier: 500MB + 50k req/dia |
| Vercel | Gratuito | R$ 0 | Free tier: 100GB bandwidth |
| GitHub | Gratuito | R$ 0 | Repositório privado |
| Gemini API | Gratuito | R$ 0 | 1.500 req/dia free |
| Stripe | % variável | ~2,9% da receita | Sem mensalidade |
| Resend | Gratuito | R$ 0 | 3.000 emails/mês |
| Posthog | Gratuito | R$ 0 | 1M eventos/mês |
| Crisp | Gratuito | R$ 0 | 1 agente, histórico 30 dias |
| **TOTAL FIXO ADICIONAL** | | **R$ 4/mês** | |
| **TOTAL VARIÁVEL** | | **~2,9% da receita** | |

---

## 2. Margem Bruta por Plano — Piloto

| Plano | Receita | Custo Stripe | Custo IA (estimado) | Outros | **Margem Bruta** | **% Margem** |
|---|---|---|---|---|---|---|
| Starter | R$ 497 | R$ 14,71 | R$ 0 | R$ 0,20 | **R$ 482,09** | **97%** |
| Professional | R$ 1.297 | R$ 38,01 | R$ 0 | R$ 0,20 | **R$ 1.258,79** | **97%** |
| Enterprise | R$ 2.997 | R$ 87,21 | R$ 0 | R$ 0,20 | **R$ 2.909,59** | **97%** |
| **Médio ponderado** | R$ 760 | R$ 22,34 | R$ 0 | R$ 0,20 | **R$ 737,46** | **~97%** |

> Margem bruta de ~97% é excepcional para SaaS — resultado de custo de infra próximo de zero no piloto.

---

## 3. Custos por Fase de Crescimento

### Fase 2 — 100–300 clientes (M6–M18)

| Item | Custo/mês | Gatilho |
|---|---|---|
| Supabase Pro | R$ 125 | Banco próximo de 500MB ou >50k req/dia |
| Vercel Pro | R$ 100 | Bandwidth > 80GB ou deploys frequentes |
| Gemini API pago | R$ 50–200 | >1.200 req/dia no free tier |
| Resend básico | R$ 50 | >3.000 emails/mês |
| Microsoft 365 Business (upgrade) | R$ 100 | Quando precisar de mais recursos |
| **Total fixo adicional** | **R$ 425–575/mês** | |

### Fase 3 — 300–1.000 clientes (M18–M36)

| Item | Custo/mês | Observação |
|---|---|---|
| Supabase Pro | R$ 125 | Mantém |
| Vercel Pro | R$ 100 | Mantém |
| Gemini API | R$ 200–600 | Volume crescente |
| Resend | R$ 100 | ~10.000 emails/mês |
| Crisp Pro | R$ 100 | Suporte mais robusto |
| Primeiro recurso humano (CS/suporte part-time) | R$ 2.000–3.000 | Quando churn ameaçar crescimento |
| **Total fixo** | **~R$ 2.625–4.025/mês** | Sem salário de recurso humano |

---

## 4. COGS (Custo de Servir 1 Cliente por Mês)

| Fase | Clientes | Custo Total Infra | COGS por Cliente | Margem Bruta % |
|---|---|---|---|---|
| Piloto | 0–100 | R$ 4 | R$ 0,04 | ~97% |
| Crescimento | 100–300 | R$ 500 | R$ 1,67–5,00 | ~96% |
| Escala 1 | 300–1.000 | R$ 2.625 | R$ 2,63–8,75 | ~96% |
| Escala 2 | 1.000+ | R$ 8.000 | R$ 8,00+ | ~95% |

> Para referência: Benchmarks SaaS B2B têm COGS entre 15-30% (margem 70-85%). RemunaIA opera com margem de ~97% graças ao custo de IA gratuito.

---

## 5. CAC por Canal

| Canal | Custo direto/mês | Leads/mês | Clientes/mês | CAC |
|---|---|---|---|---|
| LinkedIn orgânico (Carla) | R$ 0 (só tempo) | 30 | 3 | R$ 0 |
| Outbound LinkedIn | R$ 0 (só tempo) | 50 | 5 | R$ 0 |
| Parceria consultoria (20% comissão) | R$ 100–300 | 10 | 2 | R$ 50–150 |
| Conteúdo/SEO | R$ 0 | 20 | 1 | R$ 0 |
| **CAC médio ponderado** | | | | **~R$ 20–50** |

> CAC próximo de zero é a principal vantagem de um negócio construído sobre distribuição orgânica (LinkedIn + conteúdo).

---

## 6. Análise de Ponto de Equilíbrio

| Cenário | Custo Fixo/mês | Receita para Break-even | Clientes necessários |
|---|---|---|---|
| Piloto (domínio apenas) | R$ 4 | R$ 4 | 0,008 clientes (qualquer 1 cliente) |
| Fase 2 (com upgrades de infra) | R$ 500 | R$ 500 | 1 cliente Starter |
| Fase 3 (com 1 recurso humano PT) | R$ 5.000 | R$ 5.000 | 10 clientes Starter |

**Conclusão:** O negócio é break-even desde o primeiro cliente pagante no piloto.

---

## 7. Quando o Free Tier de Cada Serviço Esgota

| Serviço | Free Tier | Esgota quando | Custo próximo nível | Ação |
|---|---|---|---|---|
| Supabase | 500MB banco | ~500k simulações | R$125/mês | Monitorar tamanho mensalmente |
| Vercel | 100GB bandwidth | ~500 usuários ativos intensos | R$100/mês | Monitorar no dashboard |
| Gemini API | 1.500 req/dia | ~1.500 simulações/dia | ~R$0,07/1M tokens | Monitorar Google AI Studio |
| Resend | 3.000 emails/mês | ~3.000 usuários cadastrados | R$50/mês (básico) | Monitorar no dashboard |
| Posthog | 1M eventos/mês | ~1M interações de usuário | Gratuito para sempre até 1M | Nenhuma ação necessária |
