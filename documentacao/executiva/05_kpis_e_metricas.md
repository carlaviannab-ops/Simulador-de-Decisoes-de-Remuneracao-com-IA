# KPIs e Métricas — RemunaIA

**Versão:** 1.0 | **Atualizado em:** 04/04/2026

---

## 1. North Star Metric

**Simulações concluídas por mês**

Por quê: mede uso real do produto (não apenas cadastros). Uma simulação concluída = valor entregue. Mais simulações = mais valor = mais retenção = mais receita.

**Meta:** 500 simulações/mês ao final do Mês 6

---

## 2. Métricas de Produto

| Métrica | Definição | Meta M3 | Meta M6 | Meta M12 | Ferramenta |
|---|---|---|---|---|---|
| Simulações/mês | Total de simulações concluídas | 150 | 500 | 1.500 | Posthog + Supabase |
| Simulações/cliente/mês | Média de uso por cliente | 5 | 8 | 10 | Supabase |
| Taxa de ativação | % de trials que fazem 1ª simulação em 48h | 50% | 65% | 75% | Posthog |
| Taxa de exportação PDF | % de simulações que geram PDF | 40% | 55% | 65% | Posthog |
| Tempo até 1ª simulação | Minutos do cadastro à 1ª simulação | < 10 min | < 7 min | < 5 min | Posthog |
| Usuários ativos semanais (WAU) | Usuários únicos com ≥1 simulação/semana | 20 | 60 | 150 | Posthog |

---

## 3. Métricas de Negócio

| Métrica | Definição | Meta M3 | Meta M6 | Meta M12 |
|---|---|---|---|---|
| MRR | Receita recorrente mensal | R$ 9.300 | R$ 28.600 | R$ 80.800 |
| ARR | MRR × 12 | R$ 111k | R$ 343k | R$ 970k |
| Clientes pagantes | Total de assinantes ativos | 12 | 37 | 104 |
| Churn mensal | % de clientes que cancelam/mês | < 5% | < 4% | < 3% |
| NRR | Net Revenue Retention | > 95% | > 97% | > 100% |
| Trial-to-paid | % de trials que convertem | 15% | 20% | 22% |
| CAC médio | Custo de aquisição por cliente | < R$ 100 | < R$ 70 | < R$ 50 |
| LTV/CAC | Relação valor/custo de aquisição | > 100x | > 200x | > 300x |
| ARPU | Receita média por usuário | R$ 775 | R$ 773 | R$ 777 |

---

## 4. Métricas de Go-to-Market

| Canal | Métrica | Meta Mensal (M3) | Meta Mensal (M6) |
|---|---|---|---|
| LinkedIn | Alcance orgânico/post | 2.000 | 5.000 |
| LinkedIn | Novos seguidores/mês | 100 | 300 |
| LinkedIn | Leads (DMs recebidas) | 20 | 50 |
| Outbound | Mensagens enviadas/mês | 200 | 300 |
| Outbound | Taxa de resposta | 15% | 20% |
| Outbound | Trials gerados | 5 | 10 |
| Parcerias | Consultorias ativas | 1 | 3 |
| Parcerias | Clientes via parceria | 2 | 6 |
| Landing page | Visitantes/mês | 300 | 800 |
| Landing page | Conversão visitante→trial | 10% | 12% |

---

## 5. Métricas de Satisfação

| Métrica | Definição | Como medir | Meta |
|---|---|---|---|
| NPS | Net Promoter Score (0-10, promotores-detratores) | Typeform trimestral | > 50 |
| CSAT | Satisfação pós-simulação (1-5) | Pergunta in-app após resultado | > 4,2 |
| Review qualitativa | Depoimentos coletados | Solicitação ativa por e-mail | 10 ao M6 |

---

## 6. Dashboard Semanal de Carla (toda sexta-feira)

```
□ MRR esta semana: R$ _____ (vs. semana anterior: +/-___%)
□ Novos clientes pagantes: ___
□ Churn: ___ (valor e % da base)
□ Trials iniciados: ___
□ Simulações realizadas: ___
□ Taxa de PDF exportado: ___%
□ Mensagens outbound enviadas: ___
□ Respostas recebidas: ___
□ Demos agendadas: ___
□ Alertas: clientes sem simulação há 14+ dias: ___
```

---

## 7. Dashboard Mensal (primeiro dia útil do mês)

```
□ MRR: R$ _____ | Crescimento MoM: ___%
□ ARR projetado: R$ _____
□ Clientes ativos: ___
□ Churn do mês: ___ clientes | R$ _____ | ___%
□ Novos clientes: ___
□ NRR: ___%
□ Trial-to-paid: ___%
□ ARPU: R$ _____
□ North Star (simulações): _____
□ NPS (se trimestral): ___
□ Custo total do mês: R$ _____ (domínio + Stripe fees)
□ Margem bruta: ___%
□ Top 3 feedbacks de clientes este mês:
   1. _____
   2. _____
   3. _____
□ Decisão: o que muda no próximo mês?
```

---

## 8. Metas por Métrica — M1 ao M12

| Métrica | M1 | M2 | M3 | M4 | M5 | M6 | M7 | M8 | M9 | M10 | M11 | M12 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Clientes | 0 | 5 | 12 | 20 | 28 | 37 | 47 | 58 | 69 | 80 | 92 | 104 |
| MRR | R$0 | R$3,9k | R$9,3k | R$15,5k | R$21,7k | R$28,6k | R$36,4k | R$45,1k | R$53,7k | R$62,2k | R$71,4k | R$80,8k |
| Churn | 0% | 0% | 2% | 3% | 4% | 4% | 3% | 3% | 3% | 3% | 3% | 3% |
| Simul/mês | 0 | 25 | 80 | 150 | 210 | 300 | 380 | 470 | 550 | 640 | 740 | 840 |

---

## 9. Alertas de Saúde do Negócio

| Alerta | Sinal | Ação imediata |
|---|---|---|
| 🔴 Churn > 8% em 2 meses consecutivos | Clientes saindo rápido | Entrevistar 5 churned, parar aquisição, focar produto |
| 🔴 Trial-to-paid < 10% | Produto não convence no trial | Revisar onboarding, simplificar formulário, oferecer demo |
| 🔴 Simulações/cliente < 3/mês | Produto não vira hábito | Email de reengajamento, verificar se ICP está certo |
| 🟡 MRR crescimento < 5% MoM por 2 meses | Tração desacelerou | Dobrar outbound, ativar parcerias, revisar pricing |
| 🟡 Taxa de PDF < 30% | Resultado não sendo usado na prática | Melhorar qualidade da análise IA, simplificar PDF |
| 🟢 NRR > 105% | Expansão supera churn | Investir em growth, possível momento de captar capital |
