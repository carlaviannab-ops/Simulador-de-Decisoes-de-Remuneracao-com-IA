import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

type TipoMovimento = "promocao" | "aumento" | "contratacao" | "ajuste_faixa" | "contraproposta"

interface BodySimulacao {
  tipo: TipoMovimento
  cargo_atual: string
  cargo_proposto?: string
  salario_atual: number
  salario_proposto: number
  regime: "clt" | "pj"
  setor: string
  estado: string
  contexto_adicional?: string
  budget_informado?: boolean
  budget_valor?: number
  pares_existem?: boolean
  salario_medio_pares?: number
  historico_avaliacao?: string
  politica_salarial?: string
  nivel_senioridade?: string
  tempo_cargo?: string
  ultimo_reajuste?: string
  percentual_ultimo_reajuste?: number
  criticidade_cargo?: string
  _lote_id?: string
}

const limitesPorPlano: Record<string, number> = {
  trial: 3,
  starter: 20,
  professional: Infinity,
  enterprise: Infinity,
}

function verificarLimite(profile: { plano: string; simulacoes_usadas_mes: number; trial_expira_em: string }): boolean {
  if (profile.plano === "trial" && new Date(profile.trial_expira_em) < new Date()) return false
  const limite = limitesPorPlano[profile.plano] ?? 0
  return profile.simulacoes_usadas_mes < limite
}

const SYSTEM_PROMPT = `Voce e um consultor senior especializado em remuneracao estrategica com 15 anos de experiencia em empresas brasileiras de medio e grande porte. Sua especialidade e analise de estruturas salariais, benchmarks de mercado e tomada de decisao organizacional.

MISSAO: Analisar o caso de remuneracao apresentado e entregar uma recomendacao clara, objetiva e aplicavel.

REGRAS CRITICAS (nao negociaveis):
1. NUNCA responda de forma generica. Cada analise deve ser especifica ao caso.
2. SEMPRE entregue uma recomendacao clara.
3. SEMPRE inclua impacto financeiro com numeros reais (R$).
4. SEMPRE posicione o salario em relacao ao mercado (P25/P50/P75).
5. Se faltar informacao, crie cenarios plausiveis e declare explicitamente.
6. Use benchmarks de: Robert Half Guia Salarial 2026, Portal Salario.com.br, CAGED/MTE.
7. Considere o fator de conversao CLT->PJ de 1,30 a 1,40x.
8. Ajuste benchmarks por setor: Educacao (-15% a -25%), Tecnologia (+15% a +25%), Saude (mercado), Varejo (-10% a -15%), Servicos (mercado).
9. Para regime CLT: em cada linha da simulacao_financeira.tabela, calcule custo_total_empregador_anual = salario_mensal x 12 x 1.70 (encargos patronais: FGTS 8%, INSS ~20%, 13o salario, ferias+1/3, provisoes). Este numero representa o custo real para a empresa e e fundamental para a decisao do CFO. Para PJ nao ha encargos adicionais significativos.
10. O campo 'condicoes' da recomendacao DEVE ser especifico ao caso: mencione numeros concretos (salario dos pares, gap percentual exato vs. P50, prazos especificos, valores em R$). PROIBIDO texto generico como 'deve ser acompanhada de plano de desenvolvimento' sem numeros concretos que fundamentem a condicao.

FORMATO DE SAIDA: Retorne APENAS um JSON valido, sem markdown, sem texto fora do JSON, seguindo exatamente o schema especificado.`

const JSON_SCHEMA = `{
  "resumo_cenario": "string",
  "simulacao_financeira": {
    "tabela": [
      {"cenario": "string", "salario_mensal": number, "variacao_percentual": number, "custo_anual_incremental": number, "custo_total_empregador_anual": number}
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
    "urgencia": "imediata | pode aguardar | nao recomendado agora"
  },
  "conclusao_estrategica": "string",
  "suposicoes_adotadas": ["string"],
  "comunicacao_colaborador": {
    "tom": "string",
    "texto": "string",
    "pontos_chave": ["string"]
  }
}`

