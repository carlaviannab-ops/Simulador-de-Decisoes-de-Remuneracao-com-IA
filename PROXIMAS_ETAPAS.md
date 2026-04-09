# Próximas Etapas — RemunaIA

**Criado em:** 04/04/2026  
**Status:** Planejamento concluído — pronto para execução  
**Referência:** Documentação completa em `/documentacao/`

---

## Onde estamos agora

✅ Planejamento estratégico completo  
✅ 23 documentos técnicos, financeiros, legais e executivos criados  
✅ Prompt master da IA estruturado e validado com casos reais  
✅ Stack tecnológica definida (custo adicional: ~R$4/mês)  
⏳ **Próximo passo: executar a Etapa 1**

---

## Visão geral das etapas

```
ETAPA 1 → Identidade e fundação (Semana 1)
ETAPA 2 → Banco de dados e autenticação (Semana 2)
ETAPA 3 → Código base do produto (Semana 2–3)
ETAPA 4 → Integração da IA (Semana 3)
ETAPA 5 → Resultado, PDF e pagamento (Semana 4)
ETAPA 6 → Landing page e testes (Semana 5)
ETAPA 7 → Beta fechado (Semana 6–7)
ETAPA 8 → Lançamento público (Semana 8)
```

---

## ETAPA 1 — Identidade Visual e Fundação
**Duração:** 5 dias | **Ferramentas:** Canva Pro, Registro.br + contas gratuitas

### 1.1 Identidade visual (Canva Pro)
- [ ] Criar Brand Kit no Canva Pro: definir nome final, paleta de cores, tipografia
- [ ] Gerar logo com Magic Design (mínimo 3 variações: fundo claro, escuro e ícone solo)
- [ ] Escolher e salvar o logo final em PNG e SVG
- [ ] Criar template fixo de post LinkedIn no Canva (para uso recorrente)
- [ ] Criar template fixo de carrossel LinkedIn no Canva (3 layouts)

### 1.2 Registrar o domínio
- [ ] Acessar Registro.br
- [ ] Registrar domínio escolhido (ex: remunaIA.com.br)
- [ ] Anotar dados de acesso ao painel DNS

### 1.3 Criar contas em todos os serviços (na sequência)
- [ ] **GitHub** → criar repositório privado `remunaIA`
- [ ] **Supabase** → criar novo projeto, região São Paulo, anotar URL e chaves
- [ ] **Vercel** → criar conta, conectar ao GitHub
- [ ] **Google AI Studio** → criar API key do Gemini 1.5 Flash
- [ ] **Stripe** → criar conta, ativar modo teste
- [ ] **Resend** → criar conta, verificar domínio de envio
- [ ] **Posthog** → criar projeto, obter API key
- [ ] **Crisp** → criar conta, instalar widget (obter script de embed)

### 1.4 Arquivo de credenciais
- [ ] Criar arquivo `.env.local` (modelo em `documentacao/tecnica/07_guia_deploy_infraestrutura.md`)
- [ ] Salvar todas as chaves com segurança no OneDrive (nunca no GitHub)

### 1.5 Validar o Prompt Master
- [ ] Abrir Google AI Studio (playground gratuito do Gemini)
- [ ] Testar o prompt de **promoção** com o Caso #001 real — validar qualidade do JSON
- [ ] Testar o prompt de **aumento salarial** com caso fictício
- [ ] Testar o prompt de **nova contratação** com caso fictício
- [ ] Testar o prompt de **ajuste de faixa** com caso fictício
- [ ] Ajustar o prompt se o output não estiver satisfatório
- [ ] Registrar a versão final validada em `documentacao/tecnica/05_prompt_master_ia.md`

**Entregável da Etapa 1:** Logo aprovado + todas as contas ativas + prompt validado com 4 casos

---

## ETAPA 2 — Banco de Dados e Autenticação
**Duração:** 2 dias | **Ferramentas:** Supabase (interface web)

