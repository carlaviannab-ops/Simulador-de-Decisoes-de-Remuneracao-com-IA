# Playbook Operacional — RemunaIA

**Versão:** 1.0 | **Atualizado em:** 04/04/2026

---

## 1. Rotina Semanal de Carla

| Dia | Horário | Atividade | Ferramenta | Tempo |
|---|---|---|---|---|
| **Segunda** | 9h–11h | Melhorias no produto (bugs, novas features) | VS Code + GitHub Copilot | 2h |
| **Terça** | 9h–10h30 | Criar e agendar conteúdo da semana (3 posts LinkedIn) | Canva Pro + Microsoft Copilot | 1,5h |
| **Quarta** | 9h–10h | Atendimento clientes + análise de uso | Crisp + Posthog | 1h |
| **Quinta** | 9h–10h30 | Vendas: outbound (10 mensagens) + demos | LinkedIn + Calendly | 1,5h |
| **Sexta** | 9h–10h | Análise semanal + planejamento | Excel + Copilot | 1h |
| **Total** | | | | **7h/semana** |

---

## 2. Rotina Mensal

**Primeiro dia útil do mês:**
- Preencher dashboard mensal (ver `05_kpis_e_metricas.md`)
- Identificar os 3 maiores problemas e as 3 maiores oportunidades
- Planejar sprints de produto para o mês
- Revisar budget (domínio + Stripe fees)

**Metade do mês:**
- Review de progresso: estamos no caminho das metas?
- Ajustar estratégia de aquisição se necessário

**Último dia útil do mês:**
- Atualizar HISTORICO.md do projeto
- Arquivar capturas de tela das métricas
- Escrever post de retrospectiva (interno — não publica)

---

## 3. Playbook de Vendas

### Etapa 1: Prospecção (Outbound LinkedIn)
```
1. Identificar 10 perfis/dia usando filtros LinkedIn:
   - Cargo: Gerente de RH / HRBP / Analista de RH
   - Empresa: 50-2.000 funcionários
   - Localização: SP, RJ, MG (prioridade)
   - Setor: Educação, Tecnologia, Serviços

2. Enviar mensagem personalizada (template do GTM)
   - Personalizar com nome, empresa, setor
   - Não pitch imediato — criar conexão primeiro

3. Follow-up (se não respondeu em 5 dias):
   "Oi [Nome], só queria saber se minha mensagem chegou.
   Tenho um demo de 15 min que pode ser útil para você. Topo?"

4. Segunda mensagem (7 dias depois, se silêncio):
   Compartilhar um case relevante ao setor da pessoa.
   Não insistir além disso — seguir para próximo lead.
```

### Etapa 2: Qualificação (Demo)
```
Duração: 15-20 minutos
Formato: Google Meet (câmera ligada)

Roteiro:
- 2 min: "Me conta um desafio de remuneração que você teve recentemente?"
- 1 min: Contexto breve do produto ("criamos para resolver exatamente isso")
- 10 min: Demo ao vivo com caso real (ou o caso que o lead compartilhou)
- 3 min: "O que faria mais sentido para você: começar o trial agora ou 
          assinar direto com a oferta de fundador?"
- 2 min: Responder dúvidas + enviar link

Pergunta chave: "Se essa ferramenta funcionar no seu próximo caso, 
faz sentido assinar o plano X?"
```

### Etapa 3: Conversão (Trial → Pago)
```
Dia 1: Email de boas-vindas automático (Resend)
Dia 3: Se não simulou ainda → email: "Quer ajuda para começar?"
Dia 7: Email: "Como está indo? Alguma simulação já feita?"
Dia 12: Email: "Sua avaliação expira em 2 dias. Veja os planos."
Dia 14: Trial expira → modal de upgrade ao próximo login
```

---

## 4. Playbook de Onboarding de Novos Clientes

### Imediatamente após pagamento
1. Email automático: confirmação + próximos passos (Resend)
2. Se Professional ou Enterprise: Carla envia mensagem no LinkedIn/email:
   *"Oi [Nome]! Obrigada pela confiança no RemunaIA. Tem algum caso em mãos agora que posso ajudar a configurar?"*

### Semana 1
- Verificar no Posthog se o cliente fez pelo menos 1 simulação
- Se não: email de engajamento com exemplo de caso real

### Semana 2
- Para Enterprise: agendar call de sucesso (30 min) para garantir que estão extraindo valor

### Mês 1
- Solicitar feedback por email (Microsoft Forms)
- Se NPS ≥ 9: solicitar depoimento escrito ou em vídeo

---

## 5. Playbook de Atendimento ao Cliente

### Triagem de atendimento (Crisp)

