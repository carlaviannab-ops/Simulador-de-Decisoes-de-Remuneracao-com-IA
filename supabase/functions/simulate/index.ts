import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

// ─────────────────────────────────────────────
// Tipos
// ─────────────────────────────────────────────
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
}

// ─────────────────────────────────────────────
// Limites de simulação por plano
// ─────────────────────────────────────────────
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

// ─────────────────────────────────────────────
// Montagem dos prompts
// ─────────────────────────────────────────────
const SYSTEM_PROMPT = `Você é um consultor sênior especializado em remuneração estratégica com 15 anos de experiência em empresas brasileiras de médio e grande porte. Sua especialidade é análise de estruturas salariais, benchmarks de mercado e tomada de decisão organizacional.

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

FORMATO DE SAÍDA: Retorne APENAS um JSON válido, sem markdown, sem texto fora do JSON, seguindo exatamente o schema especificado. Não inclua \`\`\`json nem \`\`\`.`

const JSON_SCHEMA = `{
  "resumo_cenario": "string — 3 a 5 frases descrevendo o caso e os pontos críticos",
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
    "decisao": "string — ação recomendada em 1 frase direta",
    "salario_recomendado": number,
    "justificativa": "string",
    "condicoes": "string",
    "urgencia": "imediata | pode aguardar | não recomendado agora"
  },
  "conclusao_estrategica": "string — 3 a 5 frases sobre impacto estratégico e custo de não agir",
  "suposicoes_adotadas": ["string"],
  "comunicacao_colaborador": {
    "tom": "string — tom recomendado: ex: 'empático e direto', 'formal e positivo', 'honesto e construtivo'",
    "texto": "string — texto completo da conversa ou comunicado ao colaborador, em primeira pessoa do gestor/RH, pronto para usar",
    "pontos_chave": ["string — lista com 3 a 5 pontos que devem ser mencionados na conversa"]
  }
}`

function montarPrompt(body: BodySimulacao): string {
  const regime = body.regime.toUpperCase()
  const budget = body.budget_informado && body.budget_valor
    ? `R$ ${body.budget_valor} (informado: Sim)`
    : "não informado"
  const pares = body.pares_existem ? "Sim" : "Não"
  const salarioPares = body.pares_existem && body.salario_medio_pares
    ? `R$ ${body.salario_medio_pares}`
    : "não informado"
  const avaliacao = body.historico_avaliacao || "não informado"
  const politica = body.politica_salarial || "não informado"
  const contexto = body.contexto_adicional || "não informado"
  const senioridade = body.nivel_senioridade || "não informado"
  const tempoCargo = body.tempo_cargo || "não informado"

  switch (body.tipo) {
    case "promocao":
      return `TIPO DE MOVIMENTO: Promoção

DADOS DO CASO:
- Cargo atual: ${body.cargo_atual}
- Cargo proposto: ${body.cargo_proposto || body.cargo_atual}
- Salário atual: R$ ${body.salario_atual} (${regime})
- Salário proposto: R$ ${body.salario_proposto} (${regime})
- Budget disponível: ${budget}
- Setor: ${body.setor}
- Estado: ${body.estado}
- Histórico de avaliação: ${avaliacao}
- Política salarial da empresa: ${politica}
- Contexto adicional: ${contexto}
- Há outros colaboradores no mesmo cargo: ${pares} | Salário médio dos pares: ${salarioPares}

Analise este caso de promoção seguindo as regras e retorne o JSON com o schema abaixo:
${JSON_SCHEMA}`

    case "aumento":
      return `TIPO DE MOVIMENTO: Aumento Salarial (mesmo cargo)

DADOS DO CASO:
- Cargo: ${body.cargo_atual}
- Salário atual: R$ ${body.salario_atual} (${regime})
- Salário proposto: R$ ${body.salario_proposto} (${regime})
- Budget disponível: ${budget}
- Setor: ${body.setor}
- Estado: ${body.estado}
- Nível de senioridade: ${senioridade}
- Tempo no cargo: ${tempoCargo}
- Histórico de avaliação: ${avaliacao}
- Contexto adicional: ${contexto}
- Pares internos: ${pares} | Salário médio dos pares: ${salarioPares}

Analise este caso de aumento salarial seguindo as regras e retorne o JSON com o schema abaixo:
${JSON_SCHEMA}`

    case "contratacao":
      return `TIPO DE MOVIMENTO: Nova Contratação

DADOS DO CASO:
- Cargo a contratar: ${body.cargo_proposto || body.cargo_atual}
- Salário pretendido pelo candidato: R$ ${body.salario_proposto} (${regime})
- Faixa de budget para contratação: R$ ${body.salario_atual} a ${budget} (${regime})
- Setor: ${body.setor}
- Estado: ${body.estado}
- Nível de senioridade: ${senioridade}
- Contexto adicional: ${contexto}
- Pares internos no mesmo cargo: ${pares} | Salário médio dos pares: ${salarioPares}

Analise esta decisão de contratação seguindo as regras e retorne o JSON com o schema abaixo:
${JSON_SCHEMA}`

    case "ajuste_faixa":
      return `TIPO DE MOVIMENTO: Ajuste de Faixa Salarial

DADOS DO CASO:
- Cargo: ${body.cargo_atual}
- Salário atual: R$ ${body.salario_atual} (${regime})
- Novo posicionamento desejado: R$ ${body.salario_proposto} (${regime})
- Setor: ${body.setor}
- Estado: ${body.estado}
- Pares internos: ${pares} | Salário médio dos pares: ${salarioPares}
- Contexto adicional: ${contexto}

Analise este ajuste de faixa seguindo as regras e retorne o JSON com o schema abaixo:
${JSON_SCHEMA}`

    case "contraproposta":
      return `TIPO DE MOVIMENTO: Contraproposta (colaborador recebeu oferta da concorrência)

DADOS DO CASO:
- Cargo do colaborador: ${body.cargo_atual}
- Salário atual: R$ ${body.salario_atual} (${regime})
- Oferta da concorrência: R$ ${body.salario_proposto} (${regime})
- Gap da oferta vs. salário atual: R$ ${body.salario_proposto - body.salario_atual} (${(((body.salario_proposto - body.salario_atual) / body.salario_atual) * 100).toFixed(1)}% acima)
- Budget disponível para contraproposta: ${budget}
- Setor: ${body.setor}
- Estado: ${body.estado}
- Nível de senioridade: ${senioridade}
- Tempo no cargo: ${tempoCargo}
- Histórico de avaliação: ${avaliacao}
- Pares internos: ${pares} | Salário médio dos pares: ${salarioPares}
- Contexto adicional: ${contexto}

INSTRUÇÃO ESPECIAL: Esta é uma situação de ALTA URGÊNCIA. O colaborador tem uma oferta concreta e a decisão precisa ser tomada rapidamente.

Na simulacao_financeira, inclua OBRIGATORIAMENTE três cenários:
1. "Não fazer contraproposta" — custo de reposição estimado (recrutamento + onboarding + curva de aprendizado)
2. "Contraproposta parcial" — match de 50-70% do gap, salário sugerido
3. "Match total da oferta" — igualar ou superar a oferta da concorrência

Na recomendacao, indique claramente qual dos três cenários recomendar e por quê.

No campo comunicacao_colaborador, gere o texto da conversa que o gestor deve ter com o colaborador, no tom adequado para a situação.

Analise este caso de contraproposta seguindo as regras e retorne o JSON com o schema abaixo:
${JSON_SCHEMA}`
  }
}