### 2.1 Criar o banco de dados no Supabase
- [ ] Acessar Supabase → SQL Editor
- [ ] Executar o SQL de criação das tabelas (arquivo: `documentacao/tecnica/04_schema_banco_de_dados.md`, seção 2)
- [ ] Verificar se as tabelas `profiles` e `simulacoes` foram criadas corretamente
- [ ] Executar os índices (seção 3 do mesmo arquivo)
- [ ] Ativar RLS nas tabelas (seção 4)
- [ ] Criar as políticas de segurança (seção 4.2 e 4.3)
- [ ] Criar o trigger de criação automática de perfil (seção 4.4)
- [ ] Testar: criar usuário de teste e verificar se perfil é criado automaticamente

### 2.2 Configurar autenticação
- [ ] Supabase → Authentication → Providers → habilitar Email e Google OAuth
- [ ] Criar credenciais OAuth no Google Cloud Console
- [ ] Adicionar Client ID e Secret no Supabase
- [ ] Configurar URLs de redirecionamento: `http://localhost:5173/**` e `https://remunaIA.com.br/**`
- [ ] Testar login por email localmente
- [ ] Testar login por Google localmente

**Entregável da Etapa 2:** Banco configurado + autenticação funcionando localmente

---

## ETAPA 3 — Código Base do Produto
**Duração:** 3 dias | **Ferramentas:** Bolt.new + VS Code + GitHub Copilot

### 3.1 Gerar o projeto com Bolt.new
- [ ] Acessar bolt.new
- [ ] Descrever o produto em português (baseado no PRD: `documentacao/tecnica/02_PRD_requisitos_do_produto.md`)
- [ ] Pedir geração de: estrutura de páginas, componentes de layout, roteamento básico
- [ ] Baixar ou copiar o código gerado para o repositório local

### 3.2 Ajustar estrutura no VS Code com GitHub Copilot
- [ ] Abrir projeto no VS Code (GitHub Copilot ativo)
- [ ] Ajustar estrutura de pastas conforme `documentacao/tecnica/03_especificacoes_tecnicas.md` (seção 7)
- [ ] Configurar Tailwind CSS com as cores do Brand Kit
- [ ] Criar arquivo `src/lib/supabase.ts` (cliente configurado com variáveis de ambiente)
- [ ] Criar arquivo `src/types/index.ts` com todas as interfaces TypeScript (seção 6 do doc de specs)
- [ ] Verificar que o projeto roda localmente sem erros (`npm run dev`)

### 3.3 Criar as telas principais
- [ ] `pages/Landing.tsx` — página pública (pode ser placeholder por ora)
- [ ] `pages/Login.tsx` — login e cadastro integrado ao Supabase Auth
- [ ] `pages/Dashboard.tsx` — lista de simulações (pode estar vazia)
- [ ] `components/layout/Layout.tsx` — wrapper com Header e Sidebar
- [ ] `components/ProtectedRoute.tsx` — proteção de rotas autenticadas
- [ ] Testar fluxo: cadastro → login → dashboard → logout

### 3.4 Criar o formulário de simulação (wizard 3 passos)
- [ ] `pages/NovaSimulacao.tsx` — controla o estado do wizard
- [ ] `components/simulacao/Passo1Tipo.tsx` — 4 cards de seleção
- [ ] `components/simulacao/Passo2Dados.tsx` — campos de cargo, salário, regime, setor, estado
- [ ] `components/simulacao/Passo3Contexto.tsx` — textarea + campos opcionais
- [ ] `components/simulacao/WizardProgress.tsx` — barra de progresso
- [ ] Validar que formulário avança apenas com campos obrigatórios preenchidos

**Entregável da Etapa 3:** App rodando localmente com autenticação e formulário funcionando

---

## ETAPA 4 — Integração da IA (Gemini)
**Duração:** 2 dias | **Ferramentas:** Supabase Edge Functions + GitHub Copilot

