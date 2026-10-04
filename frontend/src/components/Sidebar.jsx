function Sidebar({ setPage, currentPage }) {
  const menuItems = [
    { name: "Dashboard", page: "dashboard", icon: "▦" },
    { name: "Inventory", page: "inventory", icon: "▤" },
    { name: "Demand Forecast", page: "forecast", icon: "⌁" },
    { name: "Recommendations", page: "recommendations", icon: "↗" },
    { name: "Risk Analysis", page: "risk", icon: "◈" },
    { name: "Power BI", page: "powerbi", icon: "📊" }
  ]

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-mark">W</div>
        <div>
          <h2>Warehouse AI</h2>
          <span>Inventory Intelligence</span>
        </div>
      </div>

      <div className="sidebar-section-title">MAIN MENU</div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.page}
            type="button"
            className={
              currentPage === item.page
                ? "sidebar-link active"
                : "sidebar-link"
            }
            onClick={() => setPage(item.page)}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span>{item.name}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="system-status">
          <span className="status-dot"></span>
          <div>
            <strong>System Online</strong>
            <small>ML pipeline connected</small>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar