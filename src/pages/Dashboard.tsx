import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import type { Simulacao } from '../types'

const formatBRL = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)

const tipoLabel: Record<string, string> = {
  promocao: 'Promoção',
  aumento: 'Aumento Salarial',
  contratacao: 'Nova Contratação',
  ajuste_faixa: 'Ajuste de Faixa',
  contraproposta: 'Contraproposta',
}

const tipoDesc: Record<string, string> = {
  promocao: 'Analise viabilidade e impacto de promoções',
  aumento: 'Avalie pedidos de reajuste salarial',
  contratacao: 'Defina a oferta ideal para novas contratações',
  ajuste_faixa: 'Corrija distorções de equidade interna',
  contraproposta: 'Responda propostas de outros empregadores',
}

const tipoIcons: Record<string, JSX.Element> = {
  promocao: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
    </svg>
  ),
  aumento: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  contratacao: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
    </svg>
  ),
  ajuste_faixa: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" d="M3 6h18M3 12h18M3 18h18" />
    </svg>
  ),
  contraproposta: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  ),
}

const statusConfig: Record<string, { label: string; cls: string }> = {
  concluido: { label: 'Concluído', cls: 'bg-green-100 text-green-700' },
  processando: { label: 'Processando', cls: 'bg-yellow-100 text-yellow-700' },
  erro: { label: 'Erro', cls: 'bg-red-100 text-red-700' },
  pendente: { label: 'Pendente', cls: 'bg-gray-100 text-gray-600' },
}

interface Stats {
  total: number
  mes: number
  concluidas: number
}

