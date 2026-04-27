import { useAuth } from '../hooks/useAuth'

export function Conta() {
  const { user } = useAuth()

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Minha Conta</h1>
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 max-w-lg">
        <p className="text-sm text-gray-500 mb-1">Email</p>
        <p className="font-medium text-gray-900">{user?.email}</p>
        <p className="text-sm text-gray-500 mt-4 mb-1">Plano atual</p>
        <p className="font-medium text-gray-900">Trial (14 dias)</p>
        <p className="text-sm text-gray-500 mt-4 mb-1">Simulações usadas este mês</p>
        <p className="font-medium text-gray-900">0 de 3</p>
      </div>
    </div>
  )
}