### 4.1 Criar a Edge Function `simulate`
- [ ] Instalar Supabase CLI: `npm install -g supabase`
- [ ] Fazer login e vincular ao projeto: `supabase link --project-ref [id]`
- [ ] Criar a function: `supabase functions new simulate`
- [ ] Implementar a lógica completa (baseada em `documentacao/tecnica/03_especificacoes_tecnicas.md`, seção 5.1):
  - Autenticar o JWT do usuário
  - Verificar limite de simulações do plano
  - Criar registro no banco com status `processando`
  - Montar o prompt com os dados do formulário
  - Chamar a Gemini API
  - Validar o JSON retornado
  - Atualizar o registro com o resultado
  - Incrementar contador de simulações

### 4.2 Configurar secrets da Edge Function
- [ ] `supabase secrets set GEMINI_API_KEY=sua_chave`
- [ ] `supabase secrets set SUPABASE_SERVICE_ROLE_KEY=sua_chave`

### 4.3 Conectar o frontend à Edge Function
- [ ] Criar `src/hooks/useSimulacao.ts` — hook que chama a Edge Function
- [ ] Implementar loading state (spinner + textos animados durante processamento)
- [ ] Implementar tratamento de erros (timeout, limite atingido, JSON inválido)

### 4.4 Testar end-to-end
- [ ] Preencher formulário → clicar Simular → verificar se resultado aparece no banco
- [ ] Testar os 4 tipos de simulação
- [ ] Verificar se JSON retornado é válido em todos os casos

**Entregável da Etapa 4:** Simulação funcionando do formulário ao banco de dados

---

## ETAPA 5 — Tela de Resultado, PDF e Pagamento
**Duração:** 3 dias | **Ferramentas:** jsPDF + Stripe

### 5.1 Tela de resultado
- [ ] Criar `pages/Resultado.tsx` — busca simulação pelo ID da rota
- [ ] Implementar os componentes de resultado (baseado no PRD, seção 4):
  - `ResumoScenario` — texto da IA
  - `TabelaFinanceira` — tabela com cenários e valores
  - `BenchmarkBar` — barra visual P25/P50/P75
  - `EquidadeCard` — análise com badge de risco
  - `TabelaRiscos` — tabela colorida por nível
  - `RecomendacaoCard` — card azul em destaque
  - `ConclusaoCard` — conclusão estratégica
- [ ] Testar com resultado real do banco

### 5.2 Exportação de PDF
- [ ] Instalar jsPDF: `npm install jspdf`
- [ ] Criar `src/lib/pdf.ts` — função que recebe o resultado e gera o PDF
- [ ] Incluir: logo RemunaIA, todas as seções, footer com URL
- [ ] Testar: clique no botão gera download com nome `RemunaIA_[cargo]_[data].pdf`

### 5.3 Histórico de simulações
- [ ] Criar `pages/Historico.tsx` — lista todas as simulações do usuário
- [ ] Criar `pages/SimulacaoDetalhe.tsx` — visualização completa de simulação salva
- [ ] Verificar que histórico exibe os dados corretos

### 5.4 Configurar Stripe e pagamentos
- [ ] No Stripe: criar 3 produtos (Starter, Professional, Enterprise)
- [ ] Criar Payment Links para cada plano
- [ ] Criar Edge Function `stripe-webhook`
  - `supabase functions new stripe-webhook`
  - Implementar lógica: receber evento → validar assinatura → atualizar plano no banco
- [ ] Configurar `supabase secrets set STRIPE_SECRET_KEY=...` e `STRIPE_WEBHOOK_SECRET=...`
- [ ] Criar `pages/Planos.tsx` — cards dos planos com botões de assinatura
- [ ] Criar `pages/Conta.tsx` — plano atual, uso do mês, botão cancelar
- [ ] Testar fluxo completo com cartão de teste do Stripe

**Entregável da Etapa 5:** Produto completo — simulação → resultado → PDF → pagamento

---

## ETAPA 6 — Landing Page, Testes e Deploy
**Duração:** 3 dias | **Ferramentas:** Canva Pro Site Builder + Vercel

### 6.1 Configurar deploy no Vercel
- [ ] Acessar vercel.com → importar repositório GitHub
- [ ] Configurar todas as variáveis de ambiente no Vercel
- [ ] Verificar que o build passa (`npm run build` sem erros)
- [ ] Fazer primeiro deploy de teste
- [ ] Configurar domínio personalizado (remunaIA.com.br)
- [ ] Aguardar propagação DNS e verificar HTTPS

