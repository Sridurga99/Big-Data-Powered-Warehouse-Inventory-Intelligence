import Sidebar from "../components/Sidebar"
import Navbar from "../components/Navbar"
import StatCard from "../components/StatCard"
import ProductTable from "../components/ProductTable"

function Dashboard({ setPage }) {
  const products = [
    {
      id: "P101",
      name: "Smartphone",
      stock: 120,
      forecast: 63.92,
      risk: "High Risk",
      recommendedOrder: 327.32,
      status: "Critical"
    },
    {
      id: "P102",
      name: "Rice_Bag",
      stock: 450,
      forecast: 34.22,
      risk: "Low Risk",
      recommendedOrder: 0,
      status: "Sufficient"
    }
  ]

  const totalProducts = products.length

  const lowStock = products.filter(
    (product) => product.stock <= 50
  ).length

  const highRisk = products.filter(
    (product) => product.risk === "High Risk"
  ).length

  const pendingOrders = products.filter(
    (product) => product.recommendedOrder > 0
  ).length

  return (
    <div className="dashboard">
      <Sidebar setPage={setPage} />

      <main className="main-content">
        <Navbar />

        <div className="welcome-section">
          <div>
            <h1>Warehouse Inventory Dashboard</h1>
            <p>
              Monitor inventory levels, demand forecasts and stock risks.
            </p>
          </div>
        </div>

        <div className="stats">
          <StatCard
            title="Total Products"
            value={totalProducts}
          />

          <StatCard
            title="Low Stock"
            value={lowStock}
          />

          <StatCard
            title="High Risk"
            value={highRisk}
          />

          <StatCard
            title="Pending Orders"
            value={pendingOrders}
          />
        </div>

        <div className="dashboard-section">
          <div className="section-heading">
            <div>
              <h2>Inventory Overview</h2>
              <p>Current warehouse inventory status</p>
            </div>

            <button
              className="view-button"
              onClick={() => setPage("inventory")}
            >
              View Inventory
            </button>
          </div>

          <ProductTable />
        </div>

        <div className="quick-actions">
          <h2>Quick Actions</h2>

          <div className="action-grid">
            <button onClick={() => setPage("inventory")}>
              <strong>Inventory</strong>
              <span>View current stock</span>
            </button>

            <button onClick={() => setPage("forecast")}>
              <strong>Demand Forecast</strong>
              <span>View predicted demand</span>
            </button>

            <button onClick={() => setPage("risk")}>
              <strong>Risk Analysis</strong>
              <span>Check inventory risks</span>
            </button>

            <button onClick={() => setPage("recommendations")}>
              <strong>Recommendations</strong>
              <span>View suggested orders</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard