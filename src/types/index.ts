export type TipoMovimento = 'promocao' | 'aumento' | 'contratacao' | 'ajuste_faixa' | 'contraproposta'
export type Regime = 'clt' | 'pj'
export type Plano = 'trial' | 'starter' | 'professional' | 'enterprise' | 'cancelado'
export type NivelRisco = 'baixo' | 'medio' | 'alto'
export type Urgencia = 'imediata' | 'pode aguardar' | 'não recomendado agora'
export type StatusSimulacao = 'pendente' | 'processando' | 'concluido' | 'erro'
export type StatusAlerta = 'critico' | 'atencao' | 'ok' | 'pendente'

export interface Profile {
  id: string
  nome: string
  empresa: string
  setor_empresa?: string
  plano: Plano
  simulacoes_usadas_mes: number
  trial_expira_em: string
  stripe_customer_id?: string
  criado_em: string
}

export interface FormularioSimulacao {
  tipo: TipoMovimento
  cargo_atual: string
  cargo_proposto?: string
  salario_atual: number
  salario_proposto: number
  regime: Regime
  setor: string
  estado: string
  contexto_adicional?: string
  budget_informado: boolean
  budget_valor?: number
  pares_existem: boolean
  salario_medio_pares?: number
  historico_avaliacao?: string
  politica_salarial?: string
  nivel_senioridade?: string
  tempo_cargo?: string
  ultimo_reajuste?: string
  percentual_ultimo_reajuste?: number
  criticidade_cargo?: 'alta' | 'media' | 'baixa'
  beneficio_vr?: number
  beneficio_saude?: number
  beneficio_vt?: number
  beneficio_odonto?: number
  beneficio_outros?: number
}

export interface ResultadoSimulacao {
  resumo_cenario: string
  simulacao_financeira: {
    tabela: Array<{
      cenario: string
      salario_mensal: number
      variacao_percentual: number
      custo_anual_incremental: number
      custo_total_empregador_anual?: number
    }>
    nota: string
  }
  benchmark_mercado: {
    fonte: string
    p25: number
    p50: number
    p75: number
    p90: number
    posicionamento_atual: string
    posicionamento_proposto: string
    ajuste_setor: string
    nota: string
  }
  equidade_interna: {
    analise: string
    risco_distorcao: NivelRisco
    recomendacao_equidade: string
  }
  riscos: Array<{
    risco: string
    nivel: NivelRisco
    descricao: string
    mitigacao: string
  }>
  recomendacao: {
    decisao: string
    salario_recomendado: number
    justificativa: string
    condicoes: string
    urgencia: Urgencia
  }
  conclusao_estrategica: string
  suposicoes_adotadas: string[]
  comunicacao_colaborador?: {
    tom: string
    texto: string
    pontos_chave: string[]
  }
}

export interface Simulacao {
  id: string
  user_id: string
  tipo: TipoMovimento
  cargo_atual: string
  cargo_proposto?: string
  salario_atual: number
  salario_proposto: number
  regime: Regime
  setor: string
  estado: string
  resultado?: ResultadoSimulacao
  status: StatusSimulacao
  criado_em: string
  concluido_em?: string
  decisao_final?: string
  registrado_por?: string
  registrado_em?: string
  observacao_aprovador?: string
  lote_id?: string
}

export interface BenchmarkData {
  p25: number
  p50: number
  p75: number
  p90: number
  nota: string
}

export interface RadarPosicao {
  id: string
  user_id: string
  cargo: string
  nivel_senioridade?: string
  setor: string
  estado: string
  regime: string
  salario_atual: number
  benchmark?: BenchmarkData
  status_alerta: StatusAlerta
  atualizado_em?: string
  criado_em: string
}

export interface MembroEquipe {
  id: string
  user_id: string
  nome: string
  cargo: string
  nivel_senioridade?: string
  area?: string
  setor: string
  estado: string
  salario_atual: number
  regime: string
  data_admissao?: string
  benchmark?: BenchmarkData
  status_salarial: StatusAlerta
  criado_em: string
}

export interface Lote {
  id: string
  user_id: string
  nome: string
  total: number
  processados: number
  erros: number
  status: string
  criado_em: string
}
