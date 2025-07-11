import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import AgentsPage from './pages/AgentsPage'
import CreateAgentPage from './pages/CreateAgentPage'
import ProfilePage from './pages/ProfilePage'
import AgentDetailPage from './pages/AgentDetailPage'
import ErrorBoundary from './components/ErrorBoundary'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/agents" element={<AgentsPage />} />
      <Route path="/agents/:id" element={
        <ErrorBoundary>
          <AgentDetailPage />
        </ErrorBoundary>
      } />
      <Route path="/profile" element={<ProfilePage />}/>
      <Route path="/create" element={<CreateAgentPage />} />
    </Routes>
  )
}

export default App
  