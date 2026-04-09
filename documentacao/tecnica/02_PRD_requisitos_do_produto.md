# PRD — Product Requirements Document — RemunaIA

**Versão:** 1.0  
**Atualizado em:** 04/04/2026  
**Responsável:** Carla  

---

## 1. Visão do Produto

**Missão:** Permitir que qualquer profissional de RH ou gestor tome decisões salariais com base em dados, análise de IA e benchmarks de mercado — em minutos, sem planilhas e sem consultoria externa cara.

**Visão de longo prazo:** Ser a plataforma de inteligência de remuneração mais acessível e utilizada por empresas brasileiras de médio porte.

**Proposta de valor:** "Tome decisões de remuneração com base em simulações inteligentes, antes de impactar o orçamento ou gerar inconsistência interna."

---

## 2. Personas

### Persona 1 — Ana, Analista Sênior de Remuneração

| Atributo | Detalhe |
|---|---|
| Idade | 28–35 anos |
| Empresa | Médias e grandes empresas (200–2.000 funcionários) |
| Cargo | Analista/Coordenadora de RH ou Remuneração |
| Ferramentas atuais | Excel, Google Sheets, Word |
| **Dor principal** | Passa 3–4h montando uma simulação no Excel; não tem benchmark confiável; tem medo de recomendar algo errado para o gestor |
| **Desejo** | Ferramenta que faça a simulação em minutos e já entregue benchmark atualizado para justificar a recomendação |
| **Gatilho de compra** | "Preciso justificar a decisão para o diretor amanhã de manhã" |
| Frequência de uso | 5–15 simulações/mês |

### Persona 2 — Carlos, HRBP / Gerente de RH

| Atributo | Detalhe |
|---|---|
| Idade | 32–42 anos |
| Empresa | Empresas com 200–2.000 funcionários |
| Cargo | HRBP, Gerente de RH, Head de People |
| **Dor principal** | Decisões salariais descentralizadas geram inconsistência. Descobre distorção depois que já criou problema. |
| **Desejo** | Visão consolidada de equidade interna + ferramenta de apoio a gestores na hora de pedir aprovação |
| **Gatilho de compra** | "Tivemos uma reclamação de colaborador sobre injustiça salarial" ou "Gestor pediu aprovação de aumento e não sei como avaliar" |
| Frequência de uso | 10–30 simulações/mês |

### Persona 3 — Fernanda, Diretora de RH

| Atributo | Detalhe |
|---|---|
| Idade | 40–52 anos |
| Empresa | Grandes empresas (1.000+ funcionários) |
| Cargo | Diretora de RH / VP People |
| **Dor principal** | Não tem visibilidade estratégica de remuneração. Precisa apresentar dados ao CFO/board mas não tem relatório pronto. |
| **Desejo** | Dashboard executivo + relatório profissional para apresentar em comitê |
| **Gatilho de compra** | "O CFO pediu previsão de impacto salarial para o próximo ciclo de méritos" |
| Frequência de uso | Uso mensal para revisões; equipe usa semanalmente |

---

## 3. Jornada do Usuário

```
1. PROBLEMA
   Gestor solicita aprovação de promoção / aumento
   RH não tem dados para avaliar com segurança
        ↓
2. DESCOBERTA
   Post no LinkedIn da Carla sobre decisão salarial com dados
   Google: "como calcular impacto de promoção salarial"
        ↓
3. AVALIAÇÃO
   Acessa landing page → vê demo → entende a proposta de valor
   Cadastra-se para trial gratuito (sem cartão)
        ↓
4. ATIVAÇÃO
   Preenche formulário com o caso real que tem em mãos
   Recebe resultado em 15-30 segundos
   Exporta PDF e apresenta para o gestor
        ↓
5. CONVERSÃO
   Gosta do resultado → assina plano Starter ou Professional
        ↓
6. RETENÇÃO
   Usa para todo novo caso de remuneração
   Vira referência de ferramenta na empresa
        ↓
7. EXPANSÃO
   Indica para outros HRBPs da empresa → upgrade para Professional/Enterprise
```

---

## 4. Funcionalidades por Módulo

### Módulo 1: Autenticação e Cadastro

**US-001 — Cadastro por email**
> Como visitante, quero criar uma conta com email e senha para acessar o produto.

Critérios de aceitação:
- Formulário: nome, email, senha (mínimo 8 caracteres), nome da empresa
- Email de confirmação enviado em < 2 minutos (Resend)
- Após confirmação, redireciona para dashboard com plano trial ativo
- Trial: 3 simulações gratuitas, válido por 14 dias

**US-002 — Cadastro via Google**
> Como visitante, quero criar conta com minha conta Google para não precisar criar nova senha.

Critérios de aceitação:
- Botão "Entrar com Google" visível na tela de login e cadastro
- Fluxo OAuth completo sem erros
- Perfil criado com nome e email vindos do Google
- Solicitar nome da empresa em modal após primeiro login Google

