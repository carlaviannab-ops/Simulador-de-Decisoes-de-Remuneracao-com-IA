# Roadmap de Desenvolvimento — RemunaIA

**Versão:** 1.0  
**Atualizado em:** 04/04/2026  

---

## Visão Geral

8 semanas do zero ao produto no ar. Desenvolvido por Carla, sozinha, usando GitHub Copilot (M365) + VS Code + Bolt.new.

```
Semana 1  → Fundação: identidade, contas, prompt master
Semana 2  → Código base + banco de dados
Semana 3  → Integração Gemini API + resultado
Semana 4  → PDF + Stripe + autenticação completa
Semana 5  → Landing page + testes internos
Semana 6  → Beta fechado (10 empresas)
Semana 7  → Iterações pós-beta + ajustes
Semana 8  → Lançamento público
```

---

## Semana 1 — Fundação

### Objetivos
- Identidade visual criada (Canva Pro)
- Todas as contas configuradas
- Prompt master validado com 10 casos

### Tarefas

| # | Tarefa | Ferramenta | Entregável | Validação |
|---|---|---|---|---|
| 1.1 | Criar Brand Kit no Canva Pro (logo, cores, fontes) | Canva Pro | Logo em 3 variações | Visual aprovado por Carla |
| 1.2 | Criar conta Supabase + novo projeto | Supabase | Projeto criado, URL e chaves anotadas | Login funcionando |
| 1.3 | Criar conta Vercel + conectar GitHub | Vercel + GitHub | Repos conectados | Deploy de teste passando |
| 1.4 | Criar conta Google AI Studio + obter Gemini API key | Google AI Studio | API key ativa | Teste de chamada retorna resposta |
| 1.5 | Criar conta Stripe + configurar 3 produtos | Stripe | Starter R$497, Professional R$1.297, Enterprise R$2.997 criados | Payment links funcionando |
| 1.6 | Criar conta Resend + configurar domínio | Resend | Domínio verificado, API key obtida | Email de teste enviado |
| 1.7 | Criar conta Posthog | Posthog | API key obtida | Script de tracking copiado |
| 1.8 | Registrar domínio remunaIA.com.br | Registro.br | Domínio ativo | Resolução de DNS funcionando |
| 1.9 | Construir prompt master v1.0 (4 tipos de simulação) | Microsoft Copilot + Word | Arquivo `05_prompt_master_ia.md` | Testado com 10 casos, output válido |
| 1.10 | Testar Gemini API manualmente com prompt master | Google AI Studio playground | 10 resultados JSON validados | JSON válido em 100% dos casos |

### Definition of Done — Semana 1
- [ ] Todas as 8 contas criadas e credenciais salvas em local seguro (OneDrive)
- [ ] Logo final escolhido e exportado em PNG (fundo branco, fundo transparente, fundo escuro)
- [ ] Prompt master testado com: 1 promoção, 1 aumento, 1 contratação, 1 ajuste de faixa
- [ ] Todos os resultados dos testes retornam JSON válido e completo

---

## Semana 2 — Código Base + Banco de Dados

### Objetivos
- Estrutura do projeto React criada
- Banco de dados configurado no Supabase
- Autenticação básica funcionando

### Tarefas

| # | Tarefa | Ferramenta | Entregável | Validação |
|---|---|---|---|---|
| 2.1 | Gerar projeto base com Bolt.new | Bolt.new | Projeto React + Tailwind gerado | Roda localmente sem erros |
| 2.2 | Refinar estrutura de pastas no Cursor/VS Code | VS Code + GitHub Copilot | Estrutura `/pages`, `/components`, `/lib` | Código organizado conforme spec |
| 2.3 | Criar tabelas no Supabase (profiles + simulacoes) | Supabase dashboard | Tabelas criadas com todos os campos | Inserção de registro de teste OK |
| 2.4 | Configurar RLS (Row Level Security) | Supabase dashboard | Políticas ativas | Usuário A não vê dados do usuário B |
| 2.5 | Criar trigger de criação de perfil pós-cadastro | Supabase SQL editor | Trigger `on_auth_user_created` | Novo usuário → perfil criado automaticamente |
| 2.6 | Implementar autenticação (login + cadastro) | VS Code + GitHub Copilot | Páginas de login e cadastro | Login com email + Google OAuth funcionando |
| 2.7 | Implementar proteção de rotas | VS Code + GitHub Copilot | Redirect para login se não autenticado | Tentar acessar /dashboard sem login redireciona |
| 2.8 | Criar página de Dashboard (lista de simulações vazia) | VS Code + GitHub Copilot | Tela de dashboard | Dashboard renderiza sem erro para usuário logado |
| 2.9 | Commit e push para GitHub | GitHub | Repositório atualizado | CI/CD no Vercel faz deploy de preview |

