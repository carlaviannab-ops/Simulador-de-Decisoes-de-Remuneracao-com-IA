import { Link } from 'react-router-dom'

function CheckIcon() {
  return (
    <svg className="w-5 h-5 text-blue-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  )
}

const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
      </svg>
    ),
    title: 'Promoção',
    desc: 'Avalie se o aumento por promoção está alinhado ao mercado e justo internamente antes de levar à aprovação.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33" />
      </svg>
    ),
    title: 'Aumento Salarial',
    desc: 'Simule cenários de reajuste com impacto financeiro real e posicionamento contra benchmarks do setor.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
    title: 'Nova Contratação',
    desc: 'Defina a oferta certa para atrair o talento sem pagar acima do mercado nem gerar inequidade.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
      </svg>
    ),
    title: 'Ajuste de Faixa',
    desc: 'Atualize sua estrutura salarial com embasamento em dados de mercado e análise de equidade interna.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
      </svg>
    ),
    title: 'Contraproposta',
    desc: 'Avalie em minutos se vale reter o colaborador, quanto oferecer e como comunicar a decisão com segurança.',
  },
]

const diferenciais = [
  {
    title: 'Benchmarks reais do mercado',
    desc: 'P25, P50, P75 e P90 baseados em Robert Half, Salario.com.br e CAGED — por setor e estado.',
  },
  {
    title: 'Análise de equidade interna',
    desc: 'Identifica riscos de distorção salarial entre pares antes que virem problema de retenção.',
  },
  {
    title: 'Texto pronto para o colaborador',
    desc: 'A IA gera o roteiro da conversa com o funcionário, no tom certo para cada situação.',
  },
  {
    title: 'Trilha de auditoria completa',
    desc: 'Registre a decisão final, quem aprovou e o contexto. Tudo documentado para compliance e histórico.',
  },
  {
    title: 'Simulação financeira com cenários',
    desc: 'Veja o impacto em salário mensal e custo anual para 2 a 3 cenários lado a lado.',
  },
  {
    title: 'Riscos identificados com mitigação',
    desc: 'A IA aponta os riscos da decisão (alto, médio, baixo) e sugere como mitigá-los.',
  },
]

const steps = [
  { n: '1', title: 'Preencha o caso', desc: 'Informe cargo, salários, regime, setor e contexto da decisão em menos de 2 minutos.' },
  { n: '2', title: 'IA analisa em segundos', desc: 'Nosso modelo processa benchmarks, equidade interna, riscos e monta a recomendação completa.' },
  { n: '3', title: 'Decida com segurança', desc: 'Receba a análise estruturada, o texto para o colaborador e registre a decisão na trilha de auditoria.' },
]

export function Landing() {
  return (
    <div className="min-h-screen bg-white font-sans">

      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
              </svg>
            </div>
            <span className="text-lg font-bold text-gray-900">RemunaIA</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-3 py-2">
              Entrar
            </Link>
            <Link to="/cadastro" className="text-sm font-semibold bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Começar grátis
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block text-xs font-semibold tracking-wider text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full mb-6 uppercase">
            Inteligência artificial para RH estratégico
          </span>
          <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight mb-6">
            Decida sobre salários com{' '}
            <span className="text-blue-600">dados reais</span> e{' '}
            <span className="text-blue-600">IA</span>
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Simule promoções, aumentos, contratações e contrapropostas em segundos.
            Receba benchmarks de mercado, análise de equidade interna e a recomendação pronta para usar.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
            <Link
              to="/cadastro"
              className="bg-blue-600 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-blue-700 transition-colors text-base shadow-sm shadow-blue-200"
            >
              Começar grátis — 14 dias
            </Link>
            <Link
              to="/login"
              className="bg-white text-gray-700 font-semibold px-8 py-3.5 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors text-base"
            >
              Já tenho conta
            </Link>
          </div>
          <p className="text-sm text-gray-400">Sem cartão de crédito · Cancele quando quiser</p>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-gray-100 bg-white py-8">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-3 gap-6 text-center">
          {[
            { value: '5 tipos', label: 'de movimentação salarial cobertos' },
            { value: '< 30s', label: 'para gerar uma análise completa' },
            { value: '100%', label: 'embasado em benchmarks do mercado BR' },
          ].map(({ value, label }) => (
            <div key={label}>
              <p className="text-3xl font-extrabold text-gray-900">{value}</p>
              <p className="text-sm text-gray-500 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900">Como funciona</h2>
            <p className="text-gray-500 mt-3">Da dúvida à decisão em menos de um minuto</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div key={step.n} className="relative">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-xl font-bold mb-4">
                  {step.n}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features / simulation types */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900">5 simulações prontas para usar</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">
              Cada tipo de movimentação tem uma análise específica, com os dados que RH precisa para decidir com confiança.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <div key={f.title} className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all">
                <div className="w-11 h-11 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Diferenciais */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900">O que está em cada análise</h2>
            <p className="text-gray-500 mt-3">Mais do que um número — uma recomendação completa para apresentar ao negócio</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {diferenciais.map((d) => (
              <div key={d.title} className="flex gap-3">
                <CheckIcon />
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{d.title}</p>
                  <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">{d.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-20 px-6 bg-gradient-to-br from-blue-600 to-blue-700">
        <div className="max-w-2xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Comece a decidir com dados hoje</h2>
          <p className="text-blue-100 mb-8 text-lg">
            14 dias grátis. Sem cartão de crédito. Configure em menos de 2 minutos.
          </p>
          <Link
            to="/cadastro"
            className="inline-block bg-white text-blue-700 font-bold px-10 py-4 rounded-xl hover:bg-blue-50 transition-colors text-base shadow-lg"
          >
            Criar minha conta grátis
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-10 px-6 text-center text-sm">
        <p className="font-semibold text-white mb-1">RemunaIA</p>
        <p>Simulador de decisões de remuneração com inteligência artificial</p>
      </footer>
    </div>
  )
}
