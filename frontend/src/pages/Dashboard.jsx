import { useEffect, useState } from "react"
import Sidebar from "../components/Sidebar"
import Navbar from "../components/Navbar"
import StatCard from "../components/StatCard"
import ProductTable from "../components/ProductTable"
import ForecastChart from "../components/ForecastChart"

const API_URL = "http://localhost:5000/api"

function Dashboard({ setPage }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/products`)

        if (!response.ok) {
          throw new Error("Failed to load dashboard data")
        }

        const data = await response.json()
        setProducts(data)
      } catch (error) {
        console.error("Dashboard data loading failed:", error)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  const totalProducts = products.length

  const lowStock = products.filter(
    (product) =>
      Number(product.current_stock) <= Number(product.reorder_point)
  ).length

  const highRisk = products.filter(
    (product) =>
      product.risk_category === "High Risk" ||
      product.risk_category === "Medium Risk"
  ).length

  const pendingOrders = products.filter(
    (product) => Number(product.recommended_order) > 0
  ).length

  const totalStock = products.reduce(
    (total, product) =>
      total + Number(product.current_stock || 0),
    0
  )

  const totalRecommendedOrder = products.reduce(
    (total, product) =>
      total + Number(product.recommended_order || 0),
    0
  )

  const fallingItems = [
    { icon: "📦", type: "box", left: "7%", delay: "0s", duration: "12s", size: "1.5rem" },
    { icon: "📊", type: "chart", left: "17%", delay: "2s", duration: "14s", size: "1.7rem" },
    { icon: "📈", type: "forecast", left: "29%", delay: "5s", duration: "11s", size: "1.5rem" },
    { icon: "🚚", type: "truck", left: "41%", delay: "1s", duration: "15s", size: "1.8rem" },
    { icon: "🏭", type: "warehouse", left: "53%", delay: "7s", duration: "13s", size: "1.6rem" },
    { icon: "📦", type: "box", left: "64%", delay: "3s", duration: "12s", size: "1.7rem" },
    { icon: "🔄", type: "reorder", left: "75%", delay: "6s", duration: "14s", size: "1.5rem" },
    { icon: "📊", type: "chart", left: "86%", delay: "4s", duration: "11s", size: "1.6rem" },
    { icon: "📈", type: "forecast", left: "94%", delay: "8s", duration: "15s", size: "1.5rem" }
  ]

  const particles = [
    { left: "12%", top: "22%", delay: "0s" },
    { left: "24%", top: "65%", delay: "1.5s" },
    { left: "38%", top: "30%", delay: "3s" },
    { left: "51%", top: "70%", delay: "2s" },
    { left: "66%", top: "25%", delay: "4s" },
    { left: "79%", top: "60%", delay: "1s" },
    { left: "91%", top: "32%", delay: "3.5s" }
  ]

  return (
    <div className="dashboard">
      <Sidebar setPage={setPage} currentPage="dashboard" />

      <main className="main-content">
        <Navbar />

        <div className="welcome-section warehouse-hero">
          <div className="warehouse-grid"></div>
          <div className="hero-glow hero-glow-one"></div>
          <div className="hero-glow hero-glow-two"></div>

          <div className="falling-elements">
            {fallingItems.map((item, index) => (
              <div
                key={index}
                className={`falling-item ${item.type}`}
                style={{
                  left: item.left,
                  animationDelay: item.delay,
                  animationDuration: item.duration,
                  fontSize: item.size
                }}
              >
                <span>{item.icon}</span>
              </div>
            ))}
          </div>

          <div className="hero-particles">
            {particles.map((particle, index) => (
              <span
                key={index}
                className="hero-particle"
                style={{
                  left: particle.left,
                  top: particle.top,
                  animationDelay: particle.delay
                }}
              ></span>
            ))}
          </div>

          <div className="hero-content">
            <span className="eyebrow">
              WAREHOUSE INTELLIGENCE
            </span>

            <h1>Inventory Command Center</h1>

            <p>
              Monitor stock levels, forecast demand and identify
              inventory risks in one place.
            </p>

            <div className="hero-tech-strip">
              <span>INVENTORY</span>
              <i></i>
              <span>FORECASTING</span>
              <i></i>
              <span>RISK ANALYSIS</span>
              <i></i>
              <span>REORDER</span>
            </div>
          </div>

          <div className="system-status">
            <span className="status-dot"></span>
            Intelligence System Active
          </div>

          <div className="warehouse-orbit orbit-one"></div>
          <div className="warehouse-orbit orbit-two"></div>
        </div>

        {loading ? (
          <p>Loading warehouse intelligence...</p>
        ) : (
          <>
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

            <div className="analytics-grid">
              <ForecastChart />

              <div className="insight-card">
                <div className="chart-header">
                  <div>
                    <h2>Inventory Intelligence</h2>
                    <p>
                      Real-time warehouse indicators
                    </p>
                  </div>
                </div>

                <div className="insight-list">
                  <div className="insight-item">
                    <div className="insight-icon stock-icon">
                      S
                    </div>

                    <div>
                      <span>Total Current Stock</span>
                      <strong>
                        {totalStock} units
                      </strong>
                    </div>
                  </div>

                  <div className="insight-item">
                    <div className="insight-icon risk-icon">
                      !
                    </div>

                    <div>
                      <span>At-Risk Products</span>
                      <strong>
                        {highRisk} products
                      </strong>
                    </div>
                  </div>

                  <div className="insight-item">
                    <div className="insight-icon order-icon">
                      ↗
                    </div>

                    <div>
                      <span>Recommended Order</span>
                      <strong>
                        {totalRecommendedOrder.toFixed(2)} units
                      </strong>
                    </div>
                  </div>
                </div>

                <button
                  className="primary-action"
                  onClick={() => setPage("risk")}
                >
                  Open Risk Analysis
                </button>
              </div>
            </div>

            <div className="dashboard-section">
              <div className="section-heading">
                <div>
                  <span className="section-label">
                    INVENTORY
                  </span>

                  <h2>Inventory Overview</h2>

                  <p>
                    Current warehouse inventory status
                  </p>
                </div>

                <button
                  className="view-button"
                  onClick={() => setPage("inventory")}
                >
                  View Inventory →
                </button>
              </div>

              <ProductTable products={products} />
            </div>

            <div className="quick-actions">
              <div className="section-heading">
                <div>
                  <span className="section-label">
                    NAVIGATION
                  </span>

                  <h2>Quick Actions</h2>

                  <p>
                    Access the intelligence modules
                  </p>
                </div>
              </div>

              <div className="action-grid">
                <button
                  onClick={() => setPage("inventory")}
                >
                  <div className="action-number">01</div>
                  <strong>Inventory</strong>
                  <span>
                    View current stock levels →
                  </span>
                </button>

                <button
                  onClick={() => setPage("forecast")}
                >
                  <div className="action-number">02</div>
                  <strong>Demand Forecast</strong>
                  <span>
                    Explore predicted demand →
                  </span>
                </button>

                <button
                  onClick={() => setPage("risk")}
                >
                  <div className="action-number">03</div>
                  <strong>Risk Analysis</strong>
                  <span>
                    Identify inventory risks →
                  </span>
                </button>

                <button
                  onClick={() =>
                    setPage("recommendations")
                  }
                >
                  <div className="action-number">04</div>
                  <strong>Recommendations</strong>
                  <span>
                    Review suggested orders →
                  </span>
                </button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default Dashboard