### Definition of Done — Semana 2
- [ ] Projeto rodando localmente na porta 3000
- [ ] Login por email e Google OAuth funcionando
- [ ] Criar conta → perfil criado automaticamente no banco
- [ ] Dashboard acessível apenas para usuários logados
- [ ] Deploy automático no Vercel a cada push

---

## Semana 3 — Formulário + Integração Gemini + Tela de Resultado

### Objetivos
- Formulário wizard completo
- Integração com Gemini API funcionando
- Tela de resultado exibindo análise completa

### Tarefas

| # | Tarefa | Ferramenta | Entregável | Validação |
|---|---|---|---|---|
| 3.1 | Criar formulário wizard Passo 1 (tipo de movimento) | VS Code + GitHub Copilot | 4 cards selecionáveis | Seleção salva no estado |
| 3.2 | Criar formulário wizard Passo 2 (dados do cargo) | VS Code + GitHub Copilot | Campos validados com feedback visual | Não avança com campos obrigatórios vazios |
| 3.3 | Criar formulário wizard Passo 3 (contexto) | VS Code + GitHub Copilot | Textarea + campos opcionais | Textarea aceita texto longo |
| 3.4 | Criar função de integração com Gemini API (`/lib/gemini.ts`) | VS Code + GitHub Copilot | Função assíncrona com tratamento de erro | Retorna JSON válido em 10 testes |
| 3.5 | Criar Edge Function no Supabase para chamar Gemini | Supabase Edge Functions | Endpoint POST `/simulate` | Chamada server-side segura (API key não exposta) |
| 3.6 | Salvar simulação no banco após resultado | VS Code + GitHub Copilot | Registro criado em `simulacoes` | Consultar banco confirma registro |
| 3.7 | Criar tela de resultado — seção Resumo e Financeiro | VS Code + GitHub Copilot | Cards com dados formatados em R$ | Valores exibidos corretamente |
| 3.8 | Criar tela de resultado — seção Benchmark | VS Code + GitHub Copilot | Barra visual P25/P50/P75 com marcador | Posicionamento correto visualmente |
| 3.9 | Criar tela de resultado — seção Riscos | VS Code + GitHub Copilot | Tabela com badges coloridos por nível | Verde=baixo, amarelo=médio, vermelho=alto |
| 3.10 | Criar tela de resultado — seção Recomendação | VS Code + GitHub Copilot | Card em destaque azul com decisão da IA | Recomendação legível e em destaque |

### Definition of Done — Semana 3
- [ ] Formulário completo com validação em todos os passos
- [ ] Simulação de promoção gera resultado válido end-to-end
- [ ] Simulação de aumento gera resultado válido end-to-end
- [ ] Simulação de contratação gera resultado válido end-to-end
- [ ] Simulação de ajuste de faixa gera resultado válido end-to-end
- [ ] Resultado salvo no banco após cada simulação

---

## Semana 4 — PDF + Stripe + Histórico

### Objetivos
- Exportação de PDF funcionando
- Pagamento com Stripe integrado
- Histórico de casos completo

### Tarefas

| # | Tarefa | Ferramenta | Entregável | Validação |
|---|---|---|---|---|
| 4.1 | Instalar jsPDF e criar template do relatório | VS Code + GitHub Copilot | PDF gerado com logo + todas as seções | PDF abre corretamente, dados corretos |
| 4.2 | Botão "Exportar PDF" na tela de resultado | VS Code + GitHub Copilot | Clique inicia download | PDF baixado com nome `remunaIA_[cargo]_[data].pdf` |
| 4.3 | Criar página de planos (`/planos`) | VS Code + GitHub Copilot | 3 cards de plano + botão assinar | Renderiza corretamente |
| 4.4 | Criar Payment Links no Stripe para cada plano | Stripe dashboard | 3 links de pagamento | Clique abre checkout do Stripe |
| 4.5 | Criar Edge Function para webhook do Stripe | Supabase Edge Functions | Endpoint `/stripe-webhook` | Recebe eventos de pagamento |
| 4.6 | Atualizar plano do usuário após pagamento confirmado | Edge Function + Supabase | `profiles.plano` atualizado | Pagar Starter → plano muda para 'starter' |
| 4.7 | Implementar bloqueio por limite de simulações | VS Code + GitHub Copilot | Trial: 3 sim. | Starter: 20/mês | Modal de upgrade ao atingir limite |
| 4.8 | Criar página de histórico (`/historico`) | VS Code + GitHub Copilot | Lista de simulações com filtros | Simulações anteriores visíveis e clicáveis |
| 4.9 | Criar página de detalhe de simulação salva | VS Code + GitHub Copilot | Visualização completa do resultado salvo | Todos os campos exibidos corretamente |
| 4.10 | Criar página de conta (`/conta`) | VS Code + GitHub Copilot | Plano atual, uso do mês, botão cancelar | Informações corretas para cada plano |

