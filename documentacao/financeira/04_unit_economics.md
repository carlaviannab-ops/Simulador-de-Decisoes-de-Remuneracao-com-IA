# Unit Economics — RemunaIA

**Versão:** 1.0 | **Atualizado em:** 04/04/2026

---

## 1. Métricas por Plano

### Cálculo do LTV (Lifetime Value)

```
LTV = ARPU / Churn Rate Mensal
```

| Plano | ARPU (R$/mês) | Churn mensal (piloto) | LTV (piloto) | LTV (maduro, 1,5%) |
|---|---|---|---|---|
| Starter | R$ 497 | 4% | R$ 12.425 | R$ 33.133 |
| Professional | R$ 1.297 | 3% | R$ 43.233 | R$ 86.467 |
| Enterprise | R$ 2.997 | 2% | R$ 149.850 | R$ 199.800 |
| **Médio ponderado** | **R$ 760** | **3,5%** | **R$ 21.714** | **R$ 50.667** |

### CAC por Canal

| Canal | CAC estimado | Volume mensal |
|---|---|---|
| LinkedIn orgânico | R$ 0 | 3–5 clientes/mês |
| Outbound LinkedIn | R$ 0 | 5–10 clientes/mês |
| Parcerias (comissão 20%) | R$ 99–599 | 1–3 clientes/mês |
| **CAC médio** | **~R$ 50** | |

### LTV/CAC Ratio

| Plano | LTV (piloto) | CAC médio | **LTV/CAC** | Meta ideal (>3x) |
|---|---|---|---|---|
| Starter | R$ 12.425 | R$ 50 | **248x** | ✓✓✓ |
| Professional | R$ 43.233 | R$ 50 | **865x** | ✓✓✓ |
| Enterprise | R$ 149.850 | R$ 50 | **2.997x** | ✓✓✓ |

> LTV/CAC de 248x+ é excepcional. O padrão SaaS saudável é >3x. A distribuição orgânica (LinkedIn de Carla) é a principal responsável.

---

## 2. Payback Period

```
Payback = CAC / Margem Bruta Mensal por Cliente
```

| Plano | CAC | Margem bruta/mês | Payback |
|---|---|---|---|
| Starter | R$ 50 | R$ 482 | **3 dias** |
| Professional | R$ 50 | R$ 1.259 | **1 dia** |
| Enterprise | R$ 50 | R$ 2.910 | **< 1 dia** |

---

## 3. ARPU e MRR Médio

| Métrica | Piloto (mix atual) | Mês 12 | Mês 24 |
|---|---|---|---|
| ARPU | R$ 760 | R$ 777 | R$ 802 |
| MRR médio por cliente | R$ 760 | R$ 777 | R$ 802 |
| Expansão (upsell médio) | R$ 50/cliente | R$ 80/cliente | R$ 120/cliente |

---

## 4. Net Revenue Retention (NRR)

```
NRR = (MRR início do mês + expansão + reativações - churn - contrações) / MRR início do mês
```

**Cálculo exemplo — Mês 6 (37 clientes, MRR R$28.577):**
- Expansão (upgrades): +R$ 800 (estimado)
- Churn: -R$ 1.143 (4% de R$28.577)
- Contrações: -R$ 200
- **NRR = (28.577 + 800 - 1.143 - 200) / 28.577 = 97,3%**

**Meta de NRR por fase:**
| Fase | NRR Alvo |
|---|---|
| Piloto (M1-M6) | >95% |
| Crescimento (M7-M18) | >100% |
| Escala (M19+) | >110% |

> NRR > 100% significa que a expansão (upgrades) supera o churn — o negócio cresce mesmo sem novos clientes.

---

## 5. Gross Revenue Retention (GRR)

```
GRR = (MRR início - churn - contrações) / MRR início
GRR não considera expansão — mede quanto da base existente é retida
```

| Fase | Churn mensal | GRR estimado |
|---|---|---|
| Piloto (M1-M6) | 4% | 96% |
| Crescimento (M7-M12) | 3% | 97% |
| Escala (M13-M24) | 2% | 98% |
| Maduro (M25+) | 1,5% | 98,5% |

---

## 6. Cohort de Churn — Premissas e Impacto

### Por que o churn é maior no início
- Produto novo: bugs, UX não otimizada, funcionalidades faltando
- Onboarding fraco: usuários não ativam o valor
- ICP não completamente definido: alguns clientes inadequados

### Ações para reduzir churn
- Onboarding estruturado (email + vídeo + grupo WhatsApp)
- Alerta de 30 dias antes do churn provável (via Posthog: usuário não simulou em 14 dias)
- Check-in proativo de CS ao 30º e 60º dia
- Relatório mensal automático de saúde salarial (cria hábito)

### Impacto do churn no MRR (sensibilidade)

| Churn | Clientes ao M12 (partindo de 10/mês novos) | MRR ao M12 |
|---|---|---|
| 2% | 112 | R$ 85.120 |
| 4% (base) | 104 | R$ 80.817 |
| 6% | 92 | R$ 69.920 |
| 8% | 78 | R$ 59.280 |

---

## 7. Benchmarks SaaS B2B para Comparação

| Métrica | Benchmark SaaS B2B (early stage) | RemunaIA (piloto) |
|---|---|---|
| Gross Margin | 65-80% | ~97% |
| Monthly Churn | 2-5% | 4% (alvo) |
| LTV/CAC | >3x (saudável), >10x (ótimo) | 248x–2.997x |
| Payback period | <12 meses | <1 semana |
| NRR | >100% (saudável) | ~97% (crescer para >100%) |
| Trial-to-paid | 15-25% | 20% (alvo) |