| Tipo de solicitação | Prioridade | SLA | Como resolver |
|---|---|---|---|
| Bug crítico (produto não funciona) | P1 | 2h úteis | Verificar logs Supabase → corrigir → comunicar |
| Dúvida sobre resultado da IA | P2 | 1 dia útil | Explicar a metodologia, oferecer re-simulação |
| Dúvida de uso (como funciona) | P3 | 1 dia útil | Enviar link da doc ou gravar Loom rápido |
| Fatura e cobrança | P2 | 1 dia útil | Verificar no Stripe → resolver |
| Solicitação de nova feature | P4 | 3 dias úteis | Agradecer, registrar, retornar se será implementado |

### Modelo de resposta para dúvida sobre IA
```
Oi [Nome]!

Boa pergunta. A análise do RemunaIA é baseada em [explica a fonte].

No seu caso específico, o que aconteceu foi: [explica o raciocínio da IA].

Para refinar o resultado, você pode tentar nova simulação adicionando 
mais contexto no campo de observações, especialmente [sugestão específica].

Qualquer coisa, estou aqui!

Carla
```

---

## 6. Playbook de Anti-Churn

### Identificar risco (via Posthog)
- Todo cliente sem simulação há 14 dias entra em lista de "risco médio"
- Todo cliente sem simulação há 30 dias entra em "risco alto"

### Ação por nível de risco

**Risco médio:**
Email automático no Dia 14:
```
"Oi [Nome], tudo bem? Vimos que faz um tempo que você não usa o RemunaIA.

Se tiver alguma dúvida, dificuldade técnica, ou simplesmente não teve um 
caso para simular, me conta! Quero garantir que o produto está te ajudando.

Carla"
```

**Risco alto:**
Mensagem pessoal de Carla (LinkedIn ou email) no Dia 30:
```
"Oi [Nome], sou a Carla, fundadora do RemunaIA. Notei que você não 
usou o produto nos últimos 30 dias e quero entender por quê.

Você tem 15 minutos esta semana para me dar um feedback honesto?
Pode ser brutal — vai me ajudar a melhorar o produto."
```

**Pré-churn (clicou em cancelar):**
Modal no produto:
*"Antes de cancelar, posso te mostrar algo novo em 10 minutos que pode mudar sua opinião?"*
→ Botão: "Falar com a Carla" (abre Calendly)

---

## 7. Playbook de Criação de Conteúdo LinkedIn

### Semana de conteúdo (processo)

**Segunda-feira (30 min):**
1. Abrir Canva Pro → Template de post LinkedIn
2. Prompt para Magic Write: "Escreva um post sobre [tema da semana] para profissionais de RH, tom direto e provocativo, 150 palavras, com pergunta final para engajamento"
3. Revisar e adicionar voz pessoal (5-10 min)
4. Agendar para Terça e Quinta no Canva scheduler

**Para carrosséis (45 min):**
1. Canva → Template de carrossel LinkedIn (8-10 slides)
2. Microsoft Copilot: escreve o conteúdo de cada slide
3. Canva: aplicar brand kit automaticamente
4. Exportar e publicar

### Tipos de post que mais engajam (no RH)
- Caso real anonimizado + decisão tomada
- Pergunta provocativa sobre prática de RH
- Dado de mercado surpreendente
- "Erro que cometi como RH e o que aprendi"
- Demo/screenshot do produto em uso

---

## 8. Quando e Como Contratar a Primeira Pessoa

### Gatilho para contratar
- MRR > R$ 80.000/mês E
- Carla gastando > 15h/semana no negócio E
- Churn subindo por falta de atendimento

### Primeiro perfil a contratar
**Customer Success / Suporte (remoto)**
- Perfil: Profissional de RH com 2-3 anos, curioso sobre tecnologia
- Salário: R$ 4.000-6.000/mês CLT ou PJ
- Responsabilidades: onboarding, atendimento, coleta de feedback, NPS

### Como contratar com IA
- Divulgar vaga no LinkedIn (post orgânico de Carla)
- Triagem de currículos: Microsoft Copilot analisa e pontua
- Entrevistas: roteiro gerado por Copilot, notas salvas no Word
- Contrato: Word + Copilot + revisão jurídica básica

---

## 9. Processos Automatizados (Hoje e Futuro)

| Processo | Status | Ferramenta |
|---|---|---|
| Email de boas-vindas | ✅ Automatizado | Resend |
| Email trial expirando (Dia 12) | ✅ Automatizado | Resend |
| Reset mensal do contador de simulações | ✅ Automatizado | Supabase trigger |
| Atualização de plano após pagamento | ✅ Automatizado | Stripe webhook + Supabase |
| Alerta de cliente inativo 14 dias | 🔜 Planejar | Supabase cron + Resend |
| Relatório mensal de uso por cliente | 🔜 Planejar | Supabase + Resend |
| NPS automático após 30 dias de uso | 🔜 Planejar | Typeform + Resend |