### Definition of Done — Semana 4
- [ ] PDF gerado corretamente para qualquer simulação
- [ ] Pagamento Stripe atualiza plano no banco em < 30 segundos
- [ ] Trial de 3 simulações bloqueia na 4ª
- [ ] Starter bloqueia na 21ª simulação do mês
- [ ] Histórico exibe todas as simulações do usuário
- [ ] Página de conta mostra plano correto

---

## Semana 5 — Landing Page + Testes Internos

### Objetivos
- Landing page publicada no domínio
- Todos os fluxos testados manualmente
- 20 simulações reais validadas

### Tarefas

| # | Tarefa | Ferramenta | Entregável | Validação |
|---|---|---|---|---|
| 5.1 | Escrever copy completo da landing page | Microsoft Copilot + Word | Documento com todos os textos | Aprovado por Carla |
| 5.2 | Criar landing page no Canva Site Builder | Canva Pro | Página publicada | Abre no browser sem erros |
| 5.3 | Configurar domínio remunaIA.com.br no Canva | Canva Pro + Registro.br | Domínio apontando para Canva | Site abre via domínio em até 24h |
| 5.4 | Gravar demo em vídeo (Canva ou Loom) | Canva Pro / Loom | Vídeo de 2-3 min | Incorporado na landing page |
| 5.5 | Executar checklist completo de testes | Manual | Checklist preenchido | 100% dos itens OK |
| 5.6 | Realizar 20 simulações reais com dados anonimizados | Produto | 20 simulações no banco | Todas com status 'concluido' |
| 5.7 | Configurar Posthog para rastrear eventos-chave | VS Code + GitHub Copilot | Eventos: cadastro, simulação_iniciada, simulação_concluída, pdf_exportado, pagamento_iniciado | Eventos aparecendo no dashboard Posthog |
| 5.8 | Configurar email de boas-vindas no Resend | Resend | Email automático para novos usuários | Email recebido em < 2 min após cadastro |
| 5.9 | Configurar Crisp no produto | Crisp | Widget de chat visível | Mensagem de teste recebida |

### Checklist Completo de Testes

**Fluxo de cadastro e autenticação:**
- [ ] Cadastro por email → email de boas-vindas recebido
- [ ] Login por email → acessa dashboard
- [ ] Login por Google → acessa dashboard
- [ ] Logout → redireciona para login
- [ ] Acesso a rota protegida sem login → redireciona para login

**Fluxo de simulação:**
- [ ] Promoção: formulário completo → resultado exibido → PDF gerado
- [ ] Aumento: formulário completo → resultado exibido → PDF gerado
- [ ] Contratação: formulário completo → resultado exibido → PDF gerado
- [ ] Ajuste de faixa: formulário completo → resultado exibido → PDF gerado
- [ ] Simulação sem contexto adicional (campos opcionais em branco) → funciona
- [ ] Simulação com regime PJ → benchmark ajustado corretamente
- [ ] Simulação com regime CLT → benchmark sem ajuste PJ

**Fluxo de pagamento:**
- [ ] Trial: 3 simulações → 4ª bloqueada com modal de upgrade
- [ ] Clicar "Assinar Starter" → abre Stripe Checkout
- [ ] Pagar no Stripe (cartão de teste) → plano atualiza para 'starter'
- [ ] Starter: 20 simulações → 21ª bloqueada
- [ ] Clicar "Assinar Professional" → abre Stripe Checkout
- [ ] Pagar → plano atualiza para 'professional' → sem limite

**Fluxo de histórico:**
- [ ] Simulação concluída → aparece no histórico
- [ ] Clicar em simulação no histórico → abre detalhe completo
- [ ] PDF re-exportável da tela de detalhe

**Responsividade:**
- [ ] Landing page: mobile 375px ✓
- [ ] Formulário: mobile ✓
- [ ] Resultado: mobile ✓
- [ ] Histórico: mobile ✓

---

## Semana 6 — Beta Fechado

### Objetivos
- 10 empresas usando o produto
- Feedback estruturado coletado
- Lista dos 3 maiores problemas identificada

### Tarefas

