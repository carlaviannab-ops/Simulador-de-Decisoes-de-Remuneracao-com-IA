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

export function Passo2Dados({ tipo, valores, onChange, onAvancar, onVoltar }: Props) {
  const isPromocao = tipo === 'promocao'
  const isContratacao = tipo === 'contratacao'
  const isContraproposta = tipo === 'contraproposta'

  const obrigatoriosPreenchidos =
    !!valores.cargo_atual &&
    !!valores.salario_atual &&
    !!valores.salario_proposto &&
    !!valores.regime &&
    !!valores.setor &&
    !!valores.estado

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">
        {isContraproposta ? 'Dados da contraproposta' : 'Dados do cargo e salário'}
      </h2>
      <p className="text-gray-500 mb-6 text-sm">
        {isContraproposta
          ? 'Informe o salário atual do colaborador e o valor da oferta recebida.'
          : 'Preencha os campos obrigatórios para continuar.'}
      </p>

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cargo atual <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={valores.cargo_atual ?? ''}
              onChange={e => onChange('cargo_atual', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Analista de RH"
            />
          </div>

          {(isPromocao || isContratacao) && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {isContratacao ? 'Cargo a contratar' : 'Cargo proposto'}
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {isContraproposta ? 'Salário atual do colaborador (R$)' : 'Salário atual (R$)'} <span className="text-red-500">*</span>
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {isContraproposta ? 'Oferta da concorrência (R$)' : 'Salário proposto (R$)'} <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min={0}
              value={valores.salario_proposto ?? ''}
              onChange={e => onChange('salario_proposto', Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={isContraproposta ? 'Ex: 12000 (oferta recebida)' : 'Ex: 10000'}
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
