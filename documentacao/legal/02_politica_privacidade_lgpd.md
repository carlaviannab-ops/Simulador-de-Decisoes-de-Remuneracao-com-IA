# Política de Privacidade — RemunaIA

**Vigência:** [DATA DE PUBLICAÇÃO]  
**Versão:** 1.0  

Esta Política de Privacidade descreve como o **RemunaIA** coleta, usa, armazena e compartilha seus dados pessoais, em conformidade com a **Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018)**.

---

## 1. Identificação do Controlador

**Controlador dos dados:** RemunaIA (operado por Carla [Sobrenome], CPF/CNPJ a definir na formalização)  
**E-mail de contato:** privacidade@remunaIA.com.br  
**Endereço:** [Endereço a preencher na formalização]

---

## 2. Encarregado pelo Tratamento de Dados (DPO)

Conforme Art. 41 da LGPD, o Encarregado pelo Tratamento de Dados Pessoais do RemunaIA é:  
**Nome:** Carla [Sobrenome]  
**E-mail:** dpo@remunaIA.com.br  

O Encarregado é o canal de comunicação entre o RemunaIA, os titulares de dados e a Autoridade Nacional de Proteção de Dados (ANPD).

---

## 3. Dados Coletados e Finalidade

### 3.1 Dados de Cadastro

| Dado | Finalidade | Base Legal (Art. 7º LGPD) |
|---|---|---|
| Nome completo | Identificação do usuário | Execução de contrato (Art. 7º, V) |
| Endereço de e-mail | Autenticação, comunicações do serviço | Execução de contrato (Art. 7º, V) |
| Nome da empresa | Personalização e segmentação do serviço | Execução de contrato (Art. 7º, V) |
| Setor da empresa | Benchmark e melhoria do serviço | Legítimo interesse (Art. 7º, IX) |

### 3.2 Dados de Simulação (Dados Sensíveis — Art. 11 LGPD)

Os dados salariais inseridos nas simulações são considerados **dados sensíveis** por poderem revelar informações sobre a situação econômica de terceiros (colaboradores).

| Dado | Finalidade | Base Legal |
|---|---|---|
| Cargo e nível do colaborador | Gerar a simulação | Consentimento do usuário (Art. 11, I) |
| Salário atual e proposto | Calcular impacto financeiro e benchmark | Consentimento (Art. 11, I) |
| Regime de contratação (CLT/PJ) | Ajustar análise | Consentimento (Art. 11, I) |
| Setor e localização | Benchmark regional | Consentimento (Art. 11, I) |
| Contexto adicional fornecido | Enriquecer a análise da IA | Consentimento (Art. 11, I) |

> **Importante:** Os dados salariais inseridos são referentes a colaboradores de terceiros (funcionários da empresa do usuário). O usuário é responsável por garantir que possui legitimidade para inserir esses dados na plataforma.

### 3.3 Dados de Pagamento

Os dados de cartão de crédito e pagamento são processados exclusivamente pelo **Stripe** (processador de pagamentos). O RemunaIA **não armazena** dados de cartão. Consulte a Política de Privacidade do Stripe em stripe.com/privacy.

### 3.4 Dados de Uso

| Dado | Finalidade | Base Legal |
|---|---|---|
| Páginas acessadas e cliques | Melhorar a experiência do produto | Legítimo interesse (Art. 7º, IX) |
| Número de simulações realizadas | Controle de plano e analytics | Execução de contrato (Art. 7º, V) |
| Erros e eventos técnicos | Diagnóstico e manutenção | Legítimo interesse (Art. 7º, IX) |
| Endereço IP e dados do navegador | Segurança e prevenção de fraudes | Legítimo interesse (Art. 7º, IX) |

---

## 4. Compartilhamento de Dados com Terceiros

O RemunaIA compartilha dados com os seguintes subprocessadores:

