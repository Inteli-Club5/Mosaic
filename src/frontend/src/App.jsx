import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import AgentsPage from './pages/AgentsPage'
import CreateAgentPage from './pages/CreateAgentPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/agents" element={<AgentsPage />} />
      <Route path="/agents/create" element={<CreateAgentPage />} />
    </Routes>
  )
}

export default App
