# Prompt Master da IA — RemunaIA

**Versão:** 1.0  
**Atualizado em:** 04/04/2026  
**Motor de IA:** Google Gemini 1.5 Flash  
**Responsável:** Carla  

---

## 1. Objetivo e Filosofia

O Prompt Master é o ativo central e diferencial do RemunaIA. Ele transforma o conhecimento especializado de Carla em remuneração estratégica em um sistema inteligente capaz de analisar qualquer caso salarial com rigor técnico e entregar uma recomendação clara e justificada.

**Princípios do prompt:**
- Nunca genérico — cada análise é específica ao caso
- Sempre recomendação clara — sem ambiguidade
- Dados antes de opinião — benchmarks e números primeiro
- Risco identificado — jamais omitir riscos relevantes
- Linguagem executiva — pronto para apresentar à liderança

---

## 2. System Prompt Base (Todos os Tipos)

Este prompt é enviado como `system` em cada chamada à Gemini API:

```
Você é um consultor sênior especializado em remuneração estratégica com 15 anos de experiência em empresas brasileiras de médio e grande porte. Sua especialidade é análise de estruturas salariais, benchmarks de mercado e tomada de decisão organizacional.

MISSÃO: Analisar o caso de remuneração apresentado e entregar uma recomendação clara, objetiva e aplicável.

REGRAS CRÍTICAS (não negociáveis):
1. NUNCA responda de forma genérica. Cada análise deve ser específica ao caso.
2. SEMPRE entregue uma recomendação clara — nunca "depende" sem especificar de quê.
3. SEMPRE inclua impacto financeiro com números reais (R$).
4. SEMPRE posicione o salário em relação ao mercado (P25/P50/P75).
5. Se faltar informação, crie cenários plausíveis e declare explicitamente.
6. Use benchmarks de: Robert Half Guia Salarial 2026, Portal Salario.com.br, CAGED/MTE.
7. Considere o fator de conversão CLT→PJ de 1,30 a 1,40x.
8. Ajuste benchmarks por setor: Educação (-15% a -25%), Tecnologia (+15% a +25%), Saúde (mercado), Varejo (-10% a -15%), Serviços (mercado).

FORMATO DE SAÍDA: Retorne APENAS um JSON válido, sem markdown, sem texto fora do JSON, seguindo exatamente o schema especificado. Não inclua ```json nem ```.
```

---

## 3. Prompts por Tipo de Simulação

### 3.1 Promoção

**User prompt template:**
```
TIPO DE MOVIMENTO: Promoção

DADOS DO CASO:
- Cargo atual: {cargo_atual}
- Cargo proposto: {cargo_proposto}
- Salário atual: R$ {salario_atual} ({regime})
- Salário proposto: R$ {salario_proposto} ({regime})
- Budget disponível: {budget} (informado: {budget_informado})
- Setor: {setor}
- Estado: {estado}
- Histórico de avaliação: {historico_avaliacao}
- Política salarial da empresa: {politica_salarial}
- Contexto adicional: {contexto}
- Há outros colaboradores no mesmo cargo: {pares_existem} | Salário médio dos pares: {salario_pares}

Analise este caso de promoção seguindo as regras e retorne o JSON com o schema abaixo:

{
  "resumo_cenario": "string — 3 a 5 frases descrevendo o caso, os pontos críticos e o contexto",
  "simulacao_financeira": {
    "tabela": [
      {"cenario": "string", "salario_mensal": number, "variacao_percentual": number, "custo_anual_incremental": number}
    ],
    "nota": "string — observações sobre o cálculo (CLT vs PJ, benefícios, etc.)"
  },
  "benchmark_mercado": {
    "fonte": "string",
    "p25": number,
    "p50": number,
    "p75": number,
    "p90": number,
    "posicionamento_atual": "string — onde o salário atual está (ex: abaixo do P25)",
    "posicionamento_proposto": "string — onde o salário proposto está",
    "ajuste_setor": "string — explicação do ajuste aplicado para o setor",
    "nota": "string"
  },
  "equidade_interna": {
    "analise": "string — análise de distorções internas",
    "risco_distorcao": "baixo | medio | alto",
    "recomendacao_equidade": "string"
  },
  "riscos": [
    {"risco": "string", "nivel": "baixo | medio | alto", "descricao": "string", "mitigacao": "string"}
  ],
  "recomendacao": {
    "decisao": "string — ação recomendada em 1 frase direta",
    "salario_recomendado": number,
    "justificativa": "string — por que este valor e não outro",
    "condicoes": "string — condições ou compromissos associados",
    "urgencia": "imediata | pode aguardar | não recomendado agora"
  },
  "conclusao_estrategica": "string — 3 a 5 frases sobre o impacto estratégico da decisão, custo de não agir, comparativo com custo de reposição",
  "suposicoes_adotadas": ["string"]
}
```

