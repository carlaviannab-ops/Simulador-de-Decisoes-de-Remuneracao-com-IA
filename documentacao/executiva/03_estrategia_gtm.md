# Estratégia Go-to-Market — RemunaIA

**Versão:** 1.0 | **Atualizado em:** 04/04/2026

---

## 1. ICP — Ideal Customer Profile

### ICP 1 — Empresa de Educação, RJ/SP, 100-500 funcionários
- **Quem compra:** Gerente ou Coordenador de RH
- **Dor imediata:** Decisões de promoção sem benchmark, distorções salariais por crescimento rápido
- **Orçamento:** Até R$2.000/mês para ferramentas de RH
- **Gatilho:** Ciclo de méritos chegando, novo colaborador reclamou de salário

### ICP 2 — Empresa de Tecnologia, SP, 50-200 funcionários
- **Quem compra:** HRBP ou Head of People
- **Dor imediata:** Competitividade salarial com mercado (tech paga mais), perda de talentos
- **Orçamento:** Até R$3.000/mês
- **Gatilho:** Dev sênior pediu aumento ou recebeu oferta do mercado

### ICP 3 — Consultoria de RH independente
- **Quem compra:** Sócia ou consultora sênior
- **Dor imediata:** Clientes pedem análise salarial, ela não tem ferramenta rápida
- **Orçamento:** Até R$1.500/mês (replica para vários clientes)
- **Gatilho:** Perdeu projeto para consultoria maior por falta de ferramenta

---

## 2. Funil de Vendas

```
TOPO: Conscientização
  Posts LinkedIn + SEO + Indicações
  Meta: 200 visitantes/mês na landing page
       ↓
MEIO: Consideração
  Trial gratuito (sem cartão)
  Meta: 16% de conversão visitante → trial (32 trials/mês)
       ↓
FUNDO: Decisão
  Primeira simulação com caso real → percebe valor
  Meta: 20% trial → pago (6-7 clientes/mês)
       ↓
EXPANSÃO
  Upgrade Starter → Professional
  Meta: 10% dos Starters fazem upgrade no M3
```

---

## 3. Calendário Editorial — Mês 1 (20 Posts LinkedIn)

| Semana | Dia | Tipo | Tema |
|---|---|---|---|
| S1 | Seg | Texto | "Por que RH ainda decide salário no achismo em 2026?" |
| S1 | Qua | Texto | "3 distorções salariais que vi esta semana (casos reais)" |
| S1 | Sex | Carrossel | "Promoção vs. Aumento: qual a diferença e como calcular?" |
| S2 | Seg | Texto | "Quanto custa não promover alguém que merece?" |
| S2 | Qua | Infográfico | "Benchmark salarial: Gerente de RH nas 5 maiores cidades do Brasil" |
| S2 | Sex | Texto | "Eu passo 4h montando uma simulação no Excel. Existe saída?" |
| S3 | Seg | Texto | "Caso real: a decisão que salvou um talento (e economizou R$50k)" |
| S3 | Qua | Carrossel | "5 erros que RH comete em decisões de remuneração" |
| S3 | Sex | Vídeo | Demo: simulação completa em 2 minutos |
| S3 | Dom | Texto | "Construí uma ferramenta para resolver isso. Quer testar?" |
| S4 | Seg | Texto | "Lançamos o RemunaIA — história de por que criamos" |
| S4 | Ter | Prova social | Depoimento beta tester #1 |
| S4 | Qua | Vídeo | Demo ao vivo — caso de promoção do início ao PDF |
| S4 | Qui | Infográfico | "3 distorções que encontramos nos primeiros 10 casos reais" |
| S4 | Sex | CTA | "14 dias grátis, sem cartão. Comece hoje." |

---

## 4. Scripts de Outbound LinkedIn (por Persona)