### 6.2 Landing page no Canva Pro
- [ ] Copiar os textos de `documentacao/executiva/01_sumario_executivo.md` como base
- [ ] Criar a landing page no Canva Site Builder com todas as seções:
  - Hero com proposta de valor e CTA
  - Problema (4 cards com as dores do RH)
  - Como funciona (3 passos)
  - Exemplo de resultado real (print do Caso #001 anonimizado)
  - Planos e preços
  - FAQ
  - CTA final
- [ ] Gravar demo em vídeo de 2–3 minutos (Canva ou Loom)
- [ ] Incorporar vídeo na landing page
- [ ] Publicar landing page no domínio

### 6.3 Executar checklist de testes
- [ ] Executar todos os itens do checklist em `documentacao/tecnica/06_roadmap_desenvolvimento.md` (Semana 5)
- [ ] Realizar 20 simulações reais com dados reais (anonimizados)
- [ ] Verificar responsividade mobile em todas as telas
- [ ] Corrigir todos os bugs encontrados

### 6.4 Configurar automações de email (Resend)
- [ ] Configurar template de email de boas-vindas
- [ ] Configurar email "trial expirando em 2 dias"
- [ ] Configurar email de confirmação de assinatura
- [ ] Testar todos os emails recebendo no endereço real de Carla

**Entregável da Etapa 6:** Produto publicado no domínio + landing page no ar + todos os fluxos testados

---

## ETAPA 7 — Beta Fechado
**Duração:** 2 semanas | **Ferramentas:** WhatsApp + Microsoft Forms + VS Code

### 7.1 Montar lista de espera
- [ ] Publicar 3 posts de aquecimento no LinkedIn (templates em `documentacao/executiva/03_estrategia_gtm.md`)
- [ ] Publicar post de convite para beta ("estou abrindo 15 vagas")
- [ ] Receber interesse e selecionar 10–15 perfis ideais (ICP 1 e 2 do GTM)

### 7.2 Onboarding dos beta testers
- [ ] Enviar email personalizado com oferta: 60 dias grátis Professional
- [ ] Criar grupo WhatsApp "Beta RemunaIA"
- [ ] Gravar vídeo de tutorial de onboarding (Canva ou Loom — 5 minutos)
- [ ] Enviar email com link do vídeo + link do produto

### 7.3 Monitorar e coletar feedback
- [ ] Acompanhar uso diariamente no Posthog
- [ ] Enviar formulário de feedback na Semana 1 (Microsoft Forms)
- [ ] Responder todas as mensagens do grupo WhatsApp em até 2 horas
- [ ] Identificar e listar os top 3 problemas reportados

### 7.4 Iterar com base no feedback
- [ ] Priorizar os 3 maiores problemas
- [ ] Corrigir cada um (VS Code + GitHub Copilot)
- [ ] Fazer novo deploy no Vercel
- [ ] Avisar os beta testers sobre as melhorias

### 7.5 Coletar materiais para o lançamento
- [ ] Obter 5 depoimentos por escrito (ou autorização para usar print de mensagem)
- [ ] Selecionar 2–3 casos reais para mostrar anonimizados no lançamento
- [ ] Perguntar se algum beta tester aceita aparecer como referência no LinkedIn

**Entregável da Etapa 7:** Produto validado + 5 depoimentos + top 3 problemas resolvidos + lista de casos reais

---

## ETAPA 8 — Lançamento Público
**Duração:** 1 semana | **Ferramentas:** LinkedIn + Canva Pro + Stripe (modo produção)

### 8.1 Preparar material de lançamento (antes do lançamento)
- [ ] Criar os 5 posts da campanha de lançamento no Canva Pro (templates em `documentacao/executiva/03_estrategia_gtm.md`)
- [ ] Agendar os 5 posts no Canva scheduler (1 por dia, de segunda a sexta)
- [ ] Atualizar landing page com depoimentos dos beta testers
- [ ] Gravar demo final atualizado com o produto real

### 8.2 Ativar Stripe em modo produção
- [ ] Trocar chaves `sk_test_` por `sk_live_` nas variáveis de ambiente do Vercel
- [ ] Atualizar Payment Links para modo produção
- [ ] Atualizar STRIPE_WEBHOOK_SECRET com a chave de produção
- [ ] Fazer 1 pagamento real de teste (R$1 reembolsável) para confirmar funcionamento

### 8.3 Executar a semana de lançamento
- [ ] **Segunda:** publicar post "Hoje lançamos o RemunaIA" + responder todos os comentários
- [ ] **Terça:** publicar depoimento de beta tester
- [ ] **Quarta:** publicar vídeo demo ao vivo
- [ ] **Quinta:** publicar infográfico "3 distorções encontradas nos primeiros 10 casos"
- [ ] **Sexta:** publicar CTA direto "14 dias grátis, sem cartão"

### 8.4 Iniciar outbound
- [ ] Enviar 10 mensagens personalizadas por dia no LinkedIn (scripts em `documentacao/executiva/03_estrategia_gtm.md`)
- [ ] Registrar respostas em planilha Excel (nome, empresa, status, próximo passo)
- [ ] Responder todos os interessados em até 2 horas

### 8.5 Monitorar métricas diariamente
- [ ] Acessar Posthog: cadastros, simulações, PDFs exportados
- [ ] Acessar Stripe: novos pagamentos
- [ ] Preencher dashboard semanal toda sexta

**Entregável da Etapa 8:** Produto público + planos pagos ativos + primeiros clientes pagantes

---

## Resumo das Etapas com Duração

| Etapa | Descrição | Duração | Status |
|---|---|---|---|
| 1 | Identidade visual e fundação | 5 dias | ⏳ Aguardando |
| 2 | Banco de dados e autenticação | 2 dias | ⏳ Aguardando |
| 3 | Código base do produto | 3 dias | ⏳ Aguardando |
| 4 | Integração da IA (Gemini) | 2 dias | ⏳ Aguardando |
| 5 | Resultado, PDF e pagamento | 3 dias | ⏳ Aguardando |
| 6 | Landing page, testes e deploy | 3 dias | ⏳ Aguardando |
| 7 | Beta fechado | 14 dias | ⏳ Aguardando |
| 8 | Lançamento público | 7 dias | ⏳ Aguardando |
| **Total** | **Planejamento → Produto no ar** | **~8 semanas** | |

---

## Dependências Críticas (respeitar a ordem)

```
Etapa 1 → obrigatória antes de tudo (contas + credenciais)
     ↓
Etapa 2 → banco deve existir antes do código
     ↓
Etapa 3 → código base antes da IA
     ↓
Etapa 4 → IA integrada antes da tela de resultado
     ↓
Etapa 5 → resultado e PDF antes de testar
     ↓
Etapa 6 → testes antes de mostrar para beta
     ↓
Etapa 7 → beta antes do lançamento público
     ↓
Etapa 8 → lançamento
```

---

## Documentação de Referência por Etapa

| Etapa | Documento de referência |
|---|---|
| 1 | `documentacao/tecnica/07_guia_deploy_infraestrutura.md` |
| 2 | `documentacao/tecnica/04_schema_banco_de_dados.md` |
| 3 | `documentacao/tecnica/02_PRD_requisitos_do_produto.md` + `03_especificacoes_tecnicas.md` |
| 4 | `documentacao/tecnica/05_prompt_master_ia.md` + `03_especificacoes_tecnicas.md` |
| 5 | `documentacao/tecnica/02_PRD_requisitos_do_produto.md` |
| 6 | `documentacao/tecnica/06_roadmap_desenvolvimento.md` (Semana 5) |
| 7 | `documentacao/executiva/03_estrategia_gtm.md` + `06_playbook_operacional.md` |
| 8 | `documentacao/executiva/03_estrategia_gtm.md` + `05_kpis_e_metricas.md` |
