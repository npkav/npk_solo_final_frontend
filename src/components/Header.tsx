import { useLocation, useNavigate } from 'react-router-dom'

export function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  
  const isHome = location.pathname === '/'
  const isTrees = location.pathname === '/trees'

  return (
    <header className="px-8 py-4" style={{ backgroundColor: 'var(--header)', borderBottom: '1px solid #475569' }}>
      <div className="max-w-6xl mx-auto flex-between">
        <h1 className="m-0 text-2xl font-bold text-white cursor-pointer" onClick={() => navigate('/')}>bina-tree</h1>
        <nav className="flex gap-4">
          <button onClick={() => navigate('/')} className={isHome ? 'btn' : 'btn-nav-inactive'}>create</button>
          <button onClick={() => navigate('/trees')} className={isTrees ? 'btn' : 'btn-nav-inactive'}>saved</button>
        </nav>
      </div>
    </header>
  )
}
