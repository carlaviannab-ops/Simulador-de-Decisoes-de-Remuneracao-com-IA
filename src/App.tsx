import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Landing } from './pages/Landing'
import { Login } from './pages/Login'
import { Dashboard } from './pages/Dashboard'
import { NovaSimulacao } from './pages/NovaSimulacao'
import { Resultado } from './pages/Resultado'
import { Historico } from './pages/Historico'
import { SimulacaoDetalhe } from './pages/SimulacaoDetalhe'
import { Planos } from './pages/Planos'
import { Conta } from './pages/Conta'
import { Layout } from './components/layout/Layout'
import { ProtectedRoute } from './components/ProtectedRoute'

const router = createBrowserRouter([
  { path: '/', element: <Landing /> },
  { path: '/login', element: <Login mode="login" /> },
  { path: '/cadastro', element: <Login mode="cadastro" /> },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'simulacao/nova', element: <NovaSimulacao /> },
      { path: 'simulacao/:id/resultado', element: <Resultado /> },
      { path: 'historico', element: <Historico /> },
      { path: 'simulacao/:id', element: <SimulacaoDetalhe /> },
      { path: 'planos', element: <Planos /> },
      { path: 'conta', element: <Conta /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