---

### 3.2 Aumento Salarial

**User prompt template:**
```
TIPO DE MOVIMENTO: Aumento Salarial (mesmo cargo)

DADOS DO CASO:
- Cargo: {cargo_atual}
- Salário atual: R$ {salario_atual} ({regime})
- Salário proposto: R$ {salario_proposto} ({regime})
- Motivo do aumento: {motivo} (mérito / retenção / reajuste de mercado / ajuste de inflação)
- Budget disponível: {budget} (informado: {budget_informado})
- Setor: {setor}
- Estado: {estado}
- Tempo no cargo: {tempo_cargo}
- Histórico de avaliação: {historico_avaliacao}
- Contexto adicional: {contexto}
- Pares internos: {pares_existem} | Salário médio dos pares: {salario_pares}

Analise este caso de aumento salarial seguindo as regras e retorne o JSON com o schema abaixo:

{
  "resumo_cenario": "string",
  "simulacao_financeira": {
    "tabela": [
      {"cenario": "string", "salario_mensal": number, "variacao_percentual": number, "custo_anual_incremental": number}
    ],
    "nota": "string"
  },
  "benchmark_mercado": {
    "fonte": "string",
    "p25": number,
    "p50": number,
    "p75": number,
    "p90": number,
    "posicionamento_atual": "string",
    "posicionamento_proposto": "string",
    "ajuste_setor": "string",
    "nota": "string"
  },
  "equidade_interna": {
    "analise": "string",
    "risco_distorcao": "baixo | medio | alto",
    "recomendacao_equidade": "string"
  },
  "riscos": [
    {"risco": "string", "nivel": "baixo | medio | alto", "descricao": "string", "mitigacao": "string"}
  ],
  "recomendacao": {
    "decisao": "string",
    "salario_recomendado": number,
    "justificativa": "string",
    "condicoes": "string",
    "urgencia": "imediata | pode aguardar | não recomendado agora"
  },
  "conclusao_estrategica": "string",
  "suposicoes_adotadas": ["string"]
}
```

---

### 3.3 Nova Contratação

**User prompt template:**
```
TIPO DE MOVIMENTO: Nova Contratação

DADOS DO CASO:
- Cargo a contratar: {cargo_proposto}
- Salário pretendido pelo candidato: R$ {salario_proposto} ({regime})
- Faixa de budget para contratação: R$ {salario_atual} a R$ {budget} ({regime})
- Setor: {setor}
- Estado: {estado}
- Nível de senioridade: {nivel_senioridade}
- Contexto adicional: {contexto}
- Pares internos no mesmo cargo: {pares_existem} | Salário médio dos pares: {salario_pares}

Analise esta decisão de contratação seguindo as regras e retorne o JSON com o schema:

{
  "resumo_cenario": "string",
  "simulacao_financeira": {
    "tabela": [
      {"cenario": "string", "salario_mensal": number, "variacao_percentual": number, "custo_anual_incremental": number}
    ],
    "nota": "string — incluir estimativa de encargos CLT ou diferença CLT/PJ se relevante"
  },
  "benchmark_mercado": {
    "fonte": "string",
    "p25": number,
    "p50": number,
    "p75": number,
    "p90": number,
    "posicionamento_proposto": "string",
    "ajuste_setor": "string",
    "nota": "string"
  },
  "equidade_interna": {
    "analise": "string",
    "risco_distorcao": "baixo | medio | alto",
    "recomendacao_equidade": "string"
  },
  "riscos": [
    {"risco": "string", "nivel": "baixo | medio | alto", "descricao": "string", "mitigacao": "string"}
  ],
  "recomendacao": {
    "decisao": "string",
    "salario_recomendado": number,
    "justificativa": "string",
    "condicoes": "string",
    "urgencia": "imediata | pode aguardar | não recomendado agora"
  },
  "conclusao_estrategica": "string",
  "suposicoes_adotadas": ["string"]
}
```

---

### 3.4 Ajuste de Faixa

