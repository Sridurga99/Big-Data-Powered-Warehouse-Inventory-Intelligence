import { useState } from "react"
import Dashboard from "./pages/Dashboard"
import Inventory from "./pages/Inventory"
import Forecast from "./pages/Forecast"
import RiskAnalysis from "./pages/RiskAnalysis"
import Recommendations from "./pages/Recommendations"

function App() {
  const [page, setPage] = useState("dashboard")

  return (
    <>
      {page === "dashboard" && <Dashboard setPage={setPage} />}
      {page === "inventory" && <Inventory setPage={setPage} />}
      {page === "forecast" && <Forecast setPage={setPage} />}
      {page === "risk" && <RiskAnalysis setPage={setPage} />}
      {page === "recommendations" && <Recommendations setPage={setPage} />}
    </>
  )
}

export default App