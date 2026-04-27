export function Planos() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Planos</h1>
      <p className="text-gray-500 mb-8">Escolha o plano ideal para o seu time de RH.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { nome: 'Starter', preco: 'R$ 497/mês', sims: '20 simulações/mês', usuarios: '3 usuários' },
          { nome: 'Professional', preco: 'R$ 1.297/mês', sims: 'Ilimitadas', usuarios: '10 usuários', destaque: true },
          { nome: 'Enterprise', preco: 'Sob consulta', sims: 'Ilimitadas', usuarios: 'Ilimitados' },
        ].map(plano => (
          <div
            key={plano.nome}
            className={`border rounded-xl p-6 ${plano.destaque ? 'border-blue-500 ring-2 ring-blue-500' : 'border-gray-200'}`}
          >
            {plano.destaque && (
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wide">Mais popular</span>
            )}
            <h2 className="text-xl font-bold text-gray-900 mt-1">{plano.nome}</h2>
            <p className="text-2xl font-bold text-blue-700 mt-2">{plano.preco}</p>
            <ul className="mt-4 space-y-2 text-sm text-gray-600">
              <li>✓ {plano.sims}</li>
              <li>✓ {plano.usuarios}</li>
              <li>✓ Exportação em PDF</li>
              <li>✓ Benchmark de mercado</li>
            </ul>
            <button className="mt-6 w-full bg-blue-600 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition-colors">
              Assinar agora
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
