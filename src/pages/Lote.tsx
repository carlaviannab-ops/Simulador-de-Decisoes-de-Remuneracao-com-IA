import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import type { Simulacao } from '../types'

const TEMPLATE_CSV = `nome,cargo,cargo_proposto,nivel_senioridade,salario_atual,salario_proposto,tipo,regime,setor,estado
Ana Silva,Desenvolvedor Backend,Desenvolvedor Senior,Pleno,8000,12000,promocao,clt,Tecnologia,SP
Carlos Lima,Analista de RH,,Junior,4500,5500,aumento,clt,Servicos,RJ
Maria Souza,Gerente de Produto,,Senior,18000,22000,aumento,clt,Tecnologia,SP`

const tipoValidos = ['promocao', 'aumento', 'contratacao', 'ajuste_faixa', 'contraproposta']
const tipoLabel: Record<string, string> = {
  promocao: 'Promoção', aumento: 'Aumento', contratacao: 'Contratação',
  ajuste_faixa: 'Ajuste Faixa', contraproposta: 'Contraproposta',
}
const statusCls: Record<string, string> = {
  concluido: 'bg-green-100 text-green-700',
  erro: 'bg-red-100 text-red-700',
  processando: 'bg-yellow-100 text-yellow-700',
}

interface LinhaParsed {
  nome?: string
  cargo: string
  cargo_proposto?: string
  nivel_senioridade?: string
  salario_atual: number
  salario_proposto: number
  tipo: string
  regime: string
  setor: string
  estado: string
  _erro?: string
}