function montarPrompt(body: BodySimulacao): string {
  const regime = body.regime.toUpperCase()
  const budget = body.budget_informado && body.budget_valor
    ? `R$ ${body.budget_valor} (informado: Sim)`
    : "nao informado"
  const pares = body.pares_existem ? "Sim" : "Nao"
  const salarioPares = body.pares_existem && body.salario_medio_pares
    ? `R$ ${body.salario_medio_pares}`
    : "nao informado"
  const avaliacao = body.historico_avaliacao || "nao informado"
  const politica = body.politica_salarial || "nao informado"
  const contexto = body.contexto_adicional || "nao informado"
  const senioridade = body.nivel_senioridade || "nao informado"
  const tempoCargo = body.tempo_cargo || "nao informado"
  const ultimoReajuste = body.ultimo_reajuste || "nao informado"
  const percentualUltimoReajuste = body.percentual_ultimo_reajuste
    ? `${body.percentual_ultimo_reajuste}%`
    : "nao informado"
  const criticidade = body.criticidade_cargo || "nao informado"

  switch (body.tipo) {
    case "promocao":
      return `TIPO DE MOVIMENTO: Promocao\n\nDADOS DO CASO:\n- Cargo atual: ${body.cargo_atual}\n- Cargo proposto: ${body.cargo_proposto || body.cargo_atual}\n- Salario atual: R$ ${body.salario_atual} (${regime})\n- Salario proposto: R$ ${body.salario_proposto} (${regime})\n- Budget disponivel: ${budget}\n- Setor: ${body.setor}\n- Estado: ${body.estado}\n- Historico de avaliacao: ${avaliacao}\n- Politica salarial da empresa: ${politica}\n- Criticidade do cargo proposto: ${criticidade}\n- Contexto adicional: ${contexto}\n- Ha outros colaboradores no mesmo cargo: ${pares} | Salario medio dos pares: ${salarioPares}\n\nINSTRUCAO: Em recomendacao.condicoes, mencione numeros concretos do caso (gap vs. P50 do cargo proposto, salario dos pares se informado, criterios de entrega com prazos especificos). PROIBIDO texto generico sem valores em R$ ou % concretos.\n\nAnalise este caso de promocao seguindo as regras e retorne o JSON com o schema abaixo:\n${JSON_SCHEMA}`

    case "aumento":
      return `TIPO DE MOVIMENTO: Aumento Salarial (mesmo cargo)\n\nDADOS DO CASO:\n- Cargo: ${body.cargo_atual}\n- Salario atual: R$ ${body.salario_atual} (${regime})\n- Salario proposto: R$ ${body.salario_proposto} (${regime})\n- Variacao proposta: ${(((body.salario_proposto - body.salario_atual) / body.salario_atual) * 100).toFixed(1)}%\n- Budget disponivel: ${budget}\n- Setor: ${body.setor}\n- Estado: ${body.estado}\n- Nivel de senioridade: ${senioridade}\n- Tempo no cargo: ${tempoCargo}\n- Ultimo reajuste: ${ultimoReajuste}\n- Percentual do ultimo reajuste: ${percentualUltimoReajuste}\n- Historico de avaliacao: ${avaliacao}\n- Criticidade do cargo: ${criticidade}\n- Contexto adicional: ${contexto}\n- Pares internos: ${pares} | Salario medio dos pares: ${salarioPares}\n\nINSTRUCAO ESPECIAL — ANALISE DE DEFASAGEM DE MERCADO:\nApos calcular o benchmark:\n1. Se salario_atual < P50: calcule o gap de defasagem e mencione no resumo_cenario (ex: "colaborador esta X% abaixo da mediana de mercado").\n2. Se a variacao proposta nao eleva o salario ao menos 50% em direcao ao P50: em recomendacao.condicoes, indique que o aumento nao resolve a defasagem e informe o valor minimo para atingir o P50.\n3. Na simulacao_financeira, inclua SEMPRE estes 3 cenarios:\n   a) "Nao aprovar aumento" — manter salario atual com riscos de retencao\n   b) "Ajuste ao P50" — valor exato da mediana de mercado para este cargo/setor/estado\n   c) "Aumento proposto (R$ ${body.salario_proposto})" — o valor solicitado\n4. Na recomendacao, seja explicito se o aumento proposto e suficiente, insuficiente ou excessivo em relacao ao mercado.\n5. Em recomendacao.condicoes: seja ESPECIFICO ao caso. Se ha dados de pares (${salarioPares}), mencione o gap em R$ e %. Se ha defasagem vs. P50, mencione o valor exato. Se ha historico de avaliacao (${avaliacao}), vincule a condicao ao desempenho com criterio mensuravel. PROIBIDO texto generico sem numeros concretos.\n\nAnalise este caso de aumento salarial seguindo as regras e retorne o JSON com o schema abaixo:\n${JSON_SCHEMA}`

    case "contratacao":
      return `TIPO DE MOVIMENTO: Nova Contratacao\n\nDADOS DO CASO:\n- Cargo a contratar: ${body.cargo_proposto || body.cargo_atual}\n- Salario pretendido pelo candidato: R$ ${body.salario_proposto} (${regime})\n- Faixa de budget para contratacao: R$ ${body.salario_atual} a ${budget} (${regime})\n- Setor: ${body.setor}\n- Estado: ${body.estado}\n- Nivel de senioridade: ${senioridade}\n- Criticidade do cargo: ${criticidade}\n- Contexto adicional: ${contexto}\n- Pares internos no mesmo cargo: ${pares} | Salario medio dos pares: ${salarioPares}\n\nINSTRUCAO: Em recomendacao.condicoes, mencione numeros concretos (gap vs. P50, salario dos pares, valor maximo justificado de budget, criterios de avaliacao no periodo de experiencia). PROIBIDO texto generico sem valores em R$ ou %.\n\nAnalise esta decisao de contratacao seguindo as regras e retorne o JSON com o schema abaixo:\n${JSON_SCHEMA}`

    case "ajuste_faixa":
      return `TIPO DE MOVIMENTO: Ajuste de Faixa Salarial\n\nDADOS DO CASO:\n- Cargo: ${body.cargo_atual}\n- Salario atual: R$ ${body.salario_atual} (${regime})\n- Posicionamento solicitado: R$ ${body.salario_proposto} (${regime})\n- Variacao solicitada: ${(((body.salario_proposto - body.salario_atual) / body.salario_atual) * 100).toFixed(1)}%\n- Setor: ${body.setor}\n- Estado: ${body.estado}\n- Nivel de senioridade: ${senioridade}\n- Ultimo reajuste: ${ultimoReajuste}\n- Percentual do ultimo reajuste: ${percentualUltimoReajuste}\n- Criticidade do cargo: ${criticidade}\n- Pares internos: ${pares} | Salario medio dos pares: ${salarioPares}\n- Contexto adicional: ${contexto}\n\nINSTRUCAO ESPECIAL — AJUSTE DE FAIXA COM CENARIOS OBRIGATORIOS:\n1. Na simulacao_financeira, inclua EXATAMENTE 3 cenarios:\n   a) "Ajuste ao P50" — valor exato da mediana de mercado\n   b) "Ajuste ao P75" — valor exato do terceiro quartil\n   c) "Posicionamento solicitado (R$ ${body.salario_proposto})" — o valor pedido\n2. Se o valor solicitado > P75: na recomendacao, indique o valor recomendado como o P75 e explique o que justificaria aprovacao ate P90 (ex: escassez do perfil, risco de perda iminente).\n3. PROIBIDO recomendar somente "aguardar" sem valor alternativo. Se recomendar aguardar, DEVE especificar o valor de ajuste parcial imediato (minimo ao P50, se o salario atual estiver abaixo).\n4. Se salario_atual < P25: urgencia = "imediata". Mencione no resumo_cenario o risco de retencao elevado.\n5. Em equidade_interna, compare o salario atual e o proposto com o salario medio dos pares e identifique se o ajuste cria ou resolve distorcoes.\n6. Em recomendacao.condicoes: mencione numeros concretos (gap exato em R$ e % vs. P50, salario dos pares se informado, prazo maximo para o ajuste nao impactar retencao). PROIBIDO texto generico sem valores concretos.\n\nAnalise este ajuste de faixa seguindo as regras e retorne o JSON com o schema abaixo:\n${JSON_SCHEMA}`

    case "contraproposta": {
      const gapAbsoluto = body.salario_proposto - body.salario_atual
      const gapPercent = (((body.salario_proposto - body.salario_atual) / body.salario_atual) * 100).toFixed(1)
      const parcial = Math.round(body.salario_atual + gapAbsoluto * 0.6)
      return `TIPO DE MOVIMENTO: Contraproposta (colaborador recebeu oferta da concorrencia)\n\nDADOS DO CASO:\n- Cargo do colaborador: ${body.cargo_atual}\n- Salario atual: R$ ${body.salario_atual} (${regime})\n- Oferta da concorrencia: R$ ${body.salario_proposto} (${regime})\n- Gap da oferta vs. salario atual: R$ ${gapAbsoluto} (${gapPercent}% acima)\n- Budget disponivel para contraproposta: ${budget}\n- Setor: ${body.setor}\n- Estado: ${body.estado}\n- Nivel de senioridade: ${senioridade}\n- Tempo no cargo: ${tempoCargo}\n- Historico de avaliacao: ${avaliacao}\n- Criticidade do cargo: ${criticidade}\n- Pares internos: ${pares} | Salario medio dos pares: ${salarioPares}\n- Contexto adicional: ${contexto}\n\nINSTRUCAO ESPECIAL — CONTRAPROPOSTA COM CUSTO REAL DE REPOSICAO:\nEsta e situacao de ALTA URGENCIA. Use as instrucoes abaixo rigorosamente:\n\n1. Na simulacao_financeira, inclua EXATAMENTE estes 3 cenarios:\n\n   a) "Nao fazer contraproposta (custo de reposicao)"\n      - salario_mensal = 0\n      - variacao_percentual = 0\n      - custo_anual_incremental = CUSTO TOTAL DE REPOSICAO calculado assim:\n        * Recrutamento e selecao: 1 a 2 meses do salario atual (fee de headhunter ou tempo interno)\n        * Onboarding e curva de aprendizado: 3 a 5 meses com produtividade reduzida (~30% do salario)\n        * Perda de produtividade durante a vaga aberta: 1 a 2 meses de salario\n        * Total estimado = 5 a 9 x salario mensal atual\n        * Para criticidade ALTA: multiplique por 1,5 (perfil escasso = busca mais longa e cara)\n        * NUNCA coloque 0 neste campo. O valor MINIMO e 5 x R$ ${body.salario_atual} = R$ ${body.salario_atual * 5}\n      - No campo 'cenario': descreva o custo como "Custo de reposicao estimado: R$ [valor calculado]"\n\n   b) "Contraproposta parcial (match ~60% do gap) — R$ ${parcial}"\n      - salario_mensal = R$ ${parcial} (salario atual + 60% do gap de R$ ${gapAbsoluto})\n      - custo_anual_incremental = delta anual vs. salario atual\n\n   c) "Match total da oferta — R$ ${body.salario_proposto}"\n      - salario_mensal = R$ ${body.salario_proposto}\n      - custo_anual_incremental = delta anual vs. salario atual\n\n2. Para criticidade ALTA: riscos devem incluir obrigatoriamente risco estrategico de perda de conhecimento critico.\n   Para criticidade BAIXA: mencionar que reposicao e mais viavel e o custo de reposicao e menor.\n\n3. Em recomendacao.condicoes: seja ESPECIFICO. Mencione: valor exato da contraproposta recomendada, prazo para resposta, condicoes vinculantes (ex: plano de carreira, cargo especifico em X meses), comparacao com salario dos pares se informado. NAO use frases genericas sem numeros.\n\nAnalise este caso de contraproposta seguindo as regras e retorne o JSON com o schema abaixo:\n${JSON_SCHEMA}`
    }
  }
}

