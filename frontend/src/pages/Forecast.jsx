import { useEffect, useMemo, useState } from "react"
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts"
import Sidebar from "../components/Sidebar"

const API_URL = "http://localhost:5000/api"

function Forecast({ setPage }) {
  const [products, setProducts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState("")
  const [forecast, setForecast] = useState([])
  const [loading, setLoading] = useState(true)
  const [forecastLoading, setForecastLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch(API_URL + "/products")
      .then((response) => {
        if (!response.ok) throw new Error("Backend request failed")
        return response.json()
      })
      .then((data) => {
        setProducts(data)
        const firstProduct = data.find(
          product => Number(product.maximum_forecast_demand) > 0
        )
        if (firstProduct) setSelectedProduct(firstProduct.product_id)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setError("Unable to connect to the warehouse backend.")
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    if (!selectedProduct) return

    setForecastLoading(true)

    fetch(API_URL + "/forecast/" + selectedProduct)
      .then(response => {
        if (!response.ok) throw new Error("Forecast request failed")
        return response.json()
      })
      .then(data => {
        setForecast(data)
        setForecastLoading(false)
      })
      .catch(err => {
        console.error(err)
        setForecast([])
        setForecastLoading(false)
      })
  }, [selectedProduct])

  const selected = useMemo(
    () => products.find(product => product.product_id === selectedProduct),
    [products, selectedProduct]
  )

  const chartData = useMemo(
    () =>
      forecast.map((item, index) => ({
        day: "Day " + (index + 1),
        date: item.date,
        demand: Number(item.forecast_demand)
      })),
    [forecast]
  )

  const averageDemand = useMemo(() => {
    if (!forecast.length) return 0
    return forecast.reduce(
      (total, item) => total + Number(item.forecast_demand),
      0
    ) / forecast.length
  }, [forecast])

  const peakDemand = useMemo(() => {
    if (!forecast.length) return 0
    return Math.max(
      ...forecast.map(item => Number(item.forecast_demand))
    )
  }, [forecast])

  const currentStock = Number(selected?.current_stock || 0)
  const reorderPoint = Number(selected?.reorder_point || 0)

  if (loading) {
    return (
      <div className="app-layout">
        <Sidebar setPage={setPage} currentPage="forecast" />
        <main className="main-content">
          <div className="forecast-empty">
            <h3>Loading forecast...</h3>
            <p>Connecting to the warehouse intelligence backend.</p>
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="app-layout">
        <Sidebar setPage={setPage} currentPage="forecast" />
        <main className="main-content">
          <div className="forecast-empty">
            <h3>Forecast unavailable</h3>
            <p>{error}</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="app-layout">
      <Sidebar setPage={setPage} currentPage="forecast" />

      <main className="main-content forecast-page">
        <section className="forecast-hero">
          <div className="forecast-floating-items">
            <span className="forecast-float f1">📦</span>
            <span className="forecast-float f2">📈</span>
            <span className="forecast-float f3">📊</span>
            <span className="forecast-float f4">🔮</span>
            <span className="forecast-float f5">🚚</span>
            <span className="forecast-float f6">↗</span>
          </div>

          <div className="forecast-hero-content">
            <div className="eyebrow">PREDICTIVE ANALYTICS</div>
            <h1>Demand Forecast</h1>
            <p>
              AI-powered demand prediction from the warehouse intelligence pipeline.
            </p>
          </div>

          <div className="forecast-selector-box">
            <span>PRODUCT</span>
            <select
              value={selectedProduct}
              onChange={event => setSelectedProduct(event.target.value)}
            >
              {products
                .filter(
                  product => Number(product.maximum_forecast_demand) > 0
                )
                .map(product => (
                  <option
                    key={product.product_id}
                    value={product.product_id}
                  >
                    {product.product_name}
                  </option>
                ))}
            </select>
          </div>
        </section>

        {!selected ? (
          <div className="forecast-empty">
            <h3>No forecast available</h3>
            <p>This product does not have enough forecasting data yet.</p>
          </div>
        ) : forecastLoading ? (
          <div className="forecast-empty">
            <h3>Loading product forecast...</h3>
            <p>Fetching the latest predictions from the ML pipeline.</p>
          </div>
        ) : !forecast.length ? (
          <div className="forecast-empty">
            <h3>No forecast available</h3>
            <p>This product does not have forecast data yet.</p>
          </div>
        ) : (
          <>
            <div className="forecast-kpis">
              <div className="forecast-kpi">
                <div className="forecast-kpi-label">Average Demand</div>
                <div className="forecast-kpi-value">{averageDemand.toFixed(2)}</div>
                <div className="forecast-kpi-sub">units / day</div>
              </div>

              <div className="forecast-kpi">
                <div className="forecast-kpi-label">Peak Demand</div>
                <div className="forecast-kpi-value">{peakDemand.toFixed(2)}</div>
                <div className="forecast-kpi-sub">highest prediction</div>
              </div>

              <div className="forecast-kpi">
                <div className="forecast-kpi-label">Current Stock</div>
                <div className="forecast-kpi-value">{currentStock}</div>
                <div className="forecast-kpi-sub">units available</div>
              </div>

              <div className="forecast-kpi">
                <div className="forecast-kpi-label">Reorder Point</div>
                <div className="forecast-kpi-value">{reorderPoint.toFixed(2)}</div>
                <div className="forecast-kpi-sub">calculated threshold</div>
              </div>
            </div>

            <section className="forecast-panel forecast-chart-panel">
              <div className="forecast-panel-header">
                <div>
                  <h2>{selected.product_name} Demand Trend</h2>
                  <p>Predicted daily demand for the next seven days.</p>
                </div>
                <div className="forecast-badge">7-DAY FORECAST</div>
              </div>

              <div className="forecast-chart">
                <ResponsiveContainer width="100%" height={390}>
                  <LineChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 10, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="4 4" vertical={false} />
                    <XAxis dataKey="day" tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} />
                    <Tooltip
                      formatter={value => [
                        Number(value).toFixed(2) + " units",
                        "Predicted Demand"
                      ]}
                      labelFormatter={(label, payload) => {
                        const item = payload?.[0]?.payload
                        return item ? label + " • " + item.date : label
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="demand"
                      stroke="#6c5ce7"
                      strokeWidth={3}
                      dot={{ r: 5 }}
                      activeDot={{ r: 7 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </section>

            <div className="forecast-summary-grid">
              <section className="forecast-panel">
                <div className="forecast-panel-header">
                  <div>
                    <h2>Forecast Summary</h2>
                    <p>Selected product intelligence</p>
                  </div>
                </div>

                <div className="forecast-summary-list">
                  <div className="forecast-summary-row">
                    <span>Product ID</span>
                    <strong>{selected.product_id}</strong>
                  </div>
                  <div className="forecast-summary-row">
                    <span>Average Daily Demand</span>
                    <strong>{averageDemand.toFixed(2)} units</strong>
                  </div>
                  <div className="forecast-summary-row">
                    <span>Peak Demand</span>
                    <strong>{peakDemand.toFixed(2)} units</strong>
                  </div>
                  <div className="forecast-summary-row">
                    <span>Forecast Horizon</span>
                    <strong>{forecast.length} days</strong>
                  </div>
                </div>
              </section>

              <section className="forecast-panel">
                <div className="forecast-panel-header">
                  <div>
                    <h2>Inventory Context</h2>
                    <p>Current inventory intelligence</p>
                  </div>
                </div>

                <div className="forecast-summary-list">
                  <div className="forecast-summary-row">
                    <span>Current Stock</span>
                    <strong>{currentStock} units</strong>
                  </div>
                  <div className="forecast-summary-row">
                    <span>Reorder Point</span>
                    <strong>{reorderPoint.toFixed(2)} units</strong>
                  </div>
                  <div className="forecast-summary-row">
                    <span>Supplier</span>
                    <strong>{selected.supplier_id}</strong>
                  </div>
                  <div className="forecast-summary-row">
                    <span>Lead Time</span>
                    <strong>{selected.lead_time_days} days</strong>
                  </div>
                </div>
              </section>
            </div>

            <section className="forecast-panel">
              <div className="forecast-panel-header">
                <div>
                  <h2>Forecast Details</h2>
                  <p>Daily demand predictions for the selected product.</p>
                </div>
              </div>

              <div className="forecast-table-container">
                <table className="forecast-table">
                  <thead>
                    <tr>
                      <th>Forecast Date</th>
                      <th>Product</th>
                      <th>Predicted Demand</th>
                    </tr>
                  </thead>
                  <tbody>
                    {forecast.map(item => (
                      <tr key={item.product_id + item.date}>
                        <td>{item.date}</td>
                        <td>
                          <span className="product-tag">{item.product_id}</span>
                        </td>
                        <td>
                          <strong>
                            {Number(item.forecast_demand).toFixed(2)}
                          </strong>{" "}
                          units
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  )
}

export default Forecast