| # | Tarefa | Ferramenta | Entregável |
|---|---|---|---|
| 6.1 | Selecionar 10 beta testers (5 rede de Carla + 5 lista de espera) | LinkedIn + lista de espera | Lista de 10 contatos confirmados |
| 6.2 | Enviar convite personalizado com oferta (60 dias grátis Professional) | Outlook + Copilot | 10 aceites confirmados |
| 6.3 | Criar grupo WhatsApp "Beta RemunaIA" | WhatsApp | Grupo criado com todos os betas |
| 6.4 | Criar formulário de feedback quinzenal | Microsoft Forms | Formulário com 7 perguntas enviado |
| 6.5 | Gravar e enviar vídeo de tutorial de onboarding | Canva Pro / Loom | Vídeo de 5 min + email enviado para todos |
| 6.6 | Monitorar uso via Posthog diariamente | Posthog | Relatório diário de uso |
| 6.7 | Coletar feedback da Semana 1 (formulário + grupo WhatsApp) | Microsoft Forms | Respostas compiladas |

### Métricas de Sucesso do Beta
- ≥ 7 de 10 beta testers realizam pelo menos 1 simulação
- ≥ 5 depoimentos coletados (por escrito ou gravado)
- Lista dos top 3 problemas priorizada e documentada

---

## Semana 7 — Iterações Pós-Beta

### Objetivos
- Top 3 problemas do beta corrigidos
- Produto estável e polido
- Material de lançamento pronto

### Tarefas

| # | Tarefa | Ferramenta | Entregável |
|---|---|---|---|
| 7.1 | Priorizar feedbacks do beta (top 3 problemas) | Microsoft Copilot + Word | Lista priorizada |
| 7.2 | Corrigir problema #1 | VS Code + GitHub Copilot | Bug/melhoria implementada |
| 7.3 | Corrigir problema #2 | VS Code + GitHub Copilot | Bug/melhoria implementada |
| 7.4 | Corrigir problema #3 | VS Code + GitHub Copilot | Bug/melhoria implementada |
| 7.5 | Criar 5 posts LinkedIn de lançamento (Canva + Copilot) | Canva Pro + Microsoft Copilot | 5 posts prontos e agendados |
| 7.6 | Criar carrossel "Caso Real" com print anonimizado | Canva Pro | Carrossel de 8 slides pronto |
| 7.7 | Preparar templates de outbound LinkedIn (3 personas) | Microsoft Copilot | 3 templates aprovados |
| 7.8 | Teste de regressão: 10 simulações após ajustes | Manual | Todas funcionando corretamente |

---

## Semana 8 — Lançamento Público

### Objetivos
- Produto público com planos pagos ativos
- Campanha de lançamento ativa
- Primeiros clientes pagantes

### Tarefas

| # | Tarefa | Ferramenta | Entregável |
|---|---|---|---|
| 8.1 | Ativar Stripe em modo produção | Stripe | Planos pagos funcionando com cartões reais |
| 8.2 | Publicar post de lançamento Dia 1 | LinkedIn + Canva | Post publicado |
| 8.3 | Iniciar outbound: 10 mensagens/dia | LinkedIn + Outlook | 10 mensagens enviadas no Dia 1 |
| 8.4 | Monitorar métricas diariamente | Posthog + Stripe | Relatório diário: acessos, cadastros, simulações, pagamentos |
| 8.5 | Responder todos os comentários e mensagens em < 2h | LinkedIn + Outlook | SLA cumprido |

---

## Roadmap Pós-MVP

### V1.5 — Mês 3-4 (pós 30 clientes pagantes)
- Análise de equidade em lote (múltiplos colaboradores)
- Comparativo com estrutura salarial da empresa (upload CSV)
- Dashboard de saúde salarial (visão macro)
- Filtros avançados no histórico

### V2.0 — Mês 6-8 (pós 80 clientes pagantes)
- Integração com ADP/Totvs via API
- Módulo de política salarial (configurar faixas da empresa)
- Análise de gap por gênero/raça
- Alertas proativos: "3 colaboradores abaixo do P25"

### V3.0 — Mês 12+ (pós 200 clientes pagantes)
- Módulo de orçamento salarial (planejamento anual)
- White-label para consultorias de RH
- Marketplace de benchmarks premium (Mercer, Hay Group)
- IA preditiva: risco de turnover por remuneração

---

## Riscos Técnicos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|
| Gemini retorna JSON inválido | Média | Alto | Validação + retry automático com prompt reforçado |
| Free tier Gemini atingido (1.500 req/dia) | Baixa no piloto | Médio | Monitorar via Posthog; se atingir, migrar para Google AI Studio pago (~R$0,07/1M tokens) |
| Supabase free tier esgota (500MB) | Baixa no piloto | Médio | Monitorar tamanho; migrar para Pro (R$125/mês) quando atingir 400MB |
| Stripe webhook falhando | Baixa | Alto | Retry automático do Stripe + log de eventos para reprocessar manual |
| Bug crítico pós-lançamento | Média | Alto | Plano de rollback: Vercel permite voltar para deploy anterior em 1 clique |
| Bolt.new gera código com vulnerabilidade | Média | Alto | Revisar código gerado antes de publicar; nunca expor API keys no frontend |
