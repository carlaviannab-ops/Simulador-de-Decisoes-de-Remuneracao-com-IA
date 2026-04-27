import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Spinner } from '../components/Spinner'
import type { Simulacao, NivelRisco } from '../types'

function CopiarBotao({ texto }: { texto: string }) {
  const [copiado, setCopiado] = useState(false)
  const copiar = () => {
    navigator.clipboard.writeText(texto)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }
  return (
    <button
      onClick={copiar}
      className="text-xs px-3 py-1.5 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
    >
      {copiado ? '✓ Copiado!' : 'Copiar texto'}
    </button>
  )
}

const formatBRL = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)

const riscoCor: Record<NivelRisco, string> = {
  baixo: 'bg-green-100 text-green-700',
  medio: 'bg-yellow-100 text-yellow-700',
  alto: 'bg-red-100 text-red-700',
}

export function Resultado() {
  const { id } = useParams<{ id: string }>()
  const [simulacao, setSimulacao] = useState<Simulacao | null>(null)
  const [loading, setLoading] = useState(true)
  const [auditoria, setAuditoria] = useState({ decisao: '', registradoPor: '', observacao: '' })
  const [salvandoAuditoria, setSalvandoAuditoria] = useState(false)
  const [auditoriaSalva, setAuditoriaSalva] = useState(false)

  useEffect(() => {
    if (!id) return
    supabase
      .from('simulacoes')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data }) => {
        setSimulacao(data)
        if (data?.decisao_final) {
          setAuditoria({
            decisao: data.decisao_final,
            registradoPor: data.registrado_por ?? '',
            observacao: data.observacao_aprovador ?? '',
          })
          setAuditoriaSalva(true)
        }
        setLoading(false)
      })
  }, [id])

  const salvarAuditoria = async () => {
    if (!id || !auditoria.decisao || !auditoria.registradoPor) return
    setSalvandoAuditoria(true)
    await supabase.from('simulacoes').update({
      decisao_final: auditoria.decisao,
      registrado_por: auditoria.registradoPor,
      observacao_aprovador: auditoria.observacao || null,
      registrado_em: new Date().toISOString(),
    }).eq('id', id)
    setSalvandoAuditoria(false)
    setAuditoriaSalva(true)
  }

  if (loading) return <Spinner />

  const r = simulacao?.resultado
  if (!simulacao || !r) {
    return (
      <div className="text-center py-16 text-gray-500">
        Resultado não disponível.
        <br />
        <Link to="/dashboard" className="mt-4 inline-block text-sm text-blue-600 hover:underline">
          Voltar ao Dashboard
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Resultado da Simulação</h1>
        <Link to="/dashboard" className="text-sm text-blue-600 hover:underline">← Dashboard</Link>
      </div>

      {/* Resumo */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
        <h2 className="font-semibold text-blue-900 mb-2">Resumo do Cenário</h2>
        <p className="text-blue-800 text-sm leading-relaxed">{r.resumo_cenario}</p>
      </div>

      {/* Simulação financeira */}
      <div className="border border-gray-200 rounded-xl p-5">
        <h2 className="font-semibold text-gray-900 mb-3">Simulação Financeira</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 text-gray-500 font-medium">Cenário</th>
                <th className="text-right py-2 text-gray-500 font-medium">Salário Mensal</th>
                <th className="text-right py-2 text-gray-500 font-medium">Variação</th>
                <th className="text-right py-2 text-gray-500 font-medium">Custo Anual Adicional</th>
              </tr>
            </thead>
            <tbody>
              {r.simulacao_financeira.tabela.map((row, i) => (
                <tr key={i} className="border-b border-gray-100 last:border-0">
                  <td className="py-2 font-medium text-gray-800">{row.cenario}</td>
                  <td className="py-2 text-right text-gray-700">{formatBRL(row.salario_mensal)}</td>
                  <td className="py-2 text-right text-gray-700">{row.variacao_percentual > 0 ? '+' : ''}{row.variacao_percentual}%</td>
                  <td className="py-2 text-right text-gray-700">{formatBRL(row.custo_anual_incremental)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {r.simulacao_financeira.nota && (
          <p className="text-xs text-gray-400 mt-3 italic">{r.simulacao_financeira.nota}</p>
        )}
      </div>

      {/* Benchmark */}
      <div className="border border-gray-200 rounded-xl p-5">
        <h2 className="font-semibold text-gray-900 mb-3">Benchmark de Mercado</h2>
        <div className="grid grid-cols-4 gap-2 mb-4">
          {(['p25', 'p50', 'p75', 'p90'] as const).map(p => (
            <div key={p} className="text-center bg-gray-50 rounded-lg py-2 px-1">
              <p className="text-xs text-gray-400 uppercase">{p.toUpperCase()}</p>
              <p className="font-bold text-gray-900 text-sm">{formatBRL(r.benchmark_mercado[p])}</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-600">{r.benchmark_mercado.posicionamento_proposto}</p>
        {r.benchmark_mercado.nota && (
          <p className="text-xs text-gray-400 mt-2 italic">{r.benchmark_mercado.nota}</p>
        )}
      </div>

      {/* Equidade interna */}
      <div className="border border-gray-200 rounded-xl p-5">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-semibold text-gray-900">Equidade Interna</h2>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${riscoCor[r.equidade_interna.risco_distorcao]}`}>
            Risco {r.equidade_interna.risco_distorcao}
          </span>
        </div>
        <p className="text-sm text-gray-700 leading-relaxed">{r.equidade_interna.analise}</p>
        <p className="text-sm text-gray-600 mt-2 italic">{r.equidade_interna.recomendacao_equidade}</p>
      </div>

      {/* Riscos */}
      {r.riscos.length > 0 && (
        <div className="border border-gray-200 rounded-xl p-5">
          <h2 className="font-semibold text-gray-900 mb-3">Riscos Identificados</h2>
          <div className="space-y-3">
            {r.riscos.map((risco, i) => (
              <div key={i} className="flex gap-3">
                <span className={`shrink-0 text-xs font-bold px-2 py-0.5 h-fit rounded-full ${riscoCor[risco.nivel]}`}>
                  {risco.nivel}
                </span>
                <div>
                  <p className="text-sm font-medium text-gray-900">{risco.risco}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{risco.descricao}</p>
                  <p className="text-xs text-gray-600 mt-1"><span className="font-medium">Mitigação:</span> {risco.mitigacao}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recomendação */}
      <div className="bg-blue-600 text-white rounded-xl p-5">
        <h2 className="font-semibold mb-1">Recomendação</h2>
        <p className="text-2xl font-bold mb-2">{r.recomendacao.decisao}</p>
        <p className="text-blue-100 text-sm mb-3">{r.recomendacao.justificativa}</p>
        <div className="flex flex-wrap gap-4 text-sm">
          <div>
            <span className="text-blue-300 text-xs">Salário recomendado</span>
            <p className="font-bold">{formatBRL(r.recomendacao.salario_recomendado)}</p>
          </div>
          <div>
            <span className="text-blue-300 text-xs">Urgência</span>
            <p className="font-bold capitalize">{r.recomendacao.urgencia}</p>
          </div>
        </div>
        {r.recomendacao.condicoes && (
          <p className="text-blue-100 text-xs mt-3 italic">{r.recomendacao.condicoes}</p>
        )}
      </div>

      {/* Conclusão */}
      <div className="border border-gray-200 rounded-xl p-5">
        <h2 className="font-semibold text-gray-900 mb-2">Conclusão Estratégica</h2>
        <p className="text-sm text-gray-700 leading-relaxed">{r.conclusao_estrategica}</p>
      </div>

      {/* Comunicação ao colaborador */}
      {r.comunicacao_colaborador && (
        <div className="border border-emerald-200 bg-emerald-50 rounded-xl p-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h2 className="font-semibold text-emerald-900">Como comunicar ao colaborador</h2>
              <p className="text-xs text-emerald-600 mt-0.5">Tom recomendado: {r.comunicacao_colaborador.tom}</p>
            </div>
            <CopiarBotao texto={r.comunicacao_colaborador.texto} />
          </div>

          {r.comunicacao_colaborador.pontos_chave.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-semibold text-emerald-800 mb-1.5">Pontos-chave da conversa:</p>
              <ul className="space-y-1">
                {r.comunicacao_colaborador.pontos_chave.map((ponto, i) => (
                  <li key={i} className="text-xs text-emerald-800 flex gap-2">
                    <span className="shrink-0 font-bold">{i + 1}.</span>
                    <span>{ponto}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="bg-white border border-emerald-200 rounded-lg p-4 mt-3">
            <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{r.comunicacao_colaborador.texto}</p>
          </div>
        </div>
      )}

      {/* Registrar decisão — trilha de auditoria */}
      <div className="border border-gray-200 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-1">
          <h2 className="font-semibold text-gray-900">Registrar Decisão Final</h2>
          {auditoriaSalva && (
            <span className="text-xs bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full">Registrada</span>
          )}
        </div>
        <p className="text-xs text-gray-500 mb-4">
          Documente o que foi decidido. Esse registro fica salvo na trilha de auditoria da simulação.
        </p>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Decisão tomada <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={auditoria.decisao}
              onChange={e => setAuditoria(a => ({ ...a, decisao: e.target.value }))}
              disabled={auditoriaSalva}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
              placeholder="Ex: Aprovado aumento para R$ 16.000 a partir de maio"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Registrado por <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={auditoria.registradoPor}
              onChange={e => setAuditoria(a => ({ ...a, registradoPor: e.target.value }))}
              disabled={auditoriaSalva}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
              placeholder="Ex: Carla Vianna — Gerente de RH"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Observação (opcional)</label>
            <textarea
              rows={2}
              value={auditoria.observacao}
              onChange={e => setAuditoria(a => ({ ...a, observacao: e.target.value }))}
              disabled={auditoriaSalva}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none disabled:bg-gray-50 disabled:text-gray-500"
              placeholder="Contexto adicional, condições, próximos passos..."
            />
          </div>
        </div>

        {!auditoriaSalva && (
          <button
            onClick={salvarAuditoria}
            disabled={salvandoAuditoria || !auditoria.decisao || !auditoria.registradoPor}
            className="mt-4 px-5 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {salvandoAuditoria ? 'Salvando...' : 'Registrar decisão'}
          </button>
        )}

        {auditoriaSalva && simulacao?.registrado_em && (
          <p className="mt-3 text-xs text-gray-400">
            Registrado em {new Date(simulacao.registrado_em).toLocaleString('pt-BR')}
          </p>
        )}
      </div>
    </div>
  )
}
