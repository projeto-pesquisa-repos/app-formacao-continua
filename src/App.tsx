import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainScreen from './pages/MainScreen'
import DetailScreen from './pages/DetailScreen'
import NewFormationScreen from './pages/NewFormationScreen'
import RankingScreen from './pages/RankingScreen'
import CelebrationScreen from './pages/CelebrationScreen'
import DadosScreen from './pages/DadosScreen'
import PerfilScreen from './pages/PerfilScreen'
import { BottomNav } from './components/BottomNav'

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<MainScreen />} />
          <Route path="/detail/:id" element={<DetailScreen />} />
          <Route path="/new" element={<NewFormationScreen />} />
          <Route path="/ranking" element={<RankingScreen />} />
          <Route path="/celebration" element={<CelebrationScreen />} />
          <Route path="/dados" element={<DadosScreen />} />
          <Route path="/perfil" element={<PerfilScreen />} />
        </Routes>
        <BottomNav />
      </div>
    </BrowserRouter>
  )
}

export default App