export function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [simulacoes, setSimulacoes] = useState<Simulacao[]>([])
  const [stats, setStats] = useState<Stats>({ total: 0, mes: 0, concluidas: 0 })
  const [loading, setLoading] = useState(true)
  const [pendentesAuditoria, setPendentesAuditoria] = useState<Simulacao[]>([])

  const firstName = user?.user_metadata?.full_name?.split(' ')[0]
    ?? user?.email?.split('@')[0]
    ?? 'bem-vindo'

  useEffect(() => {
    if (!user) return

    const inicioMes = new Date()
    inicioMes.setDate(1)
    inicioMes.setHours(0, 0, 0, 0)

    const tresdiasAtras = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()

    Promise.all([
      supabase.from('simulacoes').select('*').eq('user_id', user.id).order('criado_em', { ascending: false }).limit(5),
      supabase.from('simulacoes').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
      supabase.from('simulacoes').select('id', { count: 'exact', head: true }).eq('user_id', user.id).gte('criado_em', inicioMes.toISOString()),
      supabase.from('simulacoes').select('id', { count: 'exact', head: true }).eq('user_id', user.id).eq('status', 'concluido'),
      supabase.from('simulacoes').select('id, cargo_atual, tipo, criado_em').eq('user_id', user.id).eq('status', 'concluido').is('decisao_final', null).lt('criado_em', tresdiasAtras).order('criado_em', { ascending: false }).limit(5),
    ]).then(([recentes, total, mes, concluidas, pendentes]) => {
      setSimulacoes(recentes.data ?? [])
      setStats({
        total: total.count ?? 0,
        mes: mes.count ?? 0,
        concluidas: concluidas.count ?? 0,
      })
      setPendentesAuditoria((pendentes.data as Simulacao[]) ?? [])
      setLoading(false)
    })
  }, [user])

  const statCards = [
    {
      label: 'Total de simulações',
      value: stats.total,
      icon: (
        <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      bg: 'bg-blue-50',
    },
    {
      label: 'Simulações este mês',
      value: stats.mes,
      icon: (
        <svg className="w-5 h-5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <path strokeLinecap="round" d="M16 2v4M8 2v4M3 10h18" />
        </svg>
      ),
      bg: 'bg-violet-50',
    },
    {
      label: 'Decisões registradas',
      value: stats.concluidas,
      icon: (
        <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bg: 'bg-emerald-50',
    },
  ]

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Boas-vindas */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Olá, {firstName}</h1>
        <p className="text-gray-500 mt-1 text-sm">Aqui está um resumo da sua atividade no RemunaIA.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statCards.map(card => (
          <div key={card.label} className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
            <div className={`${card.bg} p-3 rounded-xl`}>{card.icon}</div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{loading ? '—' : card.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Alerta de auditoria pendente */}
      {!loading && pendentesAuditoria.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-4 h-4 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-amber-800 font-semibold text-sm">
              {pendentesAuditoria.length} simulaç{pendentesAuditoria.length === 1 ? 'ão' : 'ões'} sem decisão registrada
            </p>
          </div>
          <div className="space-y-1.5">
            {pendentesAuditoria.map(sim => (
              <Link
                key={sim.id}
                to={`/simulacao/${sim.id}/resultado#auditoria`}
                className="flex items-center justify-between bg-white border border-amber-200 rounded-lg px-3 py-2 hover:border-amber-400 transition-colors"
              >
                <div>
                  <span className="text-sm font-medium text-gray-800">{sim.cargo_atual}</span>
                  <span className="ml-2 text-xs text-gray-400">{tipoLabel[sim.tipo] ?? sim.tipo}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-amber-600">
                    {Math.floor((Date.now() - new Date(sim.criado_em).getTime()) / (1000 * 60 * 60 * 24))}d sem registro
                  </span>
                  <span className="text-xs text-amber-700 font-semibold">Registrar →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Ações rápidas */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-900">Nova simulação</h2>
          <Link to="/simulacao/nova" className="text-sm text-blue-600 hover:underline">Ver todas as opções →</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {Object.entries(tipoLabel).map(([tipo, label]) => (
            <button
              key={tipo}
              onClick={() => navigate(`/simulacao/nova?tipo=${tipo}`)}
              className="bg-white border border-gray-200 rounded-xl p-4 text-left hover:border-blue-300 hover:shadow-sm transition-all group"
            >
              <div className="w-9 h-9 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-3 group-hover:bg-blue-100 transition-colors">
                {tipoIcons[tipo]}
              </div>
              <p className="text-sm font-semibold text-gray-800 leading-tight">{label}</p>
              <p className="text-xs text-gray-400 mt-1 leading-snug">{tipoDesc[tipo]}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Recentes */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-900">Simulações recentes</h2>
          <Link to="/historico" className="text-sm text-blue-600 hover:underline">Ver histórico →</Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-blue-600" />
          </div>
        ) : simulacoes.length === 0 ? (
          <div className="bg-white text-center py-14 border-2 border-dashed border-gray-200 rounded-xl">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium">Nenhuma simulação ainda</p>
            <p className="text-gray-400 text-sm mt-1 mb-4">Escolha um tipo acima para começar</p>
            <Link to="/simulacao/nova" className="text-sm text-blue-600 font-medium hover:underline">
              Criar minha primeira simulação
            </Link>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            {simulacoes.map((sim, i) => {
              const status = statusConfig[sim.status] ?? { label: sim.status, cls: 'bg-gray-100 text-gray-600' }
              return (
                <Link
                  key={sim.id}
                  to={`/simulacao/${sim.id}`}
                  className={`flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors ${i !== 0 ? 'border-t border-gray-100' : ''}`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
                      {tipoIcons[sim.tipo] ?? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <circle cx="12" cy="12" r="9" />
                        </svg>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">{sim.cargo_atual}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {tipoLabel[sim.tipo] ?? sim.tipo} · {formatBRL(sim.salario_atual)} → {formatBRL(sim.salario_proposto)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-4">
                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${status.cls}`}>
                      {status.label}
                    </span>
                    <span className="text-xs text-gray-400 hidden sm:inline">
                      {new Date(sim.criado_em).toLocaleDateString('pt-BR')}
                    </span>
                    <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
