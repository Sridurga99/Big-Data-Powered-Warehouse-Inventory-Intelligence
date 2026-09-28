function Sidebar({ setPage }) {
  return (
    <aside className="sidebar">
      <h2>Warehouse AI</h2>

      <nav>
        <p onClick={() => setPage("dashboard")}>Dashboard</p>
        <p onClick={() => setPage("inventory")}>Inventory</p>
        <p onClick={() => setPage("forecast")}>Demand Forecast</p>
        <p onClick={() => setPage("risk")}>Risk Analysis</p>
        <p onClick={() => setPage("recommendations")}>Recommendations</p>
      </nav>
    </aside>
  )
}

export default Sidebar