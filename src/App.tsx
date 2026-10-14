import { AppProvider, useApp } from './context/AppContext'
import { LandingPage } from './pages/LandingPage'
import { DecisionPage } from './pages/DecisionPage'
import { AnalyzingPage, AnalysisPage } from './pages/AnalysisPage'
import { ReflectionPage } from './pages/ReflectionPage'
import { SummaryPage } from './pages/SummaryPage'

function AppRouter() {
  const { step } = useApp()

  switch (step) {
    case 'landing':
      return <LandingPage />
    case 'decision':
      return <DecisionPage />
    case 'analyzing':
      return <AnalyzingPage />
    case 'analysis':
      return <AnalysisPage />
    case 'reflection':
      return <ReflectionPage />
    case 'summary':
      return <SummaryPage />
    default:
      return <LandingPage />
  }
}

export default function App() {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  )
}
