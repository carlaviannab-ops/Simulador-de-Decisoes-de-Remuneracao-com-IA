import { Link } from 'react-router-dom'

export function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 flex flex-col items-center justify-center text-white px-4">
      <div className="max-w-2xl text-center">
        <h1 className="text-5xl font-bold mb-4">RemunaIA</h1>
        <p className="text-xl text-blue-100 mb-8">
          Decisões de remuneração embasadas em dados e inteligência artificial.
          Chegue a reuniões de RH com argumentos sólidos.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            to="/cadastro"
            className="bg-white text-blue-700 font-semibold px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Começar grátis
          </Link>
          <Link
            to="/login"
            className="border border-white text-white font-semibold px-8 py-3 rounded-lg hover:bg-white/10 transition-colors"
          >
            Entrar
          </Link>
        </div>
        <p className="mt-6 text-blue-200 text-sm">14 dias grátis · Sem cartão de crédito</p>
      </div>
    </div>
  )
}
