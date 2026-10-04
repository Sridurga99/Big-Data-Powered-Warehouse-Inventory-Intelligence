import { useEffect, useMemo, useState } from "react"
import Sidebar from "../components/Sidebar"

const API_URL = "http://localhost:5000/api"

function RiskAnalysis({ setPage }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

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
      .catch(err => {
        console.error(err)
        setError("Unable to connect to the warehouse backend.")
        setLoading(false)
      })
  }, [])

  const highRisk = useMemo(
    () => products.filter(item => item.risk_category === "High Risk"),
    [products]
  )

  const mediumRisk = useMemo(
    () => products.filter(item => item.risk_category === "Medium Risk"),
    [products]
  )

  const lowRisk = useMemo(
    () => products.filter(item => item.risk_category === "Low Risk"),
    [products]
  )

  const averageRisk = useMemo(() => {
    if (!products.length) return 0

    return (
      products.reduce(
        (sum, item) => sum + Number(item.risk_score || 0),
        0
      ) / products.length
    )
  }, [products])

  const highestRisk = useMemo(() => {
    if (!products.length) return null

    return products.reduce((highest, item) =>
      Number(item.risk_score || 0) >
      Number(highest.risk_score || 0)
        ? item
        : highest
    )
  }, [products])

  return (
    <div className="app-layout">
      <Sidebar setPage={setPage} currentPage="risk" />

      <main className="main-content risk-page">
        <section className="risk-hero">
          <div className="risk-floating-items">
            <span className="risk-float rf1">⚠️</span>
            <span className="risk-float rf2">📦</span>
            <span className="risk-float rf3">📊</span>
            <span className="risk-float rf4">🔍</span>
            <span className="risk-float rf5">🚨</span>
            <span className="risk-float rf6">🛡️</span>
          </div>

          <div className="risk-hero-content">
            <div className="eyebrow">INVENTORY INTELLIGENCE</div>

            <h1>Risk Analysis</h1>

            <p>
              AI-powered analysis of inventory exposure, stock
              coverage and replenishment risk.
            </p>
          </div>

          <div className="risk-status">
            <span className="risk-status-dot"></span>
            LIVE RISK MONITORING
          </div>
        </section>

        {loading ? (
          <div className="forecast-empty">
            <h3>Loading risk analysis...</h3>
            <p>
              Connecting to the warehouse intelligence backend.
            </p>
          </div>
        ) : error ? (
          <div className="forecast-empty">
            <h3>Risk analysis unavailable</h3>
            <p>{error}</p>
          </div>
        ) : (
          <>
            <section className="risk-kpis">
              <div className="risk-kpi">
                <div className="risk-kpi-icon">📦</div>
                <span>Total Products</span>
                <strong>{products.length}</strong>
                <small>under monitoring</small>
              </div>

              <div className="risk-kpi risk-high-card">
                <div className="risk-kpi-icon">🚨</div>
                <span>High Risk Products</span>
                <strong>{highRisk.length}</strong>
                <small>immediate attention</small>
              </div>

              <div className="risk-kpi risk-medium-card">
                <div className="risk-kpi-icon">⚠️</div>
                <span>Medium Risk Products</span>
                <strong>{mediumRisk.length}</strong>
                <small>monitor closely</small>
              </div>

              <div className="risk-kpi">
                <div className="risk-kpi-icon">📊</div>
                <span>Average Risk Score</span>
                <strong>{averageRisk.toFixed(2)}</strong>
                <small>overall exposure</small>
              </div>
            </section>

            {highestRisk && (
              <section className="risk-alert">
                <div className="risk-alert-icon">⚠️</div>

                <div>
                  <span>HIGHEST RISK PRODUCT</span>
                  <strong>
                    {highestRisk.product_id}
                  </strong>
                  <p>
                    Risk score:{" "}
                    {Number(
                      highestRisk.risk_score || 0
                    ).toFixed(2)}
                    {" "}— immediate inventory attention recommended.
                  </p>
                </div>
              </section>
            )}

            <section className="risk-panel">
              <div className="risk-panel-header">
                <div>
                  <div className="section-label">
                    RISK ENGINE
                  </div>

                  <h2>Inventory Risk Assessment</h2>

                  <p>
                    Risk scores calculated from stock coverage,
                    demand and reorder requirements.
                  </p>
                </div>

                <div className="risk-live-badge">
                  ● LIVE DATA
                </div>
              </div>

              <div className="risk-table-wrap">
                <table className="risk-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Current Stock</th>
                      <th>Lead Time Demand</th>
                      <th>Days Inventory</th>
                      <th>Coverage Ratio</th>
                      <th>Risk Score</th>
                      <th>Risk Category</th>
                    </tr>
                  </thead>

                  <tbody>
                    {products.map(item => {
                      const category =
                        item.risk_category || "Low Risk"

                      const badgeClass =
                        category === "High Risk"
                          ? "high"
                          : category === "Medium Risk"
                          ? "medium"
                          : "low"

                      return (
                        <tr key={item.product_id}>
                          <td>
                            <div className="risk-product">
                              <div className="risk-product-icon">
                                📦
                              </div>

                              <div>
                                <strong>
                                  {item.product_id}
                                </strong>

                                <span>
                                  {item.product_name}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td>
                            {Number(
                              item.current_stock || 0
                            ).toFixed(0)}
                          </td>

                          <td>
                            {Number(
                              item.lead_time_demand || 0
                            ).toFixed(2)}
                          </td>

                          <td>
                            {Number(
                              item.days_of_inventory || 0
                            ).toFixed(2)}
                          </td>

                          <td>
                            {Number(
                              item.stock_coverage_ratio || 0
                            ).toFixed(2)}
                          </td>

                          <td>
                            <strong className="risk-score">
                              {Number(
                                item.risk_score || 0
                              ).toFixed(2)}
                            </strong>
                          </td>

                          <td>
                            <span
                              className={`risk-badge ${badgeClass}`}
                            >
                              {category}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="risk-panel">
              <div className="risk-panel-header">
                <div>
                  <div className="section-label">
                    EXPOSURE OVERVIEW
                  </div>

                  <h2>Risk Distribution</h2>

                  <p>
                    Current inventory exposure across all products.
                  </p>
                </div>
              </div>

              <div className="risk-distribution">
                <div className="risk-distribution-item high">
                  <div className="risk-distribution-number">
                    {highRisk.length}
                  </div>

                  <div>
                    <strong>High Risk</strong>
                    <span>
                      Immediate attention required
                    </span>
                  </div>
                </div>

                <div className="risk-distribution-item medium">
                  <div className="risk-distribution-number">
                    {mediumRisk.length}
                  </div>

                  <div>
                    <strong>Medium Risk</strong>
                    <span>
                      Monitor inventory closely
                    </span>
                  </div>
                </div>

                <div className="risk-distribution-item low">
                  <div className="risk-distribution-number">
                    {lowRisk.length}
                  </div>

                  <div>
                    <strong>Low Risk</strong>
                    <span>
                      Inventory currently sufficient
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  )
}

export default RiskAnalysis