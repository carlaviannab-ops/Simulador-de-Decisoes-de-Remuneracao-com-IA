interface Props {
  passo: 1 | 2 | 3
}

const passos = ['Tipo', 'Dados', 'Contexto']

export function WizardProgress({ passo }: Props) {
  return (
    <div className="flex items-center gap-0 mb-8">
      {passos.map((label, idx) => {
        const num = idx + 1
        const done = num < passo
        const active = num === passo
        return (
          <div key={label} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                done ? 'bg-blue-600 text-white' : active ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'
              }`}>
                {done ? '✓' : num}
              </div>
              <span className={`text-xs mt-1 font-medium ${active ? 'text-blue-600' : done ? 'text-blue-600' : 'text-gray-400'}`}>
                {label}
              </span>
            </div>
            {idx < passos.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 mt-[-1rem] transition-colors ${done ? 'bg-blue-600' : 'bg-gray-200'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}
