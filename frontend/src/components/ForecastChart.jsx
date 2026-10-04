import { useEffect, useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts"

const API_URL = "http://localhost:5000/api"

function ForecastChart() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadForecast = async () => {
      try {
        const response = await fetch(`${API_URL}/products`)

        if (!response.ok) {
          throw new Error("Failed to load forecast data")
        }

        const products = await response.json()

        const forecastData = products
          .filter(
            (product) =>
              Number(product.maximum_forecast_demand) > 0
          )
          .map((product) => ({
            product: product.product_name,
            forecast: Number(
              product.maximum_forecast_demand
            )
          }))

        setData(forecastData)
      } catch (error) {
        console.error("Forecast chart loading failed:", error)
      } finally {
        setLoading(false)
      }
    }

    loadForecast()
  }, [])

  return (
    <div className="chart-card">
      <div className="chart-header">
        <div>
          <h2>Demand Forecast</h2>
          <p>Maximum predicted daily demand by product</p>
        </div>

        <span className="chart-badge">7-Day Forecast</span>
      </div>

      <div className="chart-container">
        {loading ? (
          <div className="chart-loading">
            Loading forecast data...
          </div>
        ) : data.length === 0 ? (
          <div className="chart-loading">
            No forecast data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 15,
                right: 20,
                left: 5,
                bottom: 5
              }}
            >
              <CartesianGrid
                strokeDasharray="4 4"
                vertical={false}
              />

              <XAxis
                dataKey="product"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
              />

              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
              />

              <Tooltip
                cursor={{ opacity: 0.08 }}
                formatter={(value) => [
                  `${Number(value).toFixed(2)} units`,
                  "Forecast Demand"
                ]}
              />

              <Bar
                dataKey="forecast"
                name="Forecast Demand"
                radius={[8, 8, 2, 2]}
                barSize={42}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}

export default ForecastChart