function normalizarNivel(nivel: string): "baixo" | "medio" | "alto" {
  const n = nivel.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
  if (n === "baixo" || n === "low" || n === "minor") return "baixo"
  if (n === "alto" || n === "high" || n === "critical" || n === "critico") return "alto"
  return "medio"
}

function extrairJSON(text: string, fonte: string): unknown {
  const cleaned = text.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim()
  try {
    return JSON.parse(cleaned)
  } catch (_e) {
    const match = cleaned.match(/\{[\s\S]+\}/)
    if (match) {
      try { return JSON.parse(match[0]) } catch (_e2) { /* continua */ }
    }
    throw new Error(`JSON invalido do modelo (${fonte})`)
  }
}

const GEMINI_MODELS = ["gemini-2.0-flash-lite", "gemini-2.0-flash"]
const GROQ_MODELS = ["llama-3.3-70b-versatile", "llama-3.1-8b-instant"]
const OPENROUTER_MODELS = [
  "google/gemma-2-9b-it:free",
  "mistralai/mistral-7b-instruct:free",
  "meta-llama/llama-3.1-8b-instruct:free",
]

async function chamarOpenAICompat(
  url: string,
  headers: Record<string, string>,
  model: string,
  userPrompt: string,
): Promise<{ ok: boolean; text?: string; status?: number; err?: string }> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.2,
      max_tokens: 8192,
    }),
  })
  if (!res.ok) {
    const err = await res.text()
    return { ok: false, status: res.status, err: err.substring(0, 200) }
  }
  const data = await res.json()
  const text = data.choices?.[0]?.message?.content as string | undefined
  return { ok: true, text }
}

