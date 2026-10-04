import Sidebar from "../components/Sidebar"
import Navbar from "../components/Navbar"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts"

function Forecast({ setPage }) {
  const data = [
    { date: "Jan 11", smartphone: 63.74, riceBag: 33.89 },
    { date: "Jan 12", smartphone: 63.92, riceBag: 33.95 },
    { date: "Jan 13", smartphone: 63.92, riceBag: 33.95 },
    { date: "Jan 14", smartphone: 63.92, riceBag: 33.95 },
    { date: "Jan 15", smartphone: 63.92, riceBag: 33.95 },
    { date: "Jan 16", smartphone: 63.74, riceBag: 34.22 },
    { date: "Jan 17", smartphone: 63.74, riceBag: 34.22 }
  ]

  const products = [
    {
      id: "P101",
      name: "Smartphone",
      average: 63.84,
      maximum: 63.92
    },
    {
      id: "P102",
      name: "Rice_Bag",
      average: 34.02,
      maximum: 34.22
    }
  ]

  return (
    <div className="dashboard">
      <Sidebar setPage={setPage} />

      <main className="main-content">
        <Navbar />

        <div className="page-hero">
          <div>
            <span className="section-label">MACHINE LEARNING</span>
            <h1>Demand Forecast</h1>
            <p>
              AI-powered demand predictions generated from historical sales
              data.
            </p>
          </div>

          <div className="forecast-status">
            <span className="status-dot"></span>
            Forecast Ready
          </div>
        </div>

        <div className="stats">
          <div className="stat-card">
            <h3>Forecast Horizon</h3>
            <h2>7 Days</h2>
          </div>

          <div className="stat-card">
            <h3>Products Forecasted</h3>
            <h2>2</h2>
          </div>

          <div className="stat-card">
            <h3>Peak Smartphone Demand</h3>
            <h2>63.92</h2>
          </div>

          <div className="stat-card">
            <h3>Peak Rice Bag Demand</h3>
            <h2>34.22</h2>
          </div>
        </div>

        <div className="forecast-main-card">
          <div className="chart-header">
            <div>
              <h2>7-Day Demand Projection</h2>
              <p>Predicted daily demand by product</p>
            </div>

            <span className="chart-badge">ML Forecast</span>
          </div>

          <div className="large-chart">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="smartphone"
                  name="Smartphone"
                  stroke="#4f46e5"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="riceBag"
                  name="Rice Bag"
                  stroke="#0f766e"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="forecast-table-section">
          <div className="section-heading">
            <div>
              <span className="section-label">FORECAST SUMMARY</span>
              <h2>Product Forecast Metrics</h2>
              <p>Summary of the generated demand predictions</p>
            </div>
          </div>

          <div className="forecast-product-grid">
            {products.map((product) => (
              <div className="forecast-product-card" key={product.id}>
                <div className="product-card-top">
                  <div>
                    <span className="product-id">{product.id}</span>
                    <h3>{product.name}</h3>
                  </div>

                  <span className="forecast-days">7 DAYS</span>
                </div>

                <div className="forecast-metric-row">
                  <div>
                    <span>Average Daily Demand</span>
                    <strong>{product.average}</strong>
                  </div>

                  <div>
                    <span>Maximum Forecast</span>
                    <strong>{product.maximum}</strong>
                  </div>
                </div>

                <div className="forecast-indicator">
                  <div className="forecast-indicator-label">
                    <span>Forecast intensity</span>
                    <strong>{product.maximum} units/day</strong>
                  </div>

                  <div className="forecast-progress">
                    <div
                      style={{
                        width: `${Math.min(
                          (product.maximum / 70) * 100,
                          100
                        )}%`
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="forecast-actions">
          <button onClick={() => setPage("inventory")}>
            View Inventory →
          </button>

          <button onClick={() => setPage("recommendations")}>
            View Recommendations →
          </button>

          <button onClick={() => setPage("risk")}>
            Analyze Risk →
          </button>
        </div>
      </main>
    </div>
  )
}

export default Forecast
