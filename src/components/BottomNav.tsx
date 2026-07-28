import { useLocation, useNavigate } from 'react-router-dom'
import { Home, BarChart2, User } from 'lucide-react'

export function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()

  // Hide nav on certain screens
  const hiddenPaths = ['/new', '/celebration']
  if (hiddenPaths.some(p => location.pathname.startsWith(p))) {
    return null
  }
  // Also hide on detail pages
  if (location.pathname.startsWith('/detail')) {
    return null
  }

  const isHome = location.pathname === '/'
  const isDados = location.pathname === '/dados'
  const isPerfil = location.pathname === '/perfil'

  return (
    <nav className="bottom-nav">
      <button
        className={`nav-tab ${isHome ? 'active' : ''}`}
        onClick={() => navigate('/')}
      >
        <Home size={22} />
        <span>Início</span>
      </button>
      <button
        className={`nav-tab ${isDados ? 'active' : ''}`}
        onClick={() => navigate('/dados')}
      >
        <BarChart2 size={22} />
        <span>Dados</span>
      </button>
      <button
        className={`nav-tab ${isPerfil ? 'active' : ''}`}
        onClick={() => navigate('/perfil')}
      >
        <User size={22} />
        <span>Perfil</span>
      </button>
    </nav>
  )
}
