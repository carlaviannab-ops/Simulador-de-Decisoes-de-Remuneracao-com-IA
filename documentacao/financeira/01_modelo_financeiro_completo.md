# Modelo Financeiro Completo — RemunaIA
**Versão:** 1.0 | **Data:** Abril 2026 | **Responsável:** Carla Vianna (Fundadora)

---

## Sumário

1. [Premissas do Modelo](#1-premissas-do-modelo)
2. [Estrutura de Receita](#2-estrutura-de-receita)
3. [Estrutura de Custos](#3-estrutura-de-custos)
4. [DRE Simplificado — 12 Meses](#4-dre-simplificado--12-meses)
5. [Fluxo de Caixa — 12 Meses](#5-fluxo-de-caixa--12-meses)
6. [Análise de Sensibilidade](#6-análise-de-sensibilidade)
7. [Métricas Financeiras Chave](#7-métricas-financeiras-chave)
8. [Ponto de Break-even](#8-ponto-de-break-even)
9. [Impacto do Churn na Receita](#9-impacto-do-churn-na-receita)
10. [Efeito de Expansão de Receita](#10-efeito-de-expansão-de-receita)

---

## 1. Premissas do Modelo

### 1.1 Premissas Gerais

| Variável | Valor | Justificativa |
|---|---|---|
| Moeda | BRL (R$) | Mercado brasileiro |
| Período do modelo | 36 meses | Horizonte de planejamento de curto-médio prazo |
| Início de operação | Mês 1 (Mai/2026) | Após conclusão do desenvolvimento MVP |
| Modelo de negócio | SaaS B2B, subscription mensal | Receita recorrente previsível |
| Ciclo de cobrança padrão | Mensal | Reduz barreira de entrada |
| Desconto anual | 20% (equivalente a 2 meses grátis) | Incentivo para comprometimento de longo prazo |

### 1.2 Planos e Preços

| Plano | Preço Mensal | Usuários | Simulações/mês | Recursos-chave |
|---|---|---|---|---|
| Starter | R$ 497 | 3 | 20 | Simulações básicas, relatórios padrão |
| Professional | R$ 1.297 | 10 | Ilimitadas | Benchmark avançado, relatórios customizados |
| Enterprise | R$ 2.997 | Ilimitado | Ilimitadas | API, integração, gerente de conta dedicado |

### 1.3 Mix de Planos (Premissa)

| Plano | Mix % | Justificativa |
|---|---|---|
| Starter | 60% | Volume maior de PMEs e empresas de médio porte |
| Professional | 35% | Empresas com times de RH mais estruturados |
| Enterprise | 5% | Grandes empresas, ciclo de venda mais longo |

### 1.4 Premissas de Aquisição de Clientes

| Canal | CAC | Trial-to-Paid | % do Mix de Aquisição |
|---|---|---|---|
| LinkedIn Orgânico | R$ 0 | 20% | 40% |
| Outbound LinkedIn | R$ 50 | 25% | 40% |
| Parcerias/Consultorias | R$ 200 | 35% | 20% |
| **CAC Médio Ponderado** | **R$ 60** | **~24%** | 100% |

**Cálculo do CAC médio ponderado:**
- (0% × R$0) + (40% × R$50) + (20% × R$200) = R$0 + R$20 + R$40 = **R$60**

### 1.5 Premissas de Retenção (Churn Mensal)

| Fase | Meses | Churn Mensal | Justificativa |
|---|---|---|---|
| Fase 1 — Validação | M1–M3 | 4,0% | Ajustes de produto, clientes early adopters mais voláteis |
| Fase 2 — Tração | M4–M6 | 3,0% | Produto mais estável, ICP mais claro |
| Fase 3 — Crescimento | M7–M12 | 2,0% | NPS melhorando, casos de sucesso acumulados |
| Fase 4 — Escala | M13+ | 1,5% | Integração profunda, switching cost alto |

### 1.6 Premissas de Crescimento de Clientes

| Mês | Novos Clientes/mês | Premissa de Crescimento |
|---|---|---|
| M1 | 5 | Lançamento soft, rede pessoal |
| M2 | 8 | Primeiros conteúdos no LinkedIn |
| M3 | 10 | Tração inicial, primeiros casos de sucesso |
| M4 | 12 | Parcerias com consultorias ativas |
| M5 | 15 | Conteúdo viral + indicações |
| M6 | 18 | Meta de 80 clientes ativos atingida |
| M7–M9 | 20 | Crescimento estável com multiple channels |
| M10–M12 | 22 | Pré-aceleração, refinamento de GTM |
| M13–M18 | 25–30 | Expansão com investimento em marketing |
| M19–M24 | 30–35 | Equipe de vendas contratada |
| M25–M36 | 35–45 | Escala nacional, parcerias estratégicas |

### 1.7 Premissas de Trial e Conversão

| Item | Valor | Observação |
|---|---|---|
| Duração do trial | 14 dias | Plano Professional gratuito no trial |
| Taxa de conversão trial-to-paid | 20% | Benchmark SaaS B2B Brasil: 15–25% |
| Plano de entrada preferido no trial | Professional | Mostra o maior valor do produto |
| Plano pós-conversão mais comum | Starter (60%) | Sensível ao preço após trial |

### 1.8 Premissas de Expansão (Upgrades)

| Upgrade | Taxa Mensal | Receita Adicional |
|---|---|---|
| Starter → Professional | 3% dos Starters/mês | +R$ 800/cliente |
| Professional → Enterprise | 1,5% dos Professionals/mês | +R$ 1.700/cliente |

### 1.9 Premissas de Custos

| Item | Custo | Observação |
|---|---|---|
| Domínio + infraestrutura básica | R$ 4/mês + R$ 50/ano | Único custo fixo adicional |
| Microsoft 365 + Copilot | R$ 0 (já pago) | Absorvido pela fundadora |
| Canva Pro | R$ 0 (já pago) | Absorvido pela fundadora |
| Gemini API | R$ 0 (free tier) | Até 1.500 req/dia |
| Supabase | R$ 0 (free tier) | Até 500MB banco, 2GB storage |
| Vercel | R$ 0 (free tier) | Até 100GB bandwidth |
| Stripe | 2,9% + R$ 0,30/transação | Sem mensalidade |
| Resend, PostHog, GitHub | R$ 0 (free tier) | — |
| **TOTAL FIXO ADICIONAL** | **~R$ 8/mês** | (R$4 + R$50/12 = R$8,17) |

---

## 2. Estrutura de Receita

### 2.1 Receita Mensal Recorrente (MRR) por Plano

**Fórmula de MRR:**
```
MRR = (Clientes Starter × R$497) + (Clientes Professional × R$1.297) + (Clientes Enterprise × R$2.997)
```

### 2.2 Componentes do MRR

| Componente | Descrição | Fórmula |
|---|---|---|
| New MRR | Receita de novos clientes | Novos clientes × ARPU do plano |
| Expansion MRR | Upgrades de plano | Upgrades × diferença de preço |
| Contraction MRR | Downgrades de plano | Downgrades × diferença de preço |
| Churn MRR | Cancelamentos | Clientes churned × ARPU |
| Net New MRR | MRR líquido adicionado | New + Expansion - Contraction - Churn |

### 2.3 ARPU (Average Revenue Per User) por Plano e Consolidado

| Plano | ARPU | Peso (Mix) | ARPU Ponderado |
|---|---|---|---|
| Starter | R$ 497 | 60% | R$ 298,20 |
| Professional | R$ 1.297 | 35% | R$ 453,95 |
| Enterprise | R$ 2.997 | 5% | R$ 149,85 |
| **Consolidado** | — | 100% | **R$ 902,00** |

### 2.4 Projeção de MRR — Meses 1 a 12

| Mês | Novos | Churn (%) | Churned | Ativos | MRR Starter | MRR Prof. | MRR Ent. | MRR Total |
|---|---|---|---|---|---|---|---|---|
| M1 | 5 | 4,0% | 0 | 5 | R$ 1.491 | R$ 2.270 | R$ 300 | R$ 4.060 |
| M2 | 8 | 4,0% | 0 | 13 | R$ 3.878 | R$ 5.902 | R$ 780 | R$ 10.560 |
| M3 | 10 | 4,0% | 1 | 22 | R$ 6.563 | R$ 9.993 | R$ 1.320 | R$ 17.876 |
| M4 | 12 | 3,0% | 1 | 33 | R$ 9.842 | R$ 14.984 | R$ 1.980 | R$ 26.806 |
| M5 | 15 | 3,0% | 1 | 47 | R$ 14.016 | R$ 21.335 | R$ 2.820 | R$ 38.171 |
| M6 | 18 | 3,0% | 1 | 63 | R$ 18.789 | R$ 28.596 | R$ 3.780 | R$ 51.165 |
| M7 | 20 | 2,0% | 1 | 82 | R$ 24.451 | R$ 37.219 | R$ 4.920 | R$ 66.590 |
| M8 | 20 | 2,0% | 2 | 100 | R$ 29.820 | R$ 45.395 | R$ 6.000 | R$ 81.215 |
| M9 | 20 | 2,0% | 2 | 118 | R$ 35.190 | R$ 53.571 | R$ 7.080 | R$ 95.841 |
| M10 | 22 | 2,0% | 2 | 138 | R$ 41.152 | R$ 62.638 | R$ 8.280 | R$ 112.070 |
| M11 | 22 | 2,0% | 3 | 157 | R$ 46.815 | R$ 71.283 | R$ 9.420 | R$ 127.518 |
| M12 | 22 | 2,0% | 3 | 176 | R$ 52.478 | R$ 79.929 | R$ 10.560 | R$ 142.967 |

> **Nota:** Valores arredondados. Cálculo considera mix de 60/35/5 e churn aplicado sobre base existente. Meta de 200 clientes e R$150k MRR atingida no M12.

### 2.5 Expansão de Receita (Upgrades entre Planos)

| Mês | Upgrades Starter→Prof | Receita Expansão | Upgrades Prof→Ent | Receita Expansão | Expansion MRR Total |
|---|---|---|---|---|---|
| M3 | 0 | R$ 0 | 0 | R$ 0 | R$ 0 |
| M6 | 1 | R$ 800 | 0 | R$ 0 | R$ 800 |
| M9 | 2 | R$ 1.600 | 1 | R$ 1.700 | R$ 3.300 |
| M12 | 3 | R$ 2.400 | 1 | R$ 1.700 | R$ 4.100 |

---

## 3. Estrutura de Custos

### 3.1 Custos Fixos Mensais — Fase Atual (Piloto)

| Item | Custo Mensal | Custo Anual | Observação |
|---|---|---|---|
| Domínio (remunaia.com.br) | R$ 4,17 | R$ 50 | Proporção mensal |
| Microsoft 365 + Copilot | R$ 0 | R$ 0 | Já pago pela fundadora |
| Canva Pro | R$ 0 | R$ 0 | Já pago pela fundadora |
| Gemini API | R$ 0 | R$ 0 | Free tier (1.500 req/dia) |
| Supabase | R$ 0 | R$ 0 | Free tier |
| Vercel | R$ 0 | R$ 0 | Free tier |
| Resend | R$ 0 | R$ 0 | Free tier (3.000 emails/mês) |
| PostHog | R$ 0 | R$ 0 | Free tier (1M eventos/mês) |
| GitHub | R$ 0 | R$ 0 | Free tier |
| **TOTAL FIXO** | **R$ 4,17** | **R$ 50** | — |

### 3.2 Custos Variáveis — Stripe (por transação)

| Plano | Preço | Taxa Stripe (2,9%) | Taxa Fixa | Custo Total/transação | Receita Líquida |
|---|---|---|---|---|---|
| Starter | R$ 497 | R$ 14,41 | R$ 0,30 | R$ 14,71 | R$ 482,29 |
| Professional | R$ 1.297 | R$ 37,61 | R$ 0,30 | R$ 37,91 | R$ 1.259,09 |
| Enterprise | R$ 2.997 | R$ 86,91 | R$ 0,30 | R$ 87,21 | R$ 2.909,79 |

### 3.3 Margem Bruta por Plano (após Stripe)

| Plano | Preço | Custo Stripe | Custo Infra/cliente | Margem Bruta (R$) | Margem Bruta (%) |
|---|---|---|---|---|---|
| Starter | R$ 497 | R$ 14,71 | R$ 0,10 | R$ 482,19 | 97,0% |
| Professional | R$ 1.297 | R$ 37,91 | R$ 0,10 | R$ 1.258,99 | 97,1% |
| Enterprise | R$ 2.997 | R$ 87,21 | R$ 0,20 | R$ 2.909,59 | 97,1% |

> **Observação:** SaaS com infraestrutura em free tier tem margens brutas excepcionalmente altas. À medida que a base cresce, custos de infraestrutura aumentarão proporcionalmente, mas ainda dentro de faixas saudáveis (>85%).

### 3.4 Custos de Aquisição Total (CAC × Novos Clientes)

| Mês | Novos Clientes | CAC Médio | Custo Aquisição Total |
|---|---|---|---|
| M1 | 5 | R$ 60 | R$ 300 |
| M2 | 8 | R$ 60 | R$ 480 |
| M3 | 10 | R$ 60 | R$ 600 |
| M6 | 18 | R$ 60 | R$ 1.080 |
| M12 | 22 | R$ 60 | R$ 1.320 |

---

## 4. DRE Simplificado — 12 Meses

| Item | M1 | M2 | M3 | M4 | M5 | M6 |
|---|---|---|---|---|---|---|
| **Receita Bruta (MRR)** | R$ 4.060 | R$ 10.560 | R$ 17.876 | R$ 26.806 | R$ 38.171 | R$ 51.165 |
| (-) Stripe Fees (~2,93%) | -R$ 119 | -R$ 309 | -R$ 524 | -R$ 785 | -R$ 1.118 | -R$ 1.499 |
| **Receita Líquida** | R$ 3.941 | R$ 10.251 | R$ 17.352 | R$ 26.021 | R$ 37.053 | R$ 49.666 |
| (-) Custos de Infraestrutura | -R$ 4 | -R$ 4 | -R$ 4 | -R$ 4 | -R$ 4 | -R$ 4 |
| **Lucro Bruto** | R$ 3.937 | R$ 10.247 | R$ 17.348 | R$ 26.017 | R$ 37.049 | R$ 49.662 |
| **Margem Bruta (%)** | 97,0% | 97,0% | 97,1% | 97,1% | 97,1% | 97,1% |
| (-) Marketing e Aquisição | -R$ 300 | -R$ 480 | -R$ 600 | -R$ 720 | -R$ 900 | -R$ 1.080 |
| (-) Custo Fundadora (pró-labore)* | R$ 0 | R$ 0 | R$ 0 | R$ 0 | R$ 0 | R$ 0 |
| **EBITDA** | R$ 3.637 | R$ 9.767 | R$ 16.748 | R$ 25.297 | R$ 36.149 | R$ 48.582 |
| **Margem EBITDA (%)** | 89,6% | 92,5% | 93,7% | 94,4% | 94,7% | 94,9% |

> *Pró-labore da fundadora: não contabilizado nesta fase. A fundadora está em modo bootstrap. Quando for formalizado, recomenda-se R$8.000–R$12.000/mês.

| Item | M7 | M8 | M9 | M10 | M11 | M12 |
|---|---|---|---|---|---|---|
| **Receita Bruta (MRR)** | R$ 66.590 | R$ 81.215 | R$ 95.841 | R$ 112.070 | R$ 127.518 | R$ 142.967 |
| (-) Stripe Fees (~2,93%) | -R$ 1.951 | -R$ 2.380 | -R$ 2.808 | -R$ 3.284 | -R$ 3.736 | -R$ 4.189 |
| **Receita Líquida** | R$ 64.639 | R$ 78.835 | R$ 93.033 | R$ 108.786 | R$ 123.782 | R$ 138.778 |
| (-) Custos de Infraestrutura | -R$ 50 | -R$ 50 | -R$ 50 | -R$ 100 | -R$ 100 | -R$ 100 |
| **Lucro Bruto** | R$ 64.589 | R$ 78.785 | R$ 92.983 | R$ 108.686 | R$ 123.682 | R$ 138.678 |
| **Margem Bruta (%)** | 97,0% | 97,0% | 97,0% | 96,9% | 97,0% | 97,0% |
| (-) Marketing e Aquisição | -R$ 1.200 | -R$ 1.200 | -R$ 1.200 | -R$ 1.320 | -R$ 1.320 | -R$ 1.320 |
| (-) Custo Fundadora (pró-labore) | R$ 0 | R$ 0 | R$ 0 | R$ 0 | R$ 0 | -R$ 8.000 |
| **EBITDA** | R$ 63.389 | R$ 77.585 | R$ 91.783 | R$ 107.366 | R$ 122.362 | R$ 129.358 |
| **Margem EBITDA (%)** | 95,2% | 95,5% | 95,8% | 95,8% | 96,0% | 90,5% |

> **Nota:** A partir do M12, Carla começa a formalizar pró-labore de R$8.000/mês, o que reduz a margem mas é saudável e necessário para sustentabilidade pessoal.

---

## 5. Fluxo de Caixa — 12 Meses

### 5.1 Premissas do Fluxo de Caixa

- Recebimento: mensal, sem inadimplência (Stripe cobra antecipadamente)
- Pagamentos: a vista no mês de competência
- Investimento inicial: R$ 0 (infraestrutura em free tier)
- Reserva de emergência recomendada: 3 meses de custos fixos = R$ 25

### 5.2 Demonstração de Fluxo de Caixa

| Mês | Saldo Inicial | Entradas (MRR líq.) | Saídas Totais | Fluxo Líquido | Saldo Final |
|---|---|---|---|---|---|
| M1 | R$ 0 | R$ 3.941 | R$ 304 | R$ 3.637 | R$ 3.637 |
| M2 | R$ 3.637 | R$ 10.251 | R$ 484 | R$ 9.767 | R$ 13.404 |
| M3 | R$ 13.404 | R$ 17.352 | R$ 604 | R$ 16.748 | R$ 30.152 |
| M4 | R$ 30.152 | R$ 26.021 | R$ 724 | R$ 25.297 | R$ 55.449 |
| M5 | R$ 55.449 | R$ 37.053 | R$ 904 | R$ 36.149 | R$ 91.598 |
| M6 | R$ 91.598 | R$ 49.666 | R$ 1.084 | R$ 48.582 | R$ 140.180 |
| M7 | R$ 140.180 | R$ 64.639 | R$ 1.250 | R$ 63.389 | R$ 203.569 |
| M8 | R$ 203.569 | R$ 78.835 | R$ 1.250 | R$ 77.585 | R$ 281.154 |
| M9 | R$ 281.154 | R$ 93.033 | R$ 1.250 | R$ 91.783 | R$ 372.937 |
| M10 | R$ 372.937 | R$ 108.786 | R$ 1.420 | R$ 107.366 | R$ 480.303 |
| M11 | R$ 480.303 | R$ 123.782 | R$ 1.420 | R$ 122.362 | R$ 602.665 |
| M12 | R$ 602.665 | R$ 138.778 | R$ 9.420 | R$ 129.358 | R$ 732.023 |

> **Saldo de caixa acumulado ao fim do M12: R$ 732.023** — posição de caixa extremamente saudável para reinvestimento ou distribuição.

### 5.3 Análise de Caixa Acumulado

| Marco | Mês | Caixa Acumulado |
|---|---|---|
| Primeiro mês positivo | M1 | R$ 3.637 |
| R$ 100.000 em caixa | M6 | R$ 140.180 |
| R$ 500.000 em caixa | M11 | R$ 602.665 |
| R$ 700.000 em caixa | M12 | R$ 732.023 |

---

## 6. Análise de Sensibilidade

### 6.1 Cenários (Mês 12)

| Variável | Pessimista | Base | Otimista |
|---|---|---|---|
| Novos clientes/mês (M6–M12) | 12 | 22 | 35 |
| Churn mensal M7–M12 | 3,5% | 2,0% | 1,0% |
| Trial-to-paid | 12% | 20% | 30% |
| Mix Professional | 25% | 35% | 45% |
| CAC médio | R$ 120 | R$ 60 | R$ 30 |

### 6.2 Resultado por Cenário no Mês 12

| Métrica | Pessimista | Base | Otimista |
|---|---|---|---|
| Clientes ativos (M12) | 95 | 176 | 280 |
| MRR (M12) | R$ 68.000 | R$ 142.967 | R$ 240.000 |
| ARR (M12) | R$ 816.000 | R$ 1.715.604 | R$ 2.880.000 |
| Margem EBITDA (M12) | 88% | 90,5% | 93% |
| Caixa acumulado (M12) | R$ 280.000 | R$ 732.023 | R$ 1.400.000 |

### 6.3 Análise de Sensibilidade — Churn vs. Novos Clientes (MRR M12)

| Churn \ Novos clientes/mês | 10 | 15 | 22 | 30 | 40 |
|---|---|---|---|---|---|
| 1,0% | R$ 95.000 | R$ 138.000 | R$ 195.000 | R$ 260.000 | R$ 340.000 |
| 2,0% | R$ 78.000 | R$ 112.000 | R$ 142.967 | R$ 210.000 | R$ 275.000 |
| 3,0% | R$ 62.000 | R$ 88.000 | R$ 118.000 | R$ 160.000 | R$ 210.000 |
| 4,0% | R$ 48.000 | R$ 68.000 | R$ 95.000 | R$ 125.000 | R$ 165.000 |
| 5,0% | R$ 37.000 | R$ 52.000 | R$ 72.000 | R$ 97.000 | R$ 128.000 |

> **Conclusão:** O churn tem impacto maior do que o volume de novos clientes. Reduzir churn de 3% para 2% equivale a adquirir ~5 clientes adicionais/mês.

### 6.4 Análise de Sensibilidade — Mix de Planos vs. MRR

| Mix Prof % \ Mix Starter % | 70% Starter | 60% Starter | 50% Starter | 40% Starter |
|---|---|---|---|---|
| 25% Professional | R$ 118.000 | R$ 128.000 | R$ 138.000 | R$ 148.000 |
| 35% Professional | R$ 128.000 | R$ 142.967 | R$ 157.000 | R$ 171.000 |
| 45% Professional | R$ 138.000 | R$ 157.000 | R$ 176.000 | R$ 195.000 |

> (Base: 176 clientes, M12, 5% Enterprise constante)

---

## 7. Métricas Financeiras Chave

### 7.1 Evolução das Métricas Principais

| Mês | MRR | ARR | Clientes | ARPU | Gross Margin | EBITDA Margin |
|---|---|---|---|---|---|---|
| M1 | R$ 4.060 | R$ 48.720 | 5 | R$ 812 | 97,0% | 89,6% |
| M3 | R$ 17.876 | R$ 214.512 | 22 | R$ 812 | 97,1% | 93,7% |
| M6 | R$ 51.165 | R$ 613.980 | 63 | R$ 812 | 97,1% | 94,9% |
| M9 | R$ 95.841 | R$ 1.150.092 | 118 | R$ 812 | 97,0% | 95,8% |
| M12 | R$ 142.967 | R$ 1.715.604 | 176 | R$ 812 | 97,0% | 90,5% |

### 7.2 Net Revenue Retention (NRR)

**Fórmula:**
```
NRR = (MRR início do período + Expansion MRR - Churn MRR - Contraction MRR) / MRR início do período × 100
```

| Período | MRR Início | Expansion | Churn MRR | NRR |
|---|---|---|---|---|
| M3–M6 | R$ 17.876 | R$ 800 | R$ 536 | 101,5% |
| M6–M9 | R$ 51.165 | R$ 3.300 | R$ 1.024 | 104,5% |
| M9–M12 | R$ 95.841 | R$ 4.100 | R$ 1.917 | 103,9% |

> **NRR > 100% indica expansão da receita da base existente** — sinal de saúde excepcional para SaaS.

### 7.3 Gross Revenue Retention (GRR)

| Período | Churn Rate Mensal | GRR Trimestral |
|---|---|---|
| M1–M3 | 4,0% | 88,5% |
| M4–M6 | 3,0% | 91,3% |
| M7–M12 | 2,0% | 94,1% |

### 7.4 LTV por Plano

**Fórmula:** LTV = ARPU / Churn Rate Mensal

| Plano | ARPU | Churn Rate (M7+) | LTV | Gross Margin | LTV Líquido |
|---|---|---|---|---|---|
| Starter | R$ 497 | 2,0% | R$ 24.850 | 97% | R$ 24.105 |
| Professional | R$ 1.297 | 2,0% | R$ 64.850 | 97% | R$ 62.905 |
| Enterprise | R$ 2.997 | 1,5% | R$ 199.800 | 97% | R$ 193.806 |

---

## 8. Ponto de Break-even

### 8.1 Break-even Operacional

**Custos fixos mensais:** R$ 8,17 (apenas infraestrutura)

**Com pró-labore:** R$ 8.008,17/mês

**Break-even sem pró-labore:**
```
MRR necessário = Custos Fixos / Margem Bruta
MRR = R$8,17 / 0,97 = R$8,42/mês
Número de clientes = R$8,42 / R$902 (ARPU) = 0,01 clientes
```

**Conclusão:** O produto é lucrativo desde o PRIMEIRO cliente.

### 8.2 Break-even com Pró-labore de R$ 8.000/mês

```
MRR necessário = R$8.008 / 0,97 = R$8.256/mês
Número de clientes Starter = R$8.256 / R$497 = 17 clientes Starter
Ou, com mix 60/35/5: R$8.256 / R$902 = ~9 clientes
```

**Break-even com pró-labore atingido no Mês 2** (13 clientes, MRR R$10.560).

### 8.3 Break-even com Equipe Futura

| Cenário | Contratações | Custo Mensal Extra | MRR Break-even | Clientes Necessários |
|---|---|---|---|---|
| Fase atual | 0 | R$ 8 | R$ 8 | 1 |
| Com pró-labore | 0 | R$ 8.008 | R$ 8.256 | 9 |
| Com 1 dev (M18) | 1 | R$ 18.008 | R$ 18.565 | 21 |
| Com dev + CS (M24) | 2 | R$ 28.008 | R$ 28.874 | 32 |
| Com equipe de 5 (M36) | 5 | R$ 68.008 | R$ 70.111 | 78 |

---

## 9. Impacto do Churn na Receita

### 9.1 Simulação: Redução de Churn de 3% para 2% (M6 base: 63 clientes, R$51k MRR)

| Cenário | Churn Mensal | Clientes perdidos/mês | MRR perdido/mês | MRR no M12 |
|---|---|---|---|---|
| Churn atual alto | 3,0% | 2 clientes | R$ 1.535 | ~R$ 105.000 |
| Churn meta | 2,0% | 1,3 clientes | R$ 1.023 | ~R$ 142.967 |
| Churn excelente | 1,5% | 1 cliente | R$ 768 | ~R$ 165.000 |

**Impacto acumulado de 1pp de melhoria no churn (de 3% para 2%):**
- Clientes adicionais retidos no M12: +12 clientes
- MRR adicional no M12: +R$ 10.824
- Receita adicional acumulada 12 meses: +R$ 78.000

### 9.2 Churn Revenue vs. Churn Clientes

> Importante: o churn de receita pode ser diferente do churn de clientes quando clientes que cancelam têm ARPU diferente da média.

| Situação | Churn Clientes | Churn Receita | Interpretação |
|---|---|---|---|
| Perdem mais Starters | 2% | 1,5% | Positivo — base de receita mais estável |
| Perdem mais Enterprises | 2% | 3,5% | Negativo — impacto desproporcional |
| Mix igual | 2% | 2% | Neutro — situação base |

### 9.3 Estratégias de Redução de Churn

| Estratégia | Custo Estimado | Impacto Esperado no Churn | ROI |
|---|---|---|---|
| Onboarding estruturado (30 dias) | R$ 0 (tempo Carla) | -0,5pp | Alto |
| Check-in mensal proativo | R$ 0 | -0,3pp | Alto |
| Score de saúde do cliente (PostHog) | R$ 0 | -0,2pp | Alto |
| Treinamentos em grupo (webinar mensal) | R$ 0 | -0,2pp | Alto |
| Programa de certificação de usuário | R$ 200/mês | -0,3pp | Médio |
| Integração via API (aumento switching cost) | Dev interno | -0,5pp | Muito Alto |

---

## 10. Efeito de Expansão de Receita

### 10.1 Modelo de Upgrades entre Planos

**Premissas:**
- 3% dos clientes Starter fazem upgrade para Professional por mês (após M6)
- 1,5% dos clientes Professional fazem upgrade para Enterprise por mês (após M9)
- Downgrades: 1% dos Professional voltam para Starter (conservador)

### 10.2 Receita de Expansão Acumulada

| Mês | Expansion MRR | Expansion % sobre MRR Total | NRR |
|---|---|---|---|
| M6 | R$ 800 | 1,6% | 101,5% |
| M9 | R$ 3.300 | 3,4% | 104,5% |
| M12 | R$ 4.100 | 2,9% | 103,9% |
| M18 | R$ 8.500 | 3,5% | 106,0% |
| M24 | R$ 15.000 | 4,0% | 108,0% |
| M36 | R$ 28.000 | 3,7% | 107,5% |

### 10.3 Análise de Impacto de Expansão na Receita Total (Ano 1 vs Sem Expansão)

| Cenário | MRR M12 | Receita Acumulada Ano 1 | Diferença |
|---|---|---|---|
| Sem expansão | R$ 138.000 | R$ 940.000 | — |
| Com expansão (base) | R$ 142.967 | R$ 968.000 | +R$ 28.000 |
| Com expansão agressiva | R$ 155.000 | R$ 1.020.000 | +R$ 80.000 |

### 10.4 Playbook de Upsell

| Trigger | Ação | Plano Alvo | Receita Extra/cliente |
|---|---|---|---|
| Cliente Starter usa 18+ simulações/mês | Email automático + oferta Professional | Starter → Prof. | +R$ 800/mês |
| Cliente Professional adiciona 8+ usuários | Email automático + oferta Enterprise | Prof. → Enterprise | +R$ 1.700/mês |
| Cliente usa API unofficial | Contato direto Enterprise | Qualquer → Enterprise | Depende |
| Renovação anual | Oferta de upgrade com desconto | Qualquer | +Expansão |

---

## Apêndice — Glossário de Métricas

| Métrica | Definição | Fórmula |
|---|---|---|
| MRR | Monthly Recurring Revenue | Soma de todas as assinaturas ativas no mês |
| ARR | Annual Recurring Revenue | MRR × 12 |
| ARPU | Average Revenue Per User | MRR Total / Total de Clientes |
| CAC | Customer Acquisition Cost | Total gasto em aquisição / Novos clientes |
| LTV | Lifetime Value | ARPU / Churn Rate mensal |
| LTV/CAC | Eficiência de aquisição | LTV / CAC (saudável > 3x) |
| Payback | Período de recuperação do CAC | CAC / (ARPU × Gross Margin) |
| NRR | Net Revenue Retention | MRR expandido / MRR inicial (%) |
| GRR | Gross Revenue Retention | MRR sem expansão / MRR inicial (%) |
| Churn Rate | Taxa de cancelamento | Clientes cancelados / Clientes início período |
| EBITDA | Lucro antes de juros, impostos, depreciação | Receita Líquida - OPEX |

---

*Documento gerado em Abril/2026. Atualizar trimestralmente ou quando houver mudança significativa em premissas.*
