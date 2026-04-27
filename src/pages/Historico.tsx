import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
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
}

export function Historico() {
  const { user } = useAuth()
  const [simulacoes, setSimulacoes] = useState<Simulacao[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    supabase
      .from('simulacoes')
      .select('*')
      .eq('user_id', user.id)
      .order('criado_em', { ascending: false })
      .then(({ data }) => {
        setSimulacoes(data ?? [])
        setLoading(false)
      })
  }, [user])

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Histórico</h1>
        <Link
          to="/simulacao/nova"
          className="bg-blue-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Nova Simulação
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      ) : simulacoes.length === 0 ? (
        <p className="text-gray-400 text-center py-16">Nenhuma simulação encontrada.</p>
      ) : (
        <div className="space-y-3">
          {simulacoes.map(sim => (
            <Link
              key={sim.id}
              to={`/simulacao/${sim.id}`}
              className="block bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                    {tipoLabel[sim.tipo] ?? sim.tipo}
                  </span>
                  <p className="font-semibold text-gray-900 mt-1">{sim.cargo_atual}</p>
                  <p className="text-sm text-gray-500">
                    {formatBRL(sim.salario_atual)} → {formatBRL(sim.salario_proposto)} · {sim.setor} · {sim.estado}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    sim.status === 'concluido'
                      ? 'bg-green-100 text-green-700'
                      : sim.status === 'processando'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {sim.status}
                  </span>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(sim.criado_em).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