### Para Analista/Coordenador de RH
```
Oi [Nome]! Vi que você trabalha com RH na [Empresa].

Tenho uma pergunta direta: quanto tempo você gasta para montar uma 
simulação de aumento ou promoção antes de apresentar para o gestor?

Criamos uma ferramenta que faz isso em menos de 2 minutos — com 
benchmark de mercado e recomendação da IA incluídos.

Se quiser testar com um caso real que você tem em mãos agora, 
posso liberar 14 dias grátis. Topa?
```

### Para Gerente/HRBP
```
Oi [Nome]! Acompanho seu trabalho com RH na [Empresa].

Decisão salarial sem dados é um risco que você provavelmente já sentiu — 
seja uma distorção interna que descobriu tarde, ou um colaborador que saiu 
por R$ 1k de diferença.

Criamos o RemunaIA para resolver exatamente isso: simulação de promoção, 
aumento e contratação com análise de impacto financeiro e benchmark em segundos.

Posso mostrar um caso em 15 minutos? Ou libero acesso para você testar sozinho.
```

### Para Consultoria de RH
```
Oi [Nome]! Vi que você faz consultoria de RH — área que respeito muito.

Tenho uma proposta: consultoras que usam o RemunaIA como ferramenta de suporte 
entregam análises salariais mais rápidas e embasadas para os clientes.

Além do uso próprio, temos um modelo de parceria onde você pode indicar clientes 
e receber comissão, ou usar como white-label na sua marca.

Faz sentido conversar 20 minutos sobre isso?
```

---

## 5. Estratégia de Parceria com Consultorias

### Como identificar parceiros ideais
- Consultoria independente de RH (não uma big four)
- 5-50 clientes ativos
- Sem produto digital próprio de remuneração
- Ativa no LinkedIn com conteúdo de RH

### Proposta de parceria
- Acesso gratuito ao Professional por 60 dias (para testar)
- Modelo 1 (Indicação): 20% da primeira mensalidade de cada cliente indicado
- Modelo 2 (Reseller): 15% recorrente do MRR dos clientes gerenciados
- Modelo 3 (White-label): produto com a marca da consultoria (R$3.500/mês)

### Processo de abordagem
1. Mensagem personalizada no LinkedIn (template acima)
2. Demo de 20 minutos mostrando 1 caso real
3. Proposta formal em PDF (gerado no Canva Pro)
4. Assinatura do acordo de parceria (Word + Copilot)
5. Onboarding: 1 sessão de 1h + material de apoio

---

## 6. Estratégia de Retenção e Anti-Churn

### Indicadores de risco de churn (via Posthog)
- Usuário não simulou em 14+ dias → risco médio
- Usuário não simulou em 30+ dias → risco alto
- Taxa de PDF exportado < 30% → produto não está sendo usado na prática

### Ações por nível de risco

**Risco médio (14 dias sem simulação):**
Email automático: "Oi [Nome], tudo bem? Vimos que faz 2 semanas que você não usa o RemunaIA. Precisa de ajuda para começar?"

**Risco alto (30 dias sem simulação):**
Mensagem pessoal de Carla no LinkedIn: "Oi [Nome], sou a Carla, fundadora do RemunaIA. Quero entender se o produto está te ajudando. Pode me contar o que está faltando?"

**Pré-churn (usuário clicou em cancelar mas não finalizou):**
Modal: "Antes de sair, posso te mostrar algo em 15 minutos? Quero entender o que está faltando." → Calendly para call rápida

---

## 7. Métricas do Funil por Canal

| Canal | Leads/mês | Trial/mês | Pagantes/mês | CAC |
|---|---|---|---|---|
| LinkedIn orgânico | 30 | 10 | 2 | R$ 0 |
| Outbound (10/dia) | 50 | 8 | 2 | R$ 0 |
| Parcerias consultorias | 10 | 4 | 1 | R$ 130 |
| SEO/blog | 20 | 3 | 1 | R$ 0 |
| **Total** | **110** | **25** | **6** | **~R$ 22** |
