import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import type { FormularioSimulacao, TipoMovimento } from '../types'
import { WizardProgress } from '../components/simulacao/WizardProgress'
import { Passo1Tipo } from '../components/simulacao/Passo1Tipo'
import { Passo2Dados } from '../components/simulacao/Passo2Dados'
import { Passo3Contexto } from '../components/simulacao/Passo3Contexto'

type Passo = 1 | 2 | 3

export function NovaSimulacao() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const tipoParam = searchParams.get('tipo') as TipoMovimento | null
  const cargoParam = searchParams.get('cargo')
  const salarioParam = searchParams.get('salario')

  const [passo, setPasso] = useState<Passo>(tipoParam ? 2 : 1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState<Partial<FormularioSimulacao>>({
    budget_informado: false,
    pares_existem: false,
    ...(tipoParam && { tipo: tipoParam }),
    ...(cargoParam && { cargo_atual: cargoParam }),
    ...(salarioParam && { salario_atual: Number(salarioParam) }),
  })

  function handleChange(campo: keyof FormularioSimulacao, valor: string | number | boolean) {
    setForm(prev => ({ ...prev, [campo]: valor }))
  }

  function handleSelecionarTipo(tipo: TipoMovimento) {
    setForm(prev => ({ ...prev, tipo }))
    setPasso(2)
  }

  async function handleSimular() {
    if (!user) return
    setLoading(true)
    setError('')

    try {
      const { data, error: fnError } = await supabase.functions.invoke('simulate', {
        body: form,
      })

      if (fnError) {
        const errData = data as { error?: string } | null
        if (errData?.error === 'limite_atingido') {
          setError('Você atingiu o limite de simulações do seu plano. Acesse Planos para fazer upgrade.')
        } else if (errData?.error === 'ia_error') {
          setError('A IA está temporariamente sobrecarregada. Aguarde alguns segundos e tente novamente.')
        } else if (errData?.error === 'dados obrigatorios ausentes') {
          setError('Preencha todos os campos obrigatórios antes de simular.')
        } else {
          setError('Erro ao processar simulação. Tente novamente em alguns segundos.')
        }
        setLoading(false)
        return
      }

      navigate(`/simulacao/${data.simulacao_id}/resultado`)
    } catch (err: unknown) {
      setError('Erro de conexão. Verifique sua internet e tente novamente.')
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Nova Simulação</h1>
      <WizardProgress passo={passo} />

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        {passo === 1 && (
          <Passo1Tipo onSelect={handleSelecionarTipo} />
        )}
        {passo === 2 && (
          <Passo2Dados
            tipo={form.tipo!}
            valores={form}
            onChange={handleChange}
            onAvancar={() => setPasso(3)}
            onVoltar={() => setPasso(1)}
          />
        )}
        {passo === 3 && (
          <Passo3Contexto
            tipo={form.tipo!}
            valores={form}
            onChange={handleChange}
            onSimular={handleSimular}
            onVoltar={() => setPasso(2)}
            loading={loading}
          />
        )}
      </div>
    </div>
  )
}
