import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import type { RadarPosicao, BenchmarkData, StatusAlerta } from '../types'

const formatBRL = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)

const alertaCfg: Record<StatusAlerta, { label: string; cls: string; dot: string }> = {
  critico: { label: 'Crítico', cls: 'bg-red-100 text-red-700', dot: 'bg-red-500' },
  atencao: { label: 'Atenção', cls: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-500' },
  ok: { label: 'Saudável', cls: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
  pendente: { label: 'Pendente', cls: 'bg-gray-100 text-gray-500', dot: 'bg-gray-400' },
}

function calcularAlerta(salario: number, bm: BenchmarkData): StatusAlerta {
  if (salario < bm.p25) return 'critico'
  if (salario < bm.p50) return 'atencao'
  return 'ok'
}

const setores = ['Tecnologia', 'Saúde', 'Educação', 'Varejo', 'Financeiro', 'Indústria', 'Serviços', 'Agronegócio', 'Outro']
const estados = ['SP', 'RJ', 'MG', 'RS', 'PR', 'SC', 'BA', 'DF', 'GO', 'PE', 'CE', 'AM', 'PA', 'ES', 'MT', 'MS']

const formVazio = { cargo: '', nivel_senioridade: '', setor: 'Tecnologia', estado: 'SP', regime: 'clt', salario_atual: '' }

export function Radar() {
  const { user } = useAuth()
  const [posicoes, setPosicoes] = useState<RadarPosicao[]>([])
  const [loading, setLoading] = useState(true)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [form, setForm] = useState(formVazio)
  const [salvando, setSalvando] = useState(false)
  const [verificando, setVerificando] = useState<string | null>(null)
  const [erro, setErro] = useState('')

  useEffect(() => {
    if (!user) return
    supabase
      .from('radar_posicoes')
      .select('*')
      .eq('user_id', user.id)
      .order('criado_em', { ascending: false })
      .then(({ data }) => {
        setPosicoes((data as RadarPosicao[]) ?? [])
        setLoading(false)
      })
  }, [user])

  async function verificarBenchmark(posicaoId: string, cargo: string, nivel_senioridade: string | undefined, setor: string, estado: string, regime: string, salario_atual: number) {
    setVerificando(posicaoId)
    try {
      const { data, error } = await supabase.functions.invoke('simulate', {
        body: { _benchmark_only: true, cargo, nivel_senioridade, setor, estado, regime },
      })
      if (error || !data?.p50) throw new Error('Falha na verificação')

      const bm = data as BenchmarkData
      const status = calcularAlerta(salario_atual, bm)

      await supabase.from('radar_posicoes').update({
        benchmark: bm,
        status_alerta: status,
        atualizado_em: new Date().toISOString(),
      }).eq('id', posicaoId)

      setPosicoes(prev => prev.map(p =>
        p.id === posicaoId ? { ...p, benchmark: bm, status_alerta: status, atualizado_em: new Date().toISOString() } : p
      ))
    } catch {
      setErro('Erro ao verificar benchmark. Tente novamente.')
      setTimeout(() => setErro(''), 4000)
    } finally {
      setVerificando(null)
    }
  }

  async function adicionar() {
    if (!user || !form.cargo || !form.setor || !form.salario_atual) return
    setSalvando(true)
    setErro('')

    const salario_atual = Number(form.salario_atual)
    const { data, error } = await supabase.from('radar_posicoes').insert({
      user_id: user.id,
      cargo: form.cargo,
      nivel_senioridade: form.nivel_senioridade || null,
      setor: form.setor,
      estado: form.estado,
      regime: form.regime,
      salario_atual,
      status_alerta: 'pendente',
    }).select().single()

    if (error || !data) {
      setErro('Erro ao adicionar cargo.')
      setSalvando(false)
      return
    }

    const nova = data as RadarPosicao
    setPosicoes(prev => [nova, ...prev])
    setForm(formVazio)
    setMostrarForm(false)
    setSalvando(false)

    // Verificar benchmark automaticamente
    verificarBenchmark(nova.id, nova.cargo, nova.nivel_senioridade, nova.setor, nova.estado, nova.regime, nova.salario_atual)
  }

  async function remover(id: string) {
    await supabase.from('radar_posicoes').delete().eq('id', id)
    setPosicoes(prev => prev.filter(p => p.id !== id))
  }

  const criticos = posicoes.filter(p => p.status_alerta === 'critico').length
  const atencao = posicoes.filter(p => p.status_alerta === 'atencao').length
  const saudaveis = posicoes.filter(p => p.status_alerta === 'ok').length

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Radar Salarial</h1>
          <p className="text-gray-500 text-sm mt-1">Monitore cargos e receba alertas quando salários estiverem fora do mercado.</p>
        </div>
        <button
          onClick={() => setMostrarForm(v => !v)}
          className="flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" d="M12 4v16m8-8H4" />
          </svg>
          Monitorar cargo
        </button>
      </div>

      {/* Resumo */}
      {posicoes.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Críticos', val: criticos, cls: 'text-red-600', bg: 'bg-red-50' },
            { label: 'Atenção', val: atencao, cls: 'text-yellow-600', bg: 'bg-yellow-50' },
            { label: 'Saudáveis', val: saudaveis, cls: 'text-green-600', bg: 'bg-green-50' },
          ].map(s => (
            <div key={s.label} className={`${s.bg} rounded-xl px-5 py-4`}>
              <p className={`text-2xl font-bold ${s.cls}`}>{s.val}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {erro && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">{erro}</div>
      )}

      {/* Formulário */}
      {mostrarForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Adicionar cargo para monitoramento</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-medium text-gray-600 mb-1">Cargo *</label>
              <input
                value={form.cargo}
                onChange={e => setForm(f => ({ ...f, cargo: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: Desenvolvedor Backend"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Nível de senioridade</label>
              <input
                value={form.nivel_senioridade}
                onChange={e => setForm(f => ({ ...f, nivel_senioridade: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: Pleno, Sênior"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Setor *</label>
              <select
                value={form.setor}
                onChange={e => setForm(f => ({ ...f, setor: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {setores.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Estado</label>
              <select
                value={form.estado}
                onChange={e => setForm(f => ({ ...f, estado: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {estados.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Regime</label>
              <select
                value={form.regime}
                onChange={e => setForm(f => ({ ...f, regime: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="clt">CLT</option>
                <option value="pj">PJ</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Salário atual (R$) *</label>
              <input
                type="number"
                value={form.salario_atual}
                onChange={e => setForm(f => ({ ...f, salario_atual: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: 10000"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={adicionar}
              disabled={salvando || !form.cargo || !form.salario_atual}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {salvando ? 'Adicionando...' : 'Adicionar e verificar'}
            </button>
            <button
              onClick={() => { setMostrarForm(false); setForm(formVazio) }}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Lista */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-blue-600" />
        </div>
      ) : posicoes.length === 0 ? (
        <div className="bg-white text-center py-16 border-2 border-dashed border-gray-200 rounded-xl">
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <p className="text-gray-500 font-medium">Nenhum cargo monitorado</p>
          <p className="text-gray-400 text-sm mt-1 mb-4">Adicione cargos para receber alertas de mercado</p>
          <button onClick={() => setMostrarForm(true)} className="text-sm text-blue-600 font-medium hover:underline">
            Monitorar primeiro cargo
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {posicoes.map(p => {
            const alerta = alertaCfg[p.status_alerta]
            const isVerificando = verificando === p.id
            const pctVsMediana = p.benchmark?.p50
              ? Math.round(((p.salario_atual - p.benchmark.p50) / p.benchmark.p50) * 100)
              : null

            return (
              <div key={p.id} className="bg-white border border-gray-200 rounded-xl p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${alerta.dot}`} />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-gray-900">{p.cargo}</h3>
                        {p.nivel_senioridade && (
                          <span className="text-xs text-gray-500">{p.nivel_senioridade}</span>
                        )}
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${alerta.cls}`}>
                          {alerta.label}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">{p.setor} · {p.estado} · {p.regime.toUpperCase()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => verificarBenchmark(p.id, p.cargo, p.nivel_senioridade, p.setor, p.estado, p.regime, p.salario_atual)}
                      disabled={isVerificando}
                      className="text-xs px-3 py-1.5 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors"
                    >
                      {isVerificando ? 'Verificando...' : 'Atualizar'}
                    </button>
                    <Link
                      to={`/simulacao/nova?tipo=aumento&cargo=${encodeURIComponent(p.cargo)}&salario=${p.salario_atual}`}
                      className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Simular
                    </Link>
                    <button
                      onClick={() => remover(p.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-6 flex-wrap">
                  <div>
                    <p className="text-xs text-gray-400">Salário atual</p>
                    <p className="font-bold text-gray-900">{formatBRL(p.salario_atual)}</p>
                  </div>
                  {p.benchmark ? (
                    <>
                      {(['p25', 'p50', 'p75', 'p90'] as const).map(k => (
                        <div key={k}>
                          <p className="text-xs text-gray-400 uppercase">{k}</p>
                          <p className="font-medium text-gray-700 text-sm">{formatBRL(p.benchmark![k])}</p>
                        </div>
                      ))}
                      {pctVsMediana !== null && (
                        <div>
                          <p className="text-xs text-gray-400">vs. mediana</p>
                          <p className={`font-bold text-sm ${pctVsMediana >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {pctVsMediana >= 0 ? '+' : ''}{pctVsMediana}%
                          </p>
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-sm text-gray-400 italic">
                      {isVerificando ? 'Consultando IA...' : 'Benchmark não verificado'}
                    </p>
                  )}
                </div>

                {p.atualizado_em && (
                  <p className="text-xs text-gray-300 mt-3">
                    Atualizado em {new Date(p.atualizado_em).toLocaleDateString('pt-BR')}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