async function chamarOpenAICompatSimples(
  url: string,
  headers: Record<string, string>,
  model: string,
  prompt: string,
): Promise<{ ok: boolean; text?: string; status?: number; err?: string }> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.1,
      max_tokens: 512,
    }),
  })
  if (!res.ok) {
    const err = await res.text()
    return { ok: false, status: res.status, err: err.substring(0, 200) }
  }
  const data = await res.json()
  const text = data.choices?.[0]?.message?.content as string | undefined
  return { ok: true, text }
}

async function chamarIA(userPrompt: string): Promise<unknown> {
  const geminiKey = Deno.env.get("GEMINI_API_KEY")
  const groqKey = Deno.env.get("GROQ_API_KEY")
  const openrouterKey = Deno.env.get("OPENROUTER_API_KEY")

  if (!geminiKey && !groqKey && !openrouterKey) throw new Error("Nenhuma API key de IA configurada")

  if (geminiKey) {
    const payload = {
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      generationConfig: { temperature: 0.2, maxOutputTokens: 8192, responseMimeType: "application/json" },
    }
    for (const model of GEMINI_MODELS) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`
        const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
        if (!res.ok) {
          console.error(`Gemini ${model} ${res.status}:`, (await res.text()).substring(0, 200))
          continue
        }
        const data = await res.json()
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text as string | undefined
        if (!text) { console.error(`Gemini ${model} resposta vazia`); continue }
        return extrairJSON(text, model)
      } catch (e) { console.error(`Gemini ${model} exception:`, (e as Error).message); continue }
    }
  }

  if (groqKey) {
    for (const model of GROQ_MODELS) {
      try {
        const result = await chamarOpenAICompat(
          "https://api.groq.com/openai/v1/chat/completions",
          { "Authorization": `Bearer ${groqKey}` },
          model,
          userPrompt,
        )
        if (!result.ok) { console.error(`Groq ${model} ${result.status}:`, result.err); continue }
        if (!result.text) { console.error(`Groq ${model} resposta vazia`); continue }
        return extrairJSON(result.text, model)
      } catch (e) { console.error(`Groq ${model} exception:`, (e as Error).message); continue }
    }
  }

  if (openrouterKey) {
    for (const model of OPENROUTER_MODELS) {
      try {
        const result = await chamarOpenAICompat(
          "https://openrouter.ai/api/v1/chat/completions",
          {
            "Authorization": `Bearer ${openrouterKey}`,
            "HTTP-Referer": "https://remunaia.com.br",
            "X-Title": "RemunaIA",
          },
          model,
          userPrompt,
        )
        if (!result.ok) { console.error(`OpenRouter ${model} ${result.status}:`, result.err); continue }
        if (!result.text) { console.error(`OpenRouter ${model} resposta vazia`); continue }
        return extrairJSON(result.text, model)
      } catch (e) { console.error(`OpenRouter ${model} exception:`, (e as Error).message); continue }
    }
  }

  throw new Error("Todos os modelos de IA falharam")
}

async function chamarIASimples(prompt: string): Promise<unknown> {
  const geminiKey = Deno.env.get("GEMINI_API_KEY")
  const groqKey = Deno.env.get("GROQ_API_KEY")
  const openrouterKey = Deno.env.get("OPENROUTER_API_KEY")

  if (geminiKey) {
    for (const model of GEMINI_MODELS) {
      try {
        const payload = {
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.1, maxOutputTokens: 512, responseMimeType: "application/json" },
        }
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`
        const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
        if (!res.ok) { console.error(`Gemini simples ${model} ${res.status}`); continue }
        const data = await res.json()
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text as string | undefined
        if (!text) { continue }
        return extrairJSON(text, model)
      } catch (e) { console.error(`Gemini simples ${model} exception:`, (e as Error).message); continue }
    }
  }

  if (groqKey) {
    for (const model of GROQ_MODELS) {
      try {
        const result = await chamarOpenAICompatSimples(
          "https://api.groq.com/openai/v1/chat/completions",
          { "Authorization": `Bearer ${groqKey}` },
          model,
          prompt,
        )
        if (!result.ok || !result.text) { continue }
        return extrairJSON(result.text, model)
      } catch (e) { console.error(`Groq simples ${model} exception:`, (e as Error).message); continue }
    }
  }

  if (openrouterKey) {
    for (const model of OPENROUTER_MODELS) {
      try {
        const result = await chamarOpenAICompatSimples(
          "https://openrouter.ai/api/v1/chat/completions",
          {
            "Authorization": `Bearer ${openrouterKey}`,
            "HTTP-Referer": "https://remunaia.com.br",
            "X-Title": "RemunaIA",
          },
          model,
          prompt,
        )
        if (!result.ok || !result.text) { continue }
        return extrairJSON(result.text, model)
      } catch (e) { console.error(`OpenRouter simples ${model} exception:`, (e as Error).message); continue }
    }
  }

  throw new Error("Todos os modelos de IA falharam")
}

