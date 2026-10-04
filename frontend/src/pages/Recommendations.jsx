import { useEffect, useMemo, useState } from "react"
import Sidebar from "../components/Sidebar"

const API_URL = "http://localhost:5000/api"

function Recommendations({ setPage }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetch(API_URL + "/products")
      .then(response => {
        if (!response.ok) {
          throw new Error("Backend request failed")
        }
        return response.json()
      })
      .then(data => {
        setProducts(data)
        setLoading(false)
      })
      .catch(error => {
        console.error(error)
        setLoading(false)
      })
  }, [])

  const recommendations = useMemo(() => {
    return products
      .filter(product => Number(product.recommended_order || 0) > 0)
      .filter(product => {
        const text = (
          String(product.product_name || "") +
          String(product.product_id || "")
        ).toLowerCase()

        return text.includes(search.toLowerCase())
      })
      .sort(
        (a, b) =>
          Number(b.recommended_order || 0) -
          Number(a.recommended_order || 0)
      )
  }, [products, search])

  const totalRecommended = useMemo(
    () =>
      recommendations.reduce(
        (total, product) =>
          total + Number(product.recommended_order || 0),
        0
      ),
    [recommendations]
  )

  const highPriority = useMemo(
    () =>
      recommendations.filter(
        product =>
          String(product.risk_category || "").toLowerCase() ===
          "high risk"
      ).length,
    [recommendations]
  )

  const averageOrder = recommendations.length
    ? totalRecommended / recommendations.length
    : 0

  if (loading) {
    return (
      <div className="app-layout">
        <Sidebar setPage={setPage} currentPage="recommendations" />
        <main className="main-content">
          <div className="forecast-empty">
            <h3>Loading recommendations...</h3>
            <p>
              Connecting to the warehouse intelligence backend.
            </p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="app-layout">
      <Sidebar
        setPage={setPage}
        currentPage="recommendations"
      />

      <main className="main-content recommendations-page">
        <section className="recommendations-hero">
          <div className="recommendation-floating-items">
            <span className="recommendation-float r1">📦</span>
            <span className="recommendation-float r2">🔄</span>
            <span className="recommendation-float r3">🚚</span>
            <span className="recommendation-float r4">📊</span>
            <span className="recommendation-float r5">🏭</span>
            <span className="recommendation-float r6">↗</span>
          </div>

          <div className="recommendations-hero-content">
            <div className="eyebrow">
              SMART REPLENISHMENT
            </div>

            <h1>Reorder Recommendations</h1>

            <p>
              Intelligent inventory recommendations based on demand,
              stock levels, risk and replenishment requirements.
            </p>
          </div>

          <div className="recommendation-status">
            <span className="status-dot"></span>
            LIVE INVENTORY INTELLIGENCE
          </div>
        </section>

        <div className="recommendation-kpis">
          <div className="recommendation-kpi">
            <div className="recommendation-kpi-icon">🔄</div>
            <div>
              <span>Products Requiring Reorder</span>
              <strong>{recommendations.length}</strong>
              <small>products</small>
            </div>
          </div>

          <div className="recommendation-kpi">
            <div className="recommendation-kpi-icon">📦</div>
            <div>
              <span>Total Recommended Order</span>
              <strong>{Math.round(totalRecommended)}</strong>
              <small>units</small>
            </div>
          </div>

          <div className="recommendation-kpi">
            <div className="recommendation-kpi-icon">⚠️</div>
            <div>
              <span>High Priority</span>
              <strong>{highPriority}</strong>
              <small>risk flagged</small>
            </div>
          </div>

          <div className="recommendation-kpi">
            <div className="recommendation-kpi-icon">📈</div>
            <div>
              <span>Average Order</span>
              <strong>{Math.round(averageOrder)}</strong>
              <small>units / product</small>
            </div>
          </div>
        </div>

        <section className="recommendation-panel">
          <div className="recommendation-panel-header">
            <div>
              <div className="section-label">
                REPLENISHMENT ENGINE
              </div>

              <h2>Recommended Actions</h2>

              <p>
                Products that require inventory replenishment based
                on the warehouse intelligence model.
              </p>
            </div>

            <div className="recommendation-live-badge">
              ● LIVE DATA
            </div>
          </div>

          <div className="recommendation-toolbar">
            <div className="recommendation-search">
              <span>⌕</span>

              <input
                type="text"
                placeholder="Search product..."
                value={search}
                onChange={event =>
                  setSearch(event.target.value)
                }
              />
            </div>

            <div className="recommendation-count">
              {recommendations.length} recommendations
            </div>
          </div>

          <div className="recommendation-list">
            {recommendations.length === 0 ? (
              <div className="recommendation-empty">
                <div>✓</div>
                <h3>No Reorder Required</h3>
                <p>
                  All matching products currently have sufficient
                  inventory.
                </p>
              </div>
            ) : (
              recommendations.map((product, index) => {
                const stock = Number(
                  product.current_stock || 0
                )

                const reorderPoint = Number(
                  product.reorder_point || 0
                )

                const recommendedOrder = Number(
                  product.recommended_order || 0
                )

                const risk = String(
                  product.risk_category || "Normal"
                )

                const highRisk =
                  risk.toLowerCase() === "high risk"

                return (
                  <div
                    className="recommendation-row"
                    key={product.product_id}
                  >
                    <div className="recommendation-rank">
                      #{index + 1}
                    </div>

                    <div className="recommendation-product">
                      <div className="recommendation-product-icon">
                        📦
                      </div>

                      <div>
                        <strong>
                          {product.product_name}
                        </strong>

                        <span>
                          {product.product_id}
                        </span>
                      </div>
                    </div>

                    <div className="recommendation-metric">
                      <span>Current Stock</span>
                      <strong>{stock}</strong>
                    </div>

                    <div className="recommendation-metric">
                      <span>Reorder Point</span>
                      <strong>
                        {reorderPoint.toFixed(0)}
                      </strong>
                    </div>

                    <div className="recommendation-metric">
                      <span>Recommended</span>
                      <strong className="recommendation-order-value">
                        {Math.round(recommendedOrder)}
                      </strong>
                    </div>

                    <div
                      className={
                        "recommendation-risk " +
                        (highRisk ? "high" : "medium")
                      }
                    >
                      {risk}
                    </div>

                    <button
                      className="recommendation-action"
                      onClick={() => setPage("inventory")}
                    >
                      View Inventory
                    </button>
                  </div>
                )
              })
            )}
          </div>
        </section>

        <section className="recommendation-insight">
          <div className="insight-icon">💡</div>

          <div>
            <strong>Smart Replenishment Insight</strong>

            <p>
              Recommendations combine current inventory,
              reorder thresholds, demand forecasting and inventory
              risk to identify products that need replenishment.
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Recommendations