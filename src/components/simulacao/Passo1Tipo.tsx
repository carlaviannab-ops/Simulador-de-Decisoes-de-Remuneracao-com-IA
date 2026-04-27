import type { TipoMovimento } from '../../types'

interface Props {
  onSelect: (tipo: TipoMovimento) => void
}

const opcoes: { tipo: TipoMovimento; titulo: string; descricao: string; emoji: string; destaque?: boolean }[] = [
  { tipo: 'promocao', titulo: 'Promoção', descricao: 'Mudança de cargo com aumento salarial', emoji: '🚀' },
  { tipo: 'aumento', titulo: 'Aumento Salarial', descricao: 'Reajuste sem mudança de cargo', emoji: '💰' },
  { tipo: 'contratacao', titulo: 'Nova Contratação', descricao: 'Definir salário de oferta', emoji: '👤' },
  { tipo: 'ajuste_faixa', titulo: 'Ajuste de Faixa', descricao: 'Revisar faixas salariais do cargo', emoji: '📊' },
  { tipo: 'contraproposta', titulo: 'Contraproposta', descricao: 'Colaborador recebeu oferta da concorrência — o que fazer?', emoji: '⚡', destaque: true },
]

export function Passo1Tipo({ onSelect }: Props) {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Qual tipo de decisão você precisa analisar?</h2>
      <p className="text-gray-500 mb-6 text-sm">Escolha o cenário que melhor descreve sua situação.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {opcoes.map(op => (
          <button
            key={op.tipo}
            onClick={() => onSelect(op.tipo)}
            className={`text-left border rounded-xl p-5 transition-colors group ${
              op.destaque
                ? 'border-orange-300 bg-orange-50 hover:border-orange-400 hover:bg-orange-100 sm:col-span-2'
                : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50'
            }`}
          >
            <div className="flex items-start justify-between">
              <span className="text-3xl">{op.emoji}</span>
              {op.destaque && (
                <span className="text-xs font-bold bg-orange-200 text-orange-800 px-2 py-0.5 rounded-full">Urgente</span>
              )}
            </div>
            <p className={`font-semibold mt-2 ${op.destaque ? 'text-orange-900' : 'text-gray-900 group-hover:text-blue-700'}`}>{op.titulo}</p>
            <p className={`text-sm mt-1 ${op.destaque ? 'text-orange-700' : 'text-gray-500'}`}>{op.descricao}</p>
          </button>
        ))}
      </div>
    </div>
  )
}