**US-003 — Login**
> Como usuário cadastrado, quero fazer login para acessar minhas simulações.

Critérios de aceitação:
- Login por email/senha e Google
- "Esqueci minha senha" funcional
- Sessão persiste por 7 dias (lembrar de mim)
- Redireciona para dashboard após login

---

### Módulo 2: Simulação de Remuneração

**US-010 — Selecionar tipo de movimento**
> Como usuário, quero escolher o tipo de decisão salarial para o sistema personalizar o formulário.

Critérios de aceitação:
- 4 opções visíveis como cards com ícone e descrição breve:
  - Promoção (mudança de cargo + salário)
  - Aumento Salarial (mesmo cargo, salário maior)
  - Nova Contratação (definir salário de entrada)
  - Ajuste de Faixa (realinhar à estrutura)
- Seleção visual clara (card selecionado tem borda e cor de destaque)
- Não avança sem seleção

**US-011 — Preencher dados do caso (Passo 2)**
> Como usuário, quero informar os dados do cargo e salário para a IA analisar.

Critérios de aceitação:
- Campos obrigatórios: cargo atual, salário atual, salário proposto, regime (CLT/PJ), setor, estado
- Cargo proposto obrigatório apenas para Promoção
- Salários: formato numérico, sem R$, validação > 0
- Regime: radio CLT / PJ
- Setor: select com opções (Educação, Tecnologia, Saúde, Varejo, Serviços, Indústria, Financeiro, Outro)
- Estado: select com 27 estados + DF
- Erro inline em campos inválidos ao tentar avançar

**US-012 — Adicionar contexto (Passo 3)**
> Como usuário, quero descrever o contexto do caso para a IA ter informações completas.

Critérios de aceitação:
- Textarea para contexto livre (histórico de avaliação, política da empresa, motivo)
- Placeholder com exemplo: "Ex: Colaboradora tem 2 anos na empresa, última avaliação 'Supera Muito', política exige..."
- Checkbox "Há outros colaboradores no mesmo cargo?" + campo de salário médio se marcado
- Campo budget disponível (opcional)
- Todos os campos opcionais — formulário avança mesmo sem preenchimento

**US-013 — Visualizar loading durante processamento**
> Como usuário, quero ver feedback visual enquanto a IA processa o caso.

Critérios de aceitação:
- Spinner ou animação visível ao clicar em "Simular"
- Texto animado: "Analisando benchmarks de mercado...", "Calculando impacto financeiro...", "Gerando recomendação..."
- Tempo máximo de espera: 30 segundos (timeout com mensagem de erro)
- Botão "Simular" desabilitado durante processamento (evitar duplo envio)

**US-014 — Visualizar resultado completo**
> Como usuário, quero ver a análise completa do caso em uma tela organizada.

Critérios de aceitação:
- Header: badge tipo de movimento + cargos + data
- Seção 1: Resumo do Cenário (texto gerado pela IA)
- Seção 2: Simulação Financeira (tabela com cenários, valores, variação %, custo anual)
- Seção 3: Benchmark de Mercado (barra visual P25/P50/P75 com marcador do salário proposto)
- Seção 4: Equidade Interna (análise e nível de risco)
- Seção 5: Riscos (tabela com nível, descrição, mitigação — badges coloridos)
- Seção 6: Recomendação da IA (card em destaque, decisão em negrito)
- Seção 7: Conclusão Estratégica
- Botões: [Exportar PDF] [Salvar e Voltar ao Dashboard]

---

### Módulo 3: Exportação de PDF

**US-020 — Exportar relatório em PDF**
> Como usuário, quero baixar um PDF profissional do resultado para apresentar à liderança.

Critérios de aceitação:
- PDF gerado em < 5 segundos após clique
- Nome do arquivo: `RemunaIA_[cargo]_[data].pdf`
- Conteúdo: todas as seções do resultado
- Layout: logo RemunaIA + cabeçalho com empresa e data + todas as seções + footer
- Formatação profissional: tabelas, badges de risco em cores, recomendação destacada
- PDF renderiza corretamente em Adobe Reader, Chrome PDF viewer, Preview (Mac)

---

### Módulo 4: Histórico de Casos

**US-030 — Listar histórico de simulações**
> Como usuário, quero ver todas as minhas simulações anteriores em uma lista.

Critérios de aceitação:
- Lista em ordem decrescente por data
- Cada item: tipo de movimento, cargos, data, decisão recomendada (resumida)
- Paginação ou scroll infinito para listas longas
- Busca por cargo ou data

**US-031 — Acessar detalhe de simulação salva**
> Como usuário, quero abrir uma simulação anterior para revisar ou re-exportar o PDF.

Critérios de aceitação:
- Todas as seções do resultado exibidas corretamente
- Botão "Exportar PDF" disponível
- Botão "Nova simulação com base nesta" (pré-preenche o formulário com os dados anteriores)

---

### Módulo 5: Planos e Pagamento