| Subprocessador | País | Finalidade | Dados compartilhados |
|---|---|---|---|
| **Supabase** (infraestrutura) | EUA (AWS) | Armazenamento de dados | Cadastro + simulações |
| **Google** (Gemini API) | EUA | Processamento pela IA para gerar análises | Dados da simulação (sem identificação pessoal do colaborador) |
| **Stripe** | EUA | Processamento de pagamentos | E-mail, dados de faturamento |
| **Resend** | EUA | Envio de e-mails transacionais | Nome e e-mail do usuário |
| **Posthog** | UE | Analytics de produto | Eventos de uso (anonimizados) |

> O RemunaIA **não vende, não compartilha comercialmente e não cede** dados pessoais a terceiros não listados acima.

---

## 5. Transferência Internacional de Dados

Os dados são armazenados em servidores nos Estados Unidos (Supabase/AWS) e processados pelo Google (Gemini API). Essa transferência é realizada com base no Art. 33, II da LGPD, que permite a transferência para países que proporcionem grau de proteção de dados pessoais adequado.

Os subprocessadores listados são signatários de cláusulas contratuais padrão e seguem frameworks internacionais de proteção de dados (GDPR, SOC 2).

---

## 6. Prazo de Retenção dos Dados

| Tipo de dado | Prazo de retenção | Ação após o prazo |
|---|---|---|
| Dados de cadastro (conta ativa) | Enquanto a conta estiver ativa | Mantidos |
| Dados de cadastro (conta cancelada) | 1 ano após o cancelamento | Anonimizados |
| Dados de simulações (completos) | 2 anos | Resultado removido, metadados mantidos |
| Dados de pagamento | Conforme Stripe | N/A |
| Logs de acesso | 30 dias | Deletados automaticamente |

---

## 7. Direitos do Titular (Art. 18 LGPD)

Você tem os seguintes direitos sobre seus dados pessoais:

| Direito | Como exercer |
|---|---|
| **Acesso** — saber quais dados temos | E-mail para privacidade@remunaIA.com.br |
| **Correção** — corrigir dados incorretos | Acessar a página "Minha Conta" ou por e-mail |
| **Exclusão** — deletar seus dados | E-mail para privacidade@remunaIA.com.br com pedido de exclusão |
| **Portabilidade** — receber seus dados em formato legível | E-mail para privacidade@remunaIA.com.br |
| **Revogação de consentimento** — para dados tratados com base em consentimento | E-mail ou cancelamento da conta |
| **Informação sobre compartilhamento** — saber com quem compartilhamos | Esta política ou por e-mail |
| **Revisão de decisão automatizada** — contestar decisões tomadas por IA | E-mail explicando o caso |

**Prazo de resposta:** 15 dias corridos após o recebimento da solicitação.

---

## 8. Segurança dos Dados

Adotamos as seguintes medidas técnicas e organizacionais:

- **Criptografia em trânsito:** HTTPS/TLS em todas as comunicações
- **Criptografia em repouso:** Banco de dados criptografado via Supabase
- **Controle de acesso:** Row Level Security (RLS) — cada usuário acessa apenas seus próprios dados
- **Autenticação:** Senhas com bcrypt, sessões com JWT
- **Minimização:** Coletamos apenas os dados estritamente necessários
- **Acesso restrito:** API keys de produção nunca expostas no frontend

---

## 9. Cookies

Ver Política de Cookies separada em [03_politica_de_cookies.md].

---

## 10. Menores de Idade

O RemunaIA é destinado exclusivamente a profissionais e empresas. **Não coletamos dados de menores de 18 anos.** Se identificarmos que dados de menor foram coletados inadvertidamente, os excluiremos imediatamente.

---

## 11. Alterações nesta Política

Esta política pode ser atualizada periodicamente. Quando houver alterações relevantes, notificaremos por e-mail com 30 dias de antecedência. O uso continuado do serviço após a notificação representa aceitação da nova política.

---

## 12. Contato e Reclamações

- **E-mail:** privacidade@remunaIA.com.br
- **ANPD:** Caso não obtenha resposta satisfatória, você pode contatar a Autoridade Nacional de Proteção de Dados em www.gov.br/anpd