**User prompt template:**
```
TIPO DE MOVIMENTO: Ajuste de Faixa Salarial

DADOS DO CASO:
- Cargo: {cargo_atual}
- Salário atual: R$ {salario_atual} ({regime})
- Novo posicionamento desejado: R$ {salario_proposto} ({regime})
- Motivo do ajuste: {motivo} (descompressão / realinhamento ao mercado / reestruturação de grade)
- Setor: {setor}
- Estado: {estado}
- Número de colaboradores afetados: {contexto}
- Pares internos: {pares_existem} | Salário médio dos pares: {salario_pares}
- Contexto adicional: {contexto}

Analise este ajuste de faixa seguindo as regras e retorne o JSON com o schema:

{
  "resumo_cenario": "string",
  "simulacao_financeira": {
    "tabela": [
      {"cenario": "string", "salario_mensal": number, "variacao_percentual": number, "custo_anual_incremental": number}
    ],
    "nota": "string"
  },
  "benchmark_mercado": {
    "fonte": "string",
    "p25": number,
    "p50": number,
    "p75": number,
    "p90": number,
    "posicionamento_atual": "string",
    "posicionamento_proposto": "string",
    "ajuste_setor": "string",
    "nota": "string"
  },
  "equidade_interna": {
    "analise": "string",
    "risco_distorcao": "baixo | medio | alto",
    "recomendacao_equidade": "string"
  },
  "riscos": [
    {"risco": "string", "nivel": "baixo | medio | alto", "descricao": "string", "mitigacao": "string"}
  ],
  "recomendacao": {
    "decisao": "string",
    "salario_recomendado": number,
    "justificativa": "string",
    "condicoes": "string",
    "urgencia": "imediata | pode aguardar | não recomendado agora"
  },
  "conclusao_estrategica": "string",
  "suposicoes_adotadas": ["string"]
}
```

---

## 4. Mapeamento de Variáveis do Formulário → Prompt

| Campo do Formulário | Variável no Prompt | Observação |
|---|---|---|
| Tipo de movimento | Define qual prompt usar | Enum: promocao / aumento / contratacao / ajuste |
| Cargo atual | `{cargo_atual}` | Texto livre |
| Cargo proposto | `{cargo_proposto}` | Igual ao atual em aumento/ajuste |
| Salário atual | `{salario_atual}` | Número, sem R$ |
| Salário proposto | `{salario_proposto}` | Número, sem R$ |
| Regime | `{regime}` | "CLT" ou "PJ" |
| Budget disponível | `{budget}` | Número; se não informado: "não informado" |
| Setor | `{setor}` | Select do formulário |
| Estado | `{estado}` | Select do formulário |
| Contexto adicional | `{contexto}` | Textarea livre |
| Há pares internos? | `{pares_existem}` | "Sim" ou "Não" |
| Salário médio dos pares | `{salario_pares}` | Número ou "não informado" |
| Histórico de avaliação | `{historico_avaliacao}` | Texto livre ou "não informado" |
| Política salarial | `{politica_salarial}` | Texto livre ou "não informado" |
| Nível de senioridade | `{nivel_senioridade}` | Júnior / Pleno / Sênior / Especialista |
| Tempo no cargo | `{tempo_cargo}` | Texto livre ou "não informado" |

---

## 5. Schema de Saída JSON — Completo

```typescript
interface ResultadoSimulacao {
  resumo_cenario: string;

  simulacao_financeira: {
    tabela: Array<{
      cenario: string;           // ex: "Salário atual", "Salário proposto", "Budget máximo"
      salario_mensal: number;    // valor em R$
      variacao_percentual: number; // ex: 14.3 (sem %)
      custo_anual_incremental: number; // diferença anual em R$ vs. atual
    }>;
    nota: string;
  };

  benchmark_mercado: {
    fonte: string;               // ex: "Robert Half 2026 + Portal Salario RJ"
    p25: number;
    p50: number;
    p75: number;
    p90: number;
    posicionamento_atual: string; // ex: "Abaixo do P25"
    posicionamento_proposto: string;
    ajuste_setor: string;        // ex: "Aplicado desconto de 20% para setor Educação"
    nota: string;
  };

  equidade_interna: {
    analise: string;
    risco_distorcao: 'baixo' | 'medio' | 'alto';
    recomendacao_equidade: string;
  };

  riscos: Array<{
    risco: string;               // ex: "Financeiro", "Equidade interna", "Retenção"
    nivel: 'baixo' | 'medio' | 'alto';
    descricao: string;
    mitigacao: string;
  }>;

  recomendacao: {
    decisao: string;             // 1 frase direta: "Aprovar promoção a R$ 16.000"
    salario_recomendado: number;
    justificativa: string;
    condicoes: string;           // ex: "Com carta de compromisso para R$17k em 12 meses"
    urgencia: 'imediata' | 'pode aguardar' | 'não recomendado agora';
  };

  conclusao_estrategica: string;

  suposicoes_adotadas: string[]; // Lista de premissas adotadas por falta de dados
}
```