**US-040 — Visualizar planos**
> Como usuário em trial, quero ver os planos disponíveis para escolher o mais adequado.

Critérios de aceitação:
- Página `/planos` com 3 cards (Starter, Professional, Enterprise)
- Cada card: preço, lista de features, botão "Assinar"
- Plano atual destacado
- Comparativo de features em tabela

**US-041 — Assinar plano**
> Como usuário, quero assinar um plano para continuar usando o produto.

Critérios de aceitação:
- Clique em "Assinar" abre Stripe Checkout
- Checkout com opção de cartão de crédito/débito
- Após pagamento: retorna ao produto com plano atualizado
- Email de confirmação de assinatura enviado

**US-042 — Visualizar conta e uso**
> Como assinante, quero ver meu plano atual e quantas simulações já usei no mês.

Critérios de aceitação:
- Plano atual, data de renovação
- Simulações usadas no mês / limite do plano (barra de progresso para Starter)
- Botão para fazer upgrade
- Botão para cancelar (com confirmação)

---

## 5. Funcionalidades Fora do Escopo do MVP

Os itens abaixo NÃO serão implementados na versão 1.0:

- Upload de estrutura salarial (CSV com todos os colaboradores)
- Dashboard de saúde salarial (visão de toda a empresa)
- Análise em lote (múltiplos colaboradores de uma vez)
- Integração com sistemas de RH (ADP, Totvs, Senior, Gupy)
- Análise de gap por gênero/raça
- Módulo de política salarial (configurar faixas da empresa)
- App mobile
- API para integração (acesso programático)
- Relatório personalizado com branding da empresa

---

## 6. Funcionalidades por Plano

| Feature | Trial | Starter | Professional | Enterprise |
|---|---|---|---|---|
| Simulações/mês | 3 (total) | 20 | Ilimitadas | Ilimitadas |
| Usuários | 1 | 3 | 10 | Ilimitados |
| Exportação PDF | ✓ | ✓ | ✓ | ✓ |
| Histórico | 7 dias | 6 meses | Completo | Completo |
| Benchmark básico (geral) | ✓ | ✓ | ✓ | ✓ |
| Benchmark avançado (setor + estado) | ✗ | ✗ | ✓ | ✓ |
| Análise de equidade interna | ✗ | ✗ | ✓ | ✓ |
| Suporte | Email | Email | Chat | Gerente de conta |
| Duração | 14 dias | Mensal | Mensal | Mensal ou anual |

---

## 7. Requisitos Não-Funcionais

### Performance
- Tempo de resposta da IA: < 30 segundos (timeout)
- Carregamento das páginas: < 2 segundos (Vercel Edge Network)
- Geração de PDF: < 5 segundos

### Segurança
- HTTPS obrigatório em todas as páginas
- API key do Gemini nunca exposta no frontend (chamada server-side via Supabase Edge Function)
- Stripe keys apenas no backend
- RLS ativo: usuário só acessa seus próprios dados
- Senhas: bcrypt via Supabase Auth (mínimo 8 caracteres)

### LGPD
- Dados salariais tratados como dados sensíveis
- Consentimento explícito no cadastro
- Opção de exclusão de conta e dados a qualquer momento
- Dados de pagamento nunca armazenados localmente (Stripe gerencia)
- Política de privacidade e termos de uso linkados no cadastro

### Disponibilidade
- SLA alvo: 99,5% (Vercel free tier garante ~99,9%)
- Supabase free tier: 99,9% disponibilidade
- Gemini API: fallback com mensagem amigável se indisponível

### Acessibilidade
- Contraste mínimo WCAG AA
- Labels em todos os campos do formulário
- Navegação por teclado nos formulários
- Mensagens de erro descritivas (não apenas "campo inválido")

---

## 8. Regras de Negócio Críticas

| # | Regra | Detalhe |
|---|---|---|
| RN-001 | Trial: 3 simulações | Contabilizadas globalmente (não por mês). Ao atingir, bloqueia com modal de upgrade. |
| RN-002 | Trial: 14 dias | Após 14 dias sem assinatura, bloqueia acesso a novas simulações. Histórico permanece visível. |
| RN-003 | Starter: 20 simulações/mês | Contador reseta no início de cada mês. |
| RN-004 | Dados salariais | Usados apenas para gerar a simulação. Nunca vendidos ou compartilhados com terceiros. |
| RN-005 | Recomendação da IA | É uma sugestão de apoio à decisão. A decisão final é sempre do profissional de RH. Disclamer obrigatório. |
| RN-006 | Benchmark | Baseado em fontes públicas e estimativas. Não substitui pesquisa salarial formal (Mercer, Hay Group). |
| RN-007 | Cancelamento | Ao cancelar, o acesso continua até o fim do período pago. Dados ficam disponíveis por 90 dias. |
| RN-008 | PDF | Inclui footer "Gerado por RemunaIA — remunaIA.com.br" (efeito viral no plano Starter) |