function parseCSV(texto: string): LinhaParsed[] {
  const linhas = texto.trim().split('\n').filter(l => l.trim())
  if (linhas.length < 2) return []

  const headers = linhas[0].split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''))
  return linhas.slice(1).map(linha => {
    const vals = linha.split(',').map(v => v.trim().replace(/"/g, ''))
    const obj = Object.fromEntries(headers.map((h, i) => [h, vals[i] ?? '']))

    const salario_atual = Number(obj.salario_atual)
    const salario_proposto = Number(obj.salario_proposto)

    const erros: string[] = []
    if (!obj.cargo) erros.push('cargo obrigatório')
    if (!salario_atual || salario_atual <= 0) erros.push('salario_atual inválido')
    if (!salario_proposto || salario_proposto <= 0) erros.push('salario_proposto inválido')
    if (!tipoValidos.includes(obj.tipo)) erros.push(`tipo inválido: "${obj.tipo}"`)

    return {
      nome: obj.nome || undefined,
      cargo: obj.cargo || '',
      cargo_proposto: obj.cargo_proposto || undefined,
      nivel_senioridade: obj.nivel_senioridade || undefined,
      salario_atual,
      salario_proposto,
      tipo: obj.tipo || 'aumento',
      regime: obj.regime || 'clt',
      setor: obj.setor || 'Tecnologia',
      estado: obj.estado || 'SP',
      _erro: erros.length > 0 ? erros.join(', ') : undefined,
    }
  })
}

function baixarTemplate() {
  const blob = new Blob([TEMPLATE_CSV], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'template_lote_remunaia.csv'
  a.click()
  URL.revokeObjectURL(url)
}

type Step = 1 | 2 | 3

export function Lote() {
  const { user } = useAuth()
  const fileRef = useRef<HTMLInputElement>(null)
  const [step, setStep] = useState<Step>(1)
  const [csvTexto, setCsvTexto] = useState('')
  const [linhas, setLinhas] = useState<LinhaParsed[]>([])
  const [progresso, setProgresso] = useState(0)
  const [resultados, setResultados] = useState<Simulacao[]>([])
  const [errosCount, setErrosCount] = useState(0)
  const [loteId, setLoteId] = useState<string | null>(null)
  const [erroProcAcesso, setErroProcAcesso] = useState('')

  function handleTexto(texto: string) {
    setCsvTexto(texto)
    setLinhas(parseCSV(texto))
  }

  function handleArquivo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => handleTexto(ev.target?.result as string)
    reader.readAsText(file, 'UTF-8')
  }

  const linhasValidas = linhas.filter(l => !l._erro)

  async function processar() {
    if (!user || linhasValidas.length === 0) return
    setStep(2)
    setProgresso(0)
    setErrosCount(0)
    setErroProcAcesso('')

    const { data: lote, error: loteErr } = await supabase.from('lotes').insert({
      user_id: user.id,
      nome: `Lote ${new Date().toLocaleDateString('pt-BR')} — ${linhasValidas.length} itens`,
      total: linhasValidas.length,
      status: 'processando',
    }).select().single()

    if (loteErr || !lote) {
      setErroProcAcesso('Erro ao criar lote. Tente novamente.')
      setStep(1)
      return
    }

    setLoteId(lote.id)
    let processados = 0
    let erros = 0

    for (const linha of linhasValidas) {
      try {
        const { error } = await supabase.functions.invoke('simulate', {
          body: {
            tipo: linha.tipo,
            cargo_atual: linha.cargo,
            cargo_proposto: linha.cargo_proposto,
            salario_atual: linha.salario_atual,
            salario_proposto: linha.salario_proposto,
            regime: linha.regime,
            setor: linha.setor,
            estado: linha.estado,
            nivel_senioridade: linha.nivel_senioridade,
            budget_informado: false,
            pares_existem: false,
            _lote_id: lote.id,
          },
        })

        if (error) {
          if ((error as { message?: string }).message?.includes('limite_atingido')) {
            setErroProcAcesso('Limite de simulações atingido. Processamento interrompido.')
            break
          }
          erros++
        } else {
          processados++
        }
      } catch {
        erros++
      }

      setProgresso(processados + erros)
      setErrosCount(erros)
      await supabase.from('lotes').update({ processados, erros }).eq('id', lote.id)

      // Pausa entre chamadas para não saturar a API
      await new Promise(r => setTimeout(r, 800))
    }

    await supabase.from('lotes').update({ status: 'concluido' }).eq('id', lote.id)

    // Buscar simulações do lote
    const { data: sims } = await supabase
      .from('simulacoes')
      .select('*')
      .eq('lote_id', lote.id)
      .order('criado_em', { ascending: true })

    setResultados((sims as Simulacao[]) ?? [])
    setStep(3)
  }

  const formatBRL = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Análise em Lote</h1>
        <p className="text-gray-500 text-sm mt-1">Processe múltiplos colaboradores de uma vez via planilha CSV.</p>
      </div>

      {/* Steps */}
      <div className="flex items-center gap-2">
        {[
          { n: 1, label: 'Upload' },
          { n: 2, label: 'Processando' },
          { n: 3, label: 'Resultados' },
        ].map(({ n, label }, i) => (
          <div key={n} className="flex items-center gap-2">
            {i > 0 && <div className={`h-px w-8 ${step > i ? 'bg-blue-500' : 'bg-gray-200'}`} />}
            <div className={`flex items-center gap-1.5 text-sm font-medium ${step === n ? 'text-blue-600' : step > n ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step === n ? 'bg-blue-600 text-white' : step > n ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                {step > n ? '✓' : n}
              </div>
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* Step 1: Upload */}
      {step === 1 && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">Formato esperado do CSV</p>
              <p className="text-blue-700">Colunas obrigatórias: <code className="bg-blue-100 px-1 rounded">cargo, salario_atual, salario_proposto, tipo, setor, estado</code></p>
              <p className="text-blue-700 mt-0.5">Opcionais: nome, cargo_proposto, nivel_senioridade, regime (padrão: clt)</p>
              <p className="text-blue-700 mt-0.5">Tipos válidos: <code className="bg-blue-100 px-1 rounded">promocao, aumento, contratacao, ajuste_faixa, contraproposta</code></p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={baixarTemplate}
              className="flex items-center gap-2 text-sm text-blue-600 border border-blue-300 px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Baixar template
            </button>
            <button
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-2 text-sm text-gray-700 border border-gray-300 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Carregar arquivo CSV
            </button>
            <input ref={fileRef} type="file" accept=".csv,text/csv" onChange={handleArquivo} className="hidden" />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Ou cole o conteúdo CSV aqui</label>
            <textarea
              rows={8}
              value={csvTexto}
              onChange={e => handleTexto(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder={TEMPLATE_CSV}
            />
          </div>

          {linhas.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-gray-700">
                  {linhas.length} linha(s) detectadas · {linhasValidas.length} válidas · {linhas.length - linhasValidas.length} com erro
                </p>
              </div>
              <div className="overflow-x-auto border border-gray-200 rounded-xl">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      {['Nome', 'Cargo', 'Salário Atual', 'Salário Proposto', 'Tipo', 'Setor', 'Estado', 'Status'].map(h => (
                        <th key={h} className="text-left px-3 py-2 text-xs font-semibold text-gray-500">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {linhas.slice(0, 10).map((l, i) => (
                      <tr key={i} className={`border-b border-gray-100 last:border-0 ${l._erro ? 'bg-red-50' : ''}`}>
                        <td className="px-3 py-2 text-gray-600">{l.nome || '—'}</td>
                        <td className="px-3 py-2 font-medium text-gray-900">{l.cargo || '—'}</td>
                        <td className="px-3 py-2 text-gray-600">{l.salario_atual ? formatBRL(l.salario_atual) : '—'}</td>
                        <td className="px-3 py-2 text-gray-600">{l.salario_proposto ? formatBRL(l.salario_proposto) : '—'}</td>
                        <td className="px-3 py-2 text-gray-600">{tipoLabel[l.tipo] ?? l.tipo}</td>
                        <td className="px-3 py-2 text-gray-600">{l.setor}</td>
                        <td className="px-3 py-2 text-gray-600">{l.estado}</td>
                        <td className="px-3 py-2">
                          {l._erro
                            ? <span className="text-xs text-red-600">Erro: {l._erro}</span>
                            : <span className="text-xs text-green-600 font-medium">✓ Válido</span>
                          }
                        </td>
                      </tr>
                    ))}
                    {linhas.length > 10 && (
                      <tr>
                        <td colSpan={8} className="px-3 py-2 text-xs text-gray-400 text-center">
                          +{linhas.length - 10} linhas adicionais
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {erroProcAcesso && (
                <div className="mt-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">{erroProcAcesso}</div>
              )}

              <button
                onClick={processar}
                disabled={linhasValidas.length === 0}
                className="mt-4 flex items-center gap-2 bg-blue-600 text-white font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Processar {linhasValidas.length} simulaç{linhasValidas.length === 1 ? 'ão' : 'ões'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Step 2: Processando */}
      {step === 2 && (
        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
          <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-blue-600" />
          </div>
          <h2 className="font-semibold text-gray-900 text-lg mb-1">Processando simulações</h2>
          <p className="text-gray-500 text-sm mb-5">
            {progresso} de {linhasValidas.length} processadas
            {errosCount > 0 && ` · ${errosCount} com erro`}
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2 max-w-sm mx-auto">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${linhasValidas.length > 0 ? (progresso / linhasValidas.length) * 100 : 0}%` }}
            />
          </div>
          {erroProcAcesso && (
            <p className="mt-4 text-sm text-red-600">{erroProcAcesso}</p>
          )}
          <p className="text-xs text-gray-400 mt-4">Cada simulação é processada individualmente. Não feche esta página.</p>
        </div>
      )}

      {/* Step 3: Resultados */}
      {step === 3 && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Processadas', val: resultados.filter(s => s.status === 'concluido').length, cls: 'text-green-600', bg: 'bg-green-50' },
              { label: 'Com erro', val: resultados.filter(s => s.status === 'erro').length, cls: 'text-red-600', bg: 'bg-red-50' },
              { label: 'Total', val: resultados.length, cls: 'text-gray-800', bg: 'bg-gray-50' },
            ].map(s => (
              <div key={s.label} className={`${s.bg} rounded-xl px-5 py-4`}>
                <p className={`text-2xl font-bold ${s.cls}`}>{s.val}</p>
                <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {resultados.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    {['Cargo', 'Tipo', 'Salário Atual → Proposto', 'Status', ''].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {resultados.map((sim, i) => (
                    <tr key={sim.id} className={`${i !== 0 ? 'border-t border-gray-100' : ''} hover:bg-gray-50`}>
                      <td className="px-4 py-3 font-medium text-gray-900">{sim.cargo_atual}</td>
                      <td className="px-4 py-3 text-gray-600">{tipoLabel[sim.tipo] ?? sim.tipo}</td>
                      <td className="px-4 py-3 text-gray-600">{formatBRL(sim.salario_atual)} → {formatBRL(sim.salario_proposto)}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${statusCls[sim.status] ?? 'bg-gray-100 text-gray-600'}`}>
                          {sim.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {sim.status === 'concluido' && (
                          <Link to={`/simulacao/${sim.id}/resultado`} className="text-xs text-blue-600 hover:underline">
                            Ver resultado →
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => { setStep(1); setCsvTexto(''); setLinhas([]); setResultados([]); setLoteId(null) }}
              className="flex items-center gap-2 text-sm text-gray-600 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Nova análise em lote
            </button>
            <Link to="/historico" className="text-sm text-blue-600 border border-blue-300 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors">
              Ver histórico completo
            </Link>
            {loteId && (
              <p className="text-xs text-gray-400 self-center">ID do lote: {loteId.slice(0, 8)}...</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
