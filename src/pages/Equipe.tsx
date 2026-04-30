import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import type { MembroEquipe, BenchmarkData, StatusAlerta } from '../types'

const formatBRL = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)

const statusCfg: Record<StatusAlerta, { label: string; cls: string; dot: string }> = {
  critico: { label: 'Crítico', cls: 'bg-red-100 text-red-700', dot: 'bg-red-500' },
  atencao: { label: 'Atenção', cls: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-400' },
  ok: { label: 'Saudável', cls: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
  pendente: { label: 'Pendente', cls: 'bg-gray-100 text-gray-500', dot: 'bg-gray-400' },
}

function calcularStatus(salario: number, bm: BenchmarkData): StatusAlerta {
  if (salario < bm.p25) return 'critico'
  if (salario < bm.p50) return 'atencao'
  return 'ok'
}

const setores = ['Tecnologia', 'Saúde', 'Educação', 'Varejo', 'Financeiro', 'Indústria', 'Serviços', 'Agronegócio', 'Outro']
const estados = ['SP', 'RJ', 'MG', 'RS', 'PR', 'SC', 'BA', 'DF', 'GO', 'PE', 'CE', 'AM', 'PA', 'ES', 'MT', 'MS']

const formVazio = {
  nome: '', cargo: '', nivel_senioridade: '', area: '',
  setor: 'Tecnologia', estado: 'SP', regime: 'clt',
  salario_atual: '', data_admissao: '',
}

export function Equipe() {
  const { user } = useAuth()
  const [membros, setMembros] = useState<MembroEquipe[]>([])
  const [loading, setLoading] = useState(true)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [form, setForm] = useState(formVazio)
  const [salvando, setSalvando] = useState(false)
  const [verificando, setVerificando] = useState<string | null>(null)
  const [erro, setErro] = useState('')

  useEffect(() => {
    if (!user) return
    supabase
      .from('equipe')
      .select('*')
      .eq('user_id', user.id)
      .order('criado_em', { ascending: false })
      .then(({ data }) => {
        setMembros((data as MembroEquipe[]) ?? [])
        setLoading(false)
      })
  }, [user])

  async function verificarBenchmark(membroId: string, cargo: string, nivel: string | undefined, setor: string, estado: string, regime: string, salario: number) {
    setVerificando(membroId)
    try {
      const { data, error } = await supabase.functions.invoke('simulate', {
        body: { _benchmark_only: true, cargo, nivel_senioridade: nivel, setor, estado, regime },
      })
      if (error || !data?.p50) throw new Error('Falha')

      const bm = data as BenchmarkData
      const status = calcularStatus(salario, bm)

      await supabase.from('equipe').update({ benchmark: bm, status_salarial: status }).eq('id', membroId)
      setMembros(prev => prev.map(m =>
        m.id === membroId ? { ...m, benchmark: bm, status_salarial: status } : m
      ))
    } catch {
      setErro('Erro ao verificar benchmark. Tente novamente.')
      setTimeout(() => setErro(''), 4000)
    } finally {
      setVerificando(null)
    }
  }

  async function adicionar() {
    if (!user || !form.nome || !form.cargo || !form.salario_atual) return
    setSalvando(true)
    setErro('')

    const salario_atual = Number(form.salario_atual)
    const { data, error } = await supabase.from('equipe').insert({
      user_id: user.id,
      nome: form.nome,
      cargo: form.cargo,
      nivel_senioridade: form.nivel_senioridade || null,
      area: form.area || null,
      setor: form.setor,
      estado: form.estado,
      regime: form.regime,
      salario_atual,
      data_admissao: form.data_admissao || null,
      status_salarial: 'pendente',
    }).select().single()

    if (error || !data) {
      setErro('Erro ao adicionar membro.')
      setSalvando(false)
      return
    }

    const novo = data as MembroEquipe
    setMembros(prev => [novo, ...prev])
    setForm(formVazio)
    setMostrarForm(false)
    setSalvando(false)

    verificarBenchmark(novo.id, novo.cargo, novo.nivel_senioridade, novo.setor, novo.estado, novo.regime, novo.salario_atual)
  }

  async function remover(id: string) {
    await supabase.from('equipe').delete().eq('id', id)
    setMembros(prev => prev.filter(m => m.id !== id))
  }

  const criticos = membros.filter(m => m.status_salarial === 'critico').length
  const atencao = membros.filter(m => m.status_salarial === 'atencao').length
  const saudaveis = membros.filter(m => m.status_salarial === 'ok').length

  function iniciais(nome: string) {
    return nome.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Modo Gestor — Minha Equipe</h1>
          <p className="text-gray-500 text-sm mt-1">Acompanhe a saúde salarial dos seus diretos e dispare simulações rapidamente.</p>
        </div>
        <button
          onClick={() => setMostrarForm(v => !v)}
          className="flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" d="M12 4v16m8-8H4" />
          </svg>
          Adicionar membro
        </button>
      </div>

      {/* Resumo */}
      {membros.length > 0 && (
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Total', val: membros.length, cls: 'text-gray-800', bg: 'bg-gray-50' },
            { label: 'Em risco crítico', val: criticos, cls: 'text-red-600', bg: 'bg-red-50' },
            { label: 'Abaixo da mediana', val: atencao, cls: 'text-yellow-600', bg: 'bg-yellow-50' },
            { label: 'Saudáveis', val: saudaveis, cls: 'text-green-600', bg: 'bg-green-50' },
          ].map(s => (
            <div key={s.label} className={`${s.bg} rounded-xl px-4 py-3`}>
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
          <h2 className="font-semibold text-gray-900 mb-4">Adicionar membro da equipe</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Nome *</label>
              <input value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: Ana Silva" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Cargo *</label>
              <input value={form.cargo} onChange={e => setForm(f => ({ ...f, cargo: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: Desenvolvedor Backend" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Nível de senioridade</label>
              <input value={form.nivel_senioridade} onChange={e => setForm(f => ({ ...f, nivel_senioridade: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: Pleno, Sênior" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Área / Time</label>
              <input value={form.area} onChange={e => setForm(f => ({ ...f, area: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: Engenharia, Produto" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Salário atual (R$) *</label>
              <input type="number" value={form.salario_atual} onChange={e => setForm(f => ({ ...f, salario_atual: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: 10000" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Data de admissão</label>
              <input type="date" value={form.data_admissao} onChange={e => setForm(f => ({ ...f, data_admissao: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Setor</label>
              <select value={form.setor} onChange={e => setForm(f => ({ ...f, setor: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                {setores.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Estado / Regime</label>
              <div className="flex gap-2">
                <select value={form.estado} onChange={e => setForm(f => ({ ...f, estado: e.target.value }))}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {estados.map(s => <option key={s}>{s}</option>)}
                </select>
                <select value={form.regime} onChange={e => setForm(f => ({ ...f, regime: e.target.value }))}
                  className="w-20 border border-gray-300 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="clt">CLT</option>
                  <option value="pj">PJ</option>
                </select>
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={adicionar} disabled={salvando || !form.nome || !form.cargo || !form.salario_atual}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              {salvando ? 'Adicionando...' : 'Adicionar'}
            </button>
            <button onClick={() => { setMostrarForm(false); setForm(formVazio) }}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Tabela */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-blue-600" />
        </div>
      ) : membros.length === 0 ? (
        <div className="bg-white text-center py-16 border-2 border-dashed border-gray-200 rounded-xl">
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <p className="text-gray-500 font-medium">Nenhum membro cadastrado</p>
          <p className="text-gray-400 text-sm mt-1 mb-4">Adicione seus diretos para monitorar a saúde salarial da equipe</p>
          <button onClick={() => setMostrarForm(true)} className="text-sm text-blue-600 font-medium hover:underline">
            Adicionar primeiro membro
          </button>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Membro</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Salário</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Benchmark P50</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {membros.map((m, i) => {
                const status = statusCfg[m.status_salarial]
                const isV = verificando === m.id
                const pct = m.benchmark?.p50
                  ? Math.round(((m.salario_atual - m.benchmark.p50) / m.benchmark.p50) * 100)
                  : null

                return (
                  <tr key={m.id} className={`${i !== 0 ? 'border-t border-gray-100' : ''} hover:bg-gray-50`}>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-700 shrink-0">
                          {iniciais(m.nome)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{m.nome}</p>
                          <p className="text-xs text-gray-400">{m.cargo}{m.nivel_senioridade ? ` · ${m.nivel_senioridade}` : ''}{m.area ? ` · ${m.area}` : ''}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 hidden sm:table-cell">
                      <p className="text-sm font-semibold text-gray-900">{formatBRL(m.salario_atual)}</p>
                      <p className="text-xs text-gray-400">{m.regime.toUpperCase()} · {m.estado}</p>
                    </td>
                    <td className="px-4 py-3.5 hidden md:table-cell">
                      {m.benchmark ? (
                        <div>
                          <p className="text-sm font-medium text-gray-700">{formatBRL(m.benchmark.p50)}</p>
                          {pct !== null && (
                            <p className={`text-xs font-semibold ${pct >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {pct >= 0 ? '+' : ''}{pct}% vs. mediana
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic">{isV ? 'Verificando...' : '—'}</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${status.cls}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5 justify-end">
                        <button
                          onClick={() => verificarBenchmark(m.id, m.cargo, m.nivel_senioridade, m.setor, m.estado, m.regime, m.salario_atual)}
                          disabled={isV}
                          className="text-xs px-2.5 py-1 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors"
                        >
                          {isV ? '...' : 'Verificar'}
                        </button>
                        <Link
                          to={`/simulacao/nova?tipo=aumento&cargo=${encodeURIComponent(m.cargo)}&salario=${m.salario_atual}`}
                          className="text-xs px-2.5 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Simular
                        </Link>
                        <button onClick={() => remover(m.id)} className="p-1 text-gray-400 hover:text-red-500 transition-colors">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
