import { NavLink } from 'react-router-dom'

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/simulacao/nova', label: 'Nova Simulação' },
  { to: '/historico', label: 'Histórico' },
  { to: '/planos', label: 'Planos' },
  { to: '/conta', label: 'Minha Conta' },
]

export function Sidebar() {
  return (
    <aside className="w-56 bg-gray-50 border-r border-gray-200 min-h-full py-6">
      <nav className="flex flex-col gap-1 px-3">
        {links.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