// ─────────────────────────────────────────────
// Chamada à Gemini API
// ─────────────────────────────────────────────
async function chamarGemini(userPrompt: string): Promise<unknown> {
  const apiKey = Deno.env.get("GEMINI_API_KEY")
  if (!apiKey) throw new Error("GEMINI_API_KEY não configurada")

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`

  const payload = {
    contents: [{ role: "user", parts: [{ text: userPrompt }] }],
    systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 4096,
      responseMimeType: "application/json",
    },
  }

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`Gemini API error ${response.status}: ${err}`)
  }

  const data = await response.json()
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) throw new Error("Gemini retornou resposta vazia")

  // Remover possível markdown caso o modelo ignore a instrução
  const cleaned = text.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim()
  return JSON.parse(cleaned)
}

// ─────────────────────────────────────────────
// Validação do output
// ─────────────────────────────────────────────
function validarOutput(resultado: Record<string, unknown>): void {
  const obrigatorios = [
    "resumo_cenario",
    "simulacao_financeira",
    "benchmark_mercado",
    "equidade_interna",
    "riscos",
    "recomendacao",
    "conclusao_estrategica",
  ]
  for (const campo of obrigatorios) {
    if (!resultado[campo]) throw new Error(`Campo obrigatório ausente: ${campo}`)
  }

  const rec = resultado.recomendacao as Record<string, unknown>
  if (typeof rec.salario_recomendado !== "number" || rec.salario_recomendado <= 0) {
    throw new Error("Salário recomendado inválido")
  }

  const riscos = resultado.riscos as Array<{ nivel: string }>
  if (!Array.isArray(riscos) || riscos.length === 0) {
    throw new Error("Nenhum risco identificado — output suspeito")
  }

  const niveisValidos = ["baixo", "medio", "alto"]
  for (const risco of riscos) {
    if (!niveisValidos.includes(risco.nivel)) {
      throw new Error(`Nível de risco inválido: ${risco.nivel}`)
    }
  }
}

// ─────────────────────────────────────────────
// Handler principal
// ─────────────────────────────────────────────
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    // 1. Autenticar usuário via JWT
    const authHeader = req.headers.get("Authorization")
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "não autorizado" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    )

    const jwt = authHeader.replace("Bearer ", "")
    const { data: { user }, error: authError } = await supabase.auth.getUser(jwt)
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "token inválido" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    // 2. Verificar limite do plano
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("plano, simulacoes_usadas_mes, trial_expira_em")
      .eq("id", user.id)
      .single()

    if (profileError || !profile) {
      return new Response(JSON.stringify({ error: "perfil não encontrado" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    if (!verificarLimite(profile)) {
      return new Response(JSON.stringify({ error: "limite_atingido" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    // 3. Receber e validar dados do formulário
    const body: BodySimulacao = await req.json()
    if (!body.tipo || !body.cargo_atual || !body.salario_atual || !body.salario_proposto) {
      return new Response(JSON.stringify({ error: "dados obrigatórios ausentes" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    // 4. Criar registro no banco com status 'processando'
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
      })
      .select()
      .single()

    if (insertError || !simulacao) {
      throw new Error("Erro ao criar simulação no banco")
    }

    // 5. Montar prompt e chamar Gemini
    const userPrompt = montarPrompt(body)
    let resultado: Record<string, unknown>

    try {
      resultado = (await chamarGemini(userPrompt)) as Record<string, unknown>
      validarOutput(resultado)
    } catch (iaError) {
      // Marcar simulação como erro
      await supabase
        .from("simulacoes")
        .update({ status: "erro" })
        .eq("id", simulacao.id)

      return new Response(
        JSON.stringify({ error: "ia_error", message: (iaError as Error).message }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      )
    }

    // 6. Atualizar simulação com resultado
    await supabase
      .from("simulacoes")
      .update({
        resultado,
        status: "concluido",
        concluido_em: new Date().toISOString(),
      })
      .eq("id", simulacao.id)

    // 7. Incrementar contador de simulações
    await supabase
      .from("profiles")
      .update({ simulacoes_usadas_mes: profile.simulacoes_usadas_mes + 1 })
      .eq("id", user.id)

    return new Response(
      JSON.stringify({ simulacao_id: simulacao.id, resultado }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    )
  } catch (err) {
    console.error("Erro inesperado:", err)
    return new Response(
      JSON.stringify({ error: "erro_interno", message: (err as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    )
  }
})
