import type { FormularioSimulacao, TipoMovimento, Regime } from '../../types'

interface Props {
  tipo: TipoMovimento
  valores: Partial<FormularioSimulacao>
  onChange: (campo: keyof FormularioSimulacao, valor: string | number | boolean) => void
  onAvancar: () => void
  onVoltar: () => void
}

const setoresBR = [
  'Tecnologia', 'Financeiro / Bancário', 'Saúde', 'Varejo / E-commerce',
  'Indústria / Manufatura', 'Educação', 'Consultoria', 'Logística',
  'Agronegócio', 'Telecomunicações', 'Governo / Público', 'Outro',
]

const estadosBR = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS',
  'MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO',
]

const headers: Record<TipoMovimento, { titulo: string; subtitulo: string }> = {
  promocao:      { titulo: 'Dados da promoção',         subtitulo: 'Informe o cargo atual, o novo cargo e os salários envolvidos.' },
  aumento:       { titulo: 'Dados do cargo e salário',  subtitulo: 'Preencha os campos obrigatórios para continuar.' },
  contratacao:   { titulo: 'Dados da vaga',             subtitulo: 'Informe o cargo e o salário que pretende oferecer.' },
  ajuste_faixa:  { titulo: 'Dados da faixa salarial',   subtitulo: 'Informe o cargo e os valores da faixa atual e proposta.' },
  contraproposta:{ titulo: 'Dados da contraproposta',   subtitulo: 'Informe o salário atual do colaborador e o valor da oferta recebida.' },
}

export function Passo2Dados({ tipo, valores, onChange, onAvancar, onVoltar }: Props) {
  const isContratacao   = tipo === 'contratacao'
  const isPromocao      = tipo === 'promocao'
  const isContraproposta = tipo === 'contraproposta'
  const isAjusteFaixa   = tipo === 'ajuste_faixa'

  const labelCargo = isContratacao
    ? 'Cargo a contratar'
    : isContraproposta
    ? 'Cargo do colaborador'
    : 'Cargo atual'

  const labelSalarioAtual = isContraproposta
    ? 'Salário atual do colaborador (R$)'
    : isAjusteFaixa
    ? 'Salário médio atual da faixa (R$)'
    : 'Salário atual (R$)'

  const labelSalarioProposto = isContratacao
    ? 'Salário a oferecer (R$)'
    : isContraproposta
    ? 'Oferta da concorrência (R$)'
    : isAjusteFaixa
    ? 'Novo salário da faixa (R$)'
    : 'Salário proposto (R$)'

  const placeholderSalarioProposto = isContratacao
    ? 'Ex: 8000'
    : isContraproposta
    ? 'Ex: 12000 (oferta recebida)'
    : isAjusteFaixa
    ? 'Ex: 10000 (nova mediana)'
    : 'Ex: 10000'

  const obrigatoriosPreenchidos = isContratacao
    ? !!valores.cargo_atual && !!valores.salario_proposto && !!valores.regime && !!valores.setor && !!valores.estado
    : !!valores.cargo_atual && !!valores.salario_atual && !!valores.salario_proposto && !!valores.regime && !!valores.setor && !!valores.estado

  const { titulo, subtitulo } = headers[tipo]

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">{titulo}</h2>
      <p className="text-gray-500 mb-6 text-sm">{subtitulo}</p>

      <div className="space-y-4">
        <div className={`grid grid-cols-1 gap-4 ${isPromocao ? 'sm:grid-cols-2' : ''}`}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {labelCargo} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={valores.cargo_atual ?? ''}
              onChange={e => onChange('cargo_atual', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={isContratacao ? 'Ex: Desenvolvedor Backend' : isContraproposta ? 'Ex: Engenheiro de Software' : 'Ex: Analista de RH'}
            />
          </div>

          {isPromocao && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Novo cargo após promoção
              </label>
              <input
                type="text"
                value={valores.cargo_proposto ?? ''}
                onChange={e => onChange('cargo_proposto', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: Coordenadora de RH"
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {!isContratacao && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {labelSalarioAtual} <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min={0}
                value={valores.salario_atual ?? ''}
                onChange={e => onChange('salario_atual', Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: 8000"
              />
            </div>
          )}
          <div className={isContratacao ? 'sm:col-span-2 max-w-sm' : ''}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {labelSalarioProposto} <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min={0}
              value={valores.salario_proposto ?? ''}
              onChange={e => onChange('salario_proposto', Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={placeholderSalarioProposto}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Regime <span className="text-red-500">*</span>
            </label>
            <select
              value={valores.regime ?? ''}
              onChange={e => onChange('regime', e.target.value as Regime)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione</option>
              <option value="clt">CLT</option>
              <option value="pj">PJ</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Setor <span className="text-red-500">*</span>
            </label>
            <select
              value={valores.setor ?? ''}
              onChange={e => onChange('setor', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione</option>
              {setoresBR.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado <span className="text-red-500">*</span>
            </label>
            <select
              value={valores.estado ?? ''}
              onChange={e => onChange('estado', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione</option>
              {estadosBR.map(uf => <option key={uf} value={uf}>{uf}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={onVoltar}
          className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Voltar
        </button>
        <button
          onClick={onAvancar}
          disabled={!obrigatoriosPreenchidos}
          className="px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Continuar
        </button>
      </div>
    </div>
  )
}
