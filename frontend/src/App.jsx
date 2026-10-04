import { useState } from "react"
import Dashboard from "./pages/Dashboard"
import Inventory from "./pages/Inventory"
import Forecast from "./pages/Forecast"
import RiskAnalysis from "./pages/RiskAnalysis"
import Recommendations from "./pages/Recommendations"
import PowerBI from "./pages/PowerBI"
import WarehouseLoader from "./components/WarehouseLoader"

function App() {
  const [page, setPage] = useState("dashboard")
  const [loading, setLoading] = useState(true)

  const renderPage = () => {
    switch (page) {
      case "inventory":
        return <Inventory setPage={setPage} />

      case "forecast":
        return <Forecast setPage={setPage} />

      case "risk":
        return <RiskAnalysis setPage={setPage} />

      case "recommendations":
        return <Recommendations setPage={setPage} />

      case "powerbi":
        return <PowerBI setPage={setPage} />

      default:
        return <Dashboard setPage={setPage} />
    }
  }

  if (loading) {
    return <WarehouseLoader onComplete={() => setLoading(false)} />
  }

  return renderPage()
}

export default App