---

## 6. Exemplos de Input e Output

### Exemplo 1 — Promoção (baseado no Caso #001)

**Input montado:**
```
TIPO DE MOVIMENTO: Promoção

DADOS DO CASO:
- Cargo atual: Coordenadora de RH
- Cargo proposto: Gerente de RH
- Salário atual: R$ 14.000 (PJ)
- Salário proposto: R$ 17.000 (PJ)
- Budget disponível: R$ 16.000 (informado: Sim)
- Setor: Educação
- Estado: RJ
- Histórico de avaliação: 1x "Supera" + 1x "Supera Muito"
- Política salarial da empresa: Requer 2 ciclos "Supera Muito" para promoção
- Contexto adicional: Empresa de grande porte, candidata tem excelentes resultados
- Pares internos: Não | Salário médio dos pares: não informado
```

**Output esperado (resumido):**
```json
{
  "resumo_cenario": "Movimento de promoção vertical de Coordenadora para Gerente de RH em empresa de grande porte do setor educacional, Rio de Janeiro, regime PJ. Dois pontos críticos: salário proposto (R$17k) excede o budget aprovado em R$1.000/mês; e a colaboradora não cumpre integralmente a política salarial vigente, que exige 2 ciclos 'Supera Muito', tendo acumulado apenas 1 'Supera' e 1 'Supera Muito'.",
  "simulacao_financeira": {
    "tabela": [
      {"cenario": "Salário atual", "salario_mensal": 14000, "variacao_percentual": 0, "custo_anual_incremental": 0},
      {"cenario": "Budget máximo aprovado", "salario_mensal": 16000, "variacao_percentual": 14.3, "custo_anual_incremental": 24000},
      {"cenario": "Pleito proposto", "salario_mensal": 17000, "variacao_percentual": 21.4, "custo_anual_incremental": 36000}
    ],
    "nota": "Regime PJ sem benefícios adicionais. Custo empresa = valor bruto PJ informado."
  },
  "benchmark_mercado": {
    "fonte": "Robert Half Guia Salarial 2026 + Portal Salario.com.br RJ",
    "p25": 13500,
    "p50": 15500,
    "p75": 17500,
    "p90": 20000,
    "posicionamento_atual": "Próximo ao P25 de mercado (R$13.500) — abaixo do P50",
    "posicionamento_proposto": "R$17.000 posicionado entre P50 e P75 — razoável para primeira promoção ao nível gerencial",
    "ajuste_setor": "Aplicado desconto de 20% sobre benchmark geral para setor Educação em RJ",
    "nota": "Mercer e Hay Group não disponibilizam dados públicos desagregados por setor/cargo. Recomenda-se aquisição de pesquisa setorial para decisões futuras de maior impacto."
  },
  "recomendacao": {
    "decisao": "Aprovar promoção a R$ 16.000 PJ imediatamente",
    "salario_recomendado": 16000,
    "justificativa": "Respeita o budget sem necessidade de exceção orçamentária. Aumento de +14,3% tecnicamente adequado para o movimento Coordenador→Gerente (mercado pratica 15% a 25%).",
    "condicoes": "Formalizar carta de comprometimento: atingindo 'Supera Muito' no próximo ciclo, o salário sobe para R$17.000 automaticamente. Registrar exceção de política em ata assinada pela liderança.",
    "urgencia": "imediata"
  },
  "conclusao_estrategica": "Decisão de baixo risco financeiro e alto retorno de retenção. O custo de reposição de um Gerente de RH (recrutamento + curva de aprendizado + impacto operacional) supera facilmente R$50.000 — quatro vezes o valor do excesso de budget anual questionado. Execute a promoção a R$16.000. Documente o caminho para R$17.000. Não perca o talento por R$1.000."
}
```

---

## 7. Validação do Output da IA

### Regras de Validação (implementar no código)

