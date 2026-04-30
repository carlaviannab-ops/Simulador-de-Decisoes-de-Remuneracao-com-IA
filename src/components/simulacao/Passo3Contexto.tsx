import type { FormularioSimulacao, TipoMovimento } from '../../types'

interface Props {
  tipo: TipoMovimento
  valores: Partial<FormularioSimulacao>
  onChange: (campo: keyof FormularioSimulacao, valor: string | number | boolean) => void
  onSimular: () => void
  onVoltar: () => void
  loading: boolean
}

const placeholderContexto: Record<TipoMovimento, string> = {
  promocao:      'Motivo da promoção, conquistas relevantes, feedback da liderança, prontidão para o novo cargo...',
  aumento:       'Motivo do pedido, histórico de performance, atividades além do escopo do cargo, risco de saída...',
  contratacao:   'Urgência da contratação, perfil desejado, diferenciais buscados, por que esse salário...',
  ajuste_faixa:  'Motivo da revisão, defasagem de mercado identificada, impacto esperado nos colaboradores...',
  contraproposta:'Empresa concorrente, perfil do colaborador, risco de perda para o negócio, prazo para decisão...',
}

export function Passo3Contexto({ tipo, valores, onChange, onSimular, onVoltar, loading }: Props) {
  const showHistoricoEtempo = tipo !== 'contratacao' && tipo !== 'ajuste_faixa'
  const showUltimoReajuste  = tipo === 'aumento' || tipo === 'contraproposta'
  const labelTempoCargo     = tipo === 'contraproposta' ? 'Tempo na empresa' : 'Tempo no cargo atual'

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Contexto adicional</h2>
      <p className="text-gray-500 mb-6 text-sm">
        Quanto mais contexto você fornecer, mais precisa será a análise. Todos os campos são opcionais.
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contexto livre
          </label>
          <textarea
            rows={4}
            value={valores.contexto_adicional ?? ''}
            onChange={e => onChange('contexto_adicional', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder={placeholderContexto[tipo]}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senioridade</label>
            <select
              value={valores.nivel_senioridade ?? ''}
              onChange={e => onChange('nivel_senioridade', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione</option>
              <option value="Júnior">Júnior</option>
              <option value="Pleno">Pleno</option>
              <option value="Sênior">Sênior</option>
              <option value="Especialista">Especialista</option>
              <option value="Coordenador">Coordenador</option>
              <option value="Gerente">Gerente</option>
              <option value="Diretor">Diretor</option>
            </select>
          </div>

          {showHistoricoEtempo && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{labelTempoCargo}</label>
              <input
                type="text"
                value={valores.tempo_cargo ?? ''}
                onChange={e => onChange('tempo_cargo', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: 2 anos"
              />
            </div>
          )}
        </div>

        {showHistoricoEtempo && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Última avaliação de desempenho</label>
              <input
                type="text"
                value={valores.historico_avaliacao ?? ''}
                onChange={e => onChange('historico_avaliacao', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: Excede expectativas"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Política salarial da empresa</label>
              <input
                type="text"
                value={valores.politica_salarial ?? ''}
                onChange={e => onChange('politica_salarial', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: posição no P50 do mercado"
              />
            </div>
          </div>
        )}

        {!showHistoricoEtempo && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Política salarial da empresa</label>
            <input
              type="text"
              value={valores.politica_salarial ?? ''}
              onChange={e => onChange('politica_salarial', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: posição no P50 do mercado"
            />
          </div>
        )}

        {showUltimoReajuste && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Último reajuste salarial
                <span className="ml-1 text-xs text-gray-400 font-normal">Melhora a análise de defasagem</span>
              </label>
              <input
                type="text"
                value={valores.ultimo_reajuste ?? ''}
                onChange={e => onChange('ultimo_reajuste', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: jan/2024, há 18 meses"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Percentual do último reajuste (%)
              </label>
              <input
                type="number"
                min={0}
                max={100}
                step={0.1}
                value={valores.percentual_ultimo_reajuste ?? ''}
                onChange={e => onChange('percentual_ultimo_reajuste', Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: 5"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Criticidade do cargo
            <span className="ml-1 text-xs text-gray-400 font-normal">Impacta análise de risco de perda</span>
          </label>
          <select
            value={valores.criticidade_cargo ?? ''}
            onChange={e => onChange('criticidade_cargo', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecione</option>
            <option value="alta">Alta — perfil escasso ou conhecimento único</option>
            <option value="media">Média — reposição possível em prazo razoável</option>
            <option value="baixa">Baixa — perfil facilmente substituível</option>
          </select>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={valores.pares_existem ?? false}
              onChange={e => onChange('pares_existem', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            {tipo === 'contratacao' ? 'Existem colaboradores no mesmo cargo/nível?' : 'Existem pares internos no mesmo cargo?'}
          </label>
          {valores.pares_existem && (
            <div className="mt-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Salário médio dos pares (R$)</label>
              <input
                type="number"
                min={0}
                value={valores.salario_medio_pares ?? ''}
                onChange={e => onChange('salario_medio_pares', Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: 9500"
              />
            </div>
          )}
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
          onClick={onSimular}
          disabled={loading}
          className="px-8 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              Analisando...
            </>
          ) : (
            'Simular com IA'
          )}
        </button>
      </div>
    </div>
  )
}
