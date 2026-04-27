import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Spinner } from '../components/Spinner'
import type { Simulacao } from '../types'

export function SimulacaoDetalhe() {
  const { id } = useParams<{ id: string }>()
  const [simulacao, setSimulacao] = useState<Simulacao | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    supabase
      .from('simulacoes')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data }) => {
        setSimulacao(data)
        setLoading(false)
      })
  }, [id])

  if (loading) return <Spinner />
  if (!simulacao) return <p className="text-gray-500">Simulação não encontrada.</p>

  if (simulacao.status === 'concluido' && simulacao.resultado) {
    return <></>  // Resultado completo renderizado em Resultado.tsx
  }

  return (
    <div className="max-w-2xl mx-auto text-center py-16">
      <p className="text-gray-500 mb-4">
        Status: <span className="font-semibold">{simulacao.status}</span>
      </p>
      {simulacao.status === 'processando' && (
        <p className="text-blue-600 text-sm">A IA está analisando sua simulação...</p>
      )}
      <Link to="/dashboard" className="mt-6 inline-block text-sm text-blue-600 hover:underline">
        Voltar ao Dashboard
      </Link>
    </div>
  )
}