```javascript
function validarOutputIA(resultado) {
  const camposObrigatorios = [
    'resumo_cenario',
    'simulacao_financeira',
    'benchmark_mercado',
    'equidade_interna',
    'riscos',
    'recomendacao',
    'conclusao_estrategica'
  ];

  // 1. Verificar campos obrigatórios
  for (const campo of camposObrigatorios) {
    if (!resultado[campo]) {
      throw new Error(`Campo obrigatório ausente: ${campo}`);
    }
  }

  // 2. Verificar se recomendacao.salario_recomendado é número válido
  if (typeof resultado.recomendacao.salario_recomendado !== 'number' ||
      resultado.recomendacao.salario_recomendado <= 0) {
    throw new Error('Salário recomendado inválido');
  }

  // 3. Verificar se riscos tem pelo menos 1 item
  if (!Array.isArray(resultado.riscos) || resultado.riscos.length === 0) {
    throw new Error('Nenhum risco identificado — output suspeito');
  }

  // 4. Verificar nível de risco válido
  const niveisValidos = ['baixo', 'medio', 'alto'];
  for (const risco of resultado.riscos) {
    if (!niveisValidos.includes(risco.nivel)) {
      throw new Error(`Nível de risco inválido: ${risco.nivel}`);
    }
  }

  return true;
}
```

### O Que Fazer Se o JSON Vier Inválido

1. **JSON mal formatado:** tentar `JSON.parse()` com try/catch → se falhar, reenviar o prompt com instrução adicional: "ATENÇÃO: retorne APENAS JSON válido, sem nenhum texto fora do objeto JSON"
2. **Campo ausente:** logar o erro, exibir mensagem amigável ao usuário: "Nossa IA teve dificuldade com este caso. Tente adicionar mais contexto e simule novamente."
3. **Número inválido:** substituir por 0 e marcar como "dado indisponível" no relatório
4. **Timeout Gemini (>30s):** exibir: "A análise está demorando mais que o esperado. Aguarde mais alguns segundos..."

---

## 8. Critérios de Definição de Nível de Risco

| Risco | Alto | Médio | Baixo |
|---|---|---|---|
| Financeiro | Excede budget em >20% ou >R$25k/ano | Excede budget em 5-20% | Dentro do budget |
| Equidade interna | Cria distorção com pares existentes | Risco potencial se pares existirem | Sem pares ou pares com salário superior |
| Retenção | Profissional sinalizou saída ou está abaixo do P25 | Abaixo do P50, sem sinalização clara | Salário competitivo, colaborador engajado |
| Mercado | Acima do P90 sem justificativa clara | Entre P75 e P90 | Entre P25 e P75 |
| Precedente de política | Viola política sem processo formal de exceção | Viola parcialmente com mitigação possível | Alinhado à política |

---

## 9. Estratégia de Benchmark Embutida no Prompt

O Gemini é instruído a estimar benchmarks com base em:

1. **Robert Half Guia Salarial 2026** — referência principal para cargos gerenciais e especializados
2. **Portal Salario.com.br** — dados por estado e nível de experiência (público, atualizado)
3. **CAGED/MTE** — dados de admissões e demissões por CBO (base pública)
4. **Ajuste por setor** (aplicado sobre benchmark geral):
   - Tecnologia: +15% a +25%
   - Saúde: mercado (0%)
   - Serviços financeiros: +10% a +15%
   - Varejo: -10% a -15%
   - Educação: -15% a -25%
   - Indústria: -5% a -10%
   - Serviços gerais: -5% a 0%
5. **Ajuste CLT → PJ:** multiplicar por 1,30 a 1,40x (padrão: 1,35x)
6. **Ajuste regional** (sobre benchmark SP): 
   - SP: base (100%)
   - RJ: -5% a -10%
   - MG: -10% a -15%
   - Sul (RS/SC/PR): -5% a -10%
   - Nordeste: -15% a -25%
   - Centro-Oeste: -5% a -10%

---

## 10. Histórico de Versões do Prompt

| Versão | Data | Alteração | Motivo |
|---|---|---|---|
| 1.0 | 04/04/2026 | Versão inicial | Lançamento do produto |

---

## 11. Guia para Evoluir o Prompt

Quando evoluir o prompt com novos casos:

1. **Documentar o caso** que motivou a mudança (qual output estava errado e por quê)
2. **Testar a mudança** com os casos anteriores para não regredir
3. **Incrementar a versão** no cabeçalho deste documento
4. **Registrar no histórico** de versões acima
5. **Atualizar a variável** `PROMPT_VERSION` no código para rastrear qual versão gerou cada simulação

**Campos recomendados para adicionar em versões futuras:**
- Análise de gap salarial por gênero/raça (quando usuário informar)
- Impacto em benefícios (PLR, bônus, stock options) proporcional ao aumento
- Sugestão de comunicação ao colaborador
- Alternativas além do aumento (promoção simbólica, benefícios, horário flexível)