function normalizarEValidar(resultado: Record<string, unknown>): void {
  // Coerce salario_recomendado to number if string
  const rec = resultado.recomendacao as Record<string, unknown> | undefined
  if (rec) {
    if (typeof rec.salario_recomendado === "string") {
      const parsed = parseFloat((rec.salario_recomendado as string).replace(/[^\d.,]/g, "").replace(",", "."))
      rec.salario_recomendado = isNaN(parsed) ? 0 : parsed
    }
  }
  // Normalize risk levels
  const riscos = resultado.riscos as Array<Record<string, unknown>> | undefined
  if (Array.isArray(riscos)) {
    for (const risco of riscos) {
      if (typeof risco.nivel === "string") risco.nivel = normalizarNivel(risco.nivel)
      else risco.nivel = "medio"
    }
  }
  // Normalize equidade interna
  const eq = resultado.equidade_interna as Record<string, unknown> | undefined
  if (eq && typeof eq.risco_distorcao === "string") eq.risco_distorcao = normalizarNivel(eq.risco_distorcao)
  // Only hard-fail if there's truly nothing to show
  if (!resultado.resumo_cenario && !resultado.recomendacao) throw new Error("Resposta da IA sem conteudo utilizavel")
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders })

  try {
    const authHeader = req.headers.get("Authorization")
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "nao autorizado" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } })
    }

    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!)

    const jwt = authHeader.replace("Bearer ", "")
    const { data: { user }, error: authError } = await supabase.auth.getUser(jwt)
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "token invalido" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } })
    }

    const rawBody = await req.json()

    // MODO BENCHMARK — retorna apenas dados de mercado sem salvar simulacao
    if ((rawBody as { _benchmark_only?: boolean })._benchmark_only) {
      const { cargo, nivel_senioridade, setor, estado, regime } = rawBody as {
        cargo: string; nivel_senioridade?: string; setor: string; estado: string; regime?: string
      }
      const prompt = `Voce e um especialista em remuneracao no Brasil com 15 anos de experiencia.
Forneca benchmarks salariais de mercado para o cargo abaixo. Retorne APENAS o JSON especificado.

Cargo: ${cargo}
Nivel de senioridade: ${nivel_senioridade || "nao informado"}
Setor: ${setor}
Estado: ${estado}
Regime: ${(regime || "clt").toUpperCase()}

Use como referencia: Robert Half Guia Salarial 2026, Portal Salario.com.br, CAGED/MTE.
Para PJ: aplique fator 1,30x a 1,40x sobre o equivalente CLT.
Ajuste por setor: Educacao (-15% a -25%), Tecnologia (+15% a +25%), Saude (mercado), Varejo (-10% a -15%), Servicos (mercado).

Retorne EXATAMENTE este JSON sem markdown, sem texto adicional:
{"p25": number, "p50": number, "p75": number, "p90": number, "nota": "string"}`

      try {
        const resultado = await chamarIASimples(prompt) as Record<string, unknown>
        return new Response(JSON.stringify(resultado), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } })
      } catch (err) {
        return new Response(JSON.stringify({ error: "benchmark_error", message: (err as Error).message }), { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } })
      }
    }

    // MODO SIMULACAO NORMAL
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("plano, simulacoes_usadas_mes, trial_expira_em")
      .eq("id", user.id)
      .single()

    if (profileError || !profile) {
      return new Response(JSON.stringify({ error: "perfil nao encontrado" }), { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } })
    }

    if (!verificarLimite(profile)) {
      return new Response(JSON.stringify({ error: "limite_atingido" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } })
    }

    const body: BodySimulacao = rawBody
    if (!body.tipo || !body.cargo_atual || !body.salario_atual || !body.salario_proposto) {
      return new Response(JSON.stringify({ error: "dados obrigatorios ausentes" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } })
    }

    const { data: simulacao, error: insertError } = await supabase
      .from("simulacoes")
      .insert({
        user_id: user.id,
        tipo: body.tipo,
        cargo_atual: body.cargo_atual,
        cargo_proposto: body.cargo_proposto,
        salario_atual: body.salario_atual,
        salario_proposto: body.salario_proposto,
        regime: body.regime,
        setor: body.setor,
        estado: body.estado,
        status: "processando",
        lote_id: body._lote_id || null,
      })
      .select()
      .single()

    if (insertError || !simulacao) throw new Error("Erro ao criar simulacao no banco")

    const userPrompt = montarPrompt(body)
    let resultado: Record<string, unknown>

    try {
      resultado = (await chamarIA(userPrompt)) as Record<string, unknown>
      normalizarEValidar(resultado)
    } catch (iaError) {
      const errMsg = (iaError as Error).message
      console.error("Erro IA:", errMsg)
      await supabase.from("simulacoes").update({ status: "erro", resultado: { _debug: errMsg } }).eq("id", simulacao.id)
      return new Response(JSON.stringify({ error: "ia_error", message: errMsg }), { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } })
    }

    await supabase.from("simulacoes").update({ resultado, status: "concluido", concluido_em: new Date().toISOString() }).eq("id", simulacao.id)
    await supabase.from("profiles").update({ simulacoes_usadas_mes: profile.simulacoes_usadas_mes + 1 }).eq("id", user.id)

    return new Response(JSON.stringify({ simulacao_id: simulacao.id, resultado }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } })
  } catch (err) {
    console.error("Erro inesperado:", err)
    return new Response(JSON.stringify({ error: "erro_interno", message: (err as Error).message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } })
  }
})
