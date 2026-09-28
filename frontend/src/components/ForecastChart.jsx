function ForecastChart() {
  const data = [
    { product: "Rice", demand: 150 },
    { product: "Cooking Oil", demand: 80 },
    { product: "Sugar", demand: 75 },
    { product: "Milk", demand: 60 }
  ]

  return (
    <div className="table-container">
      <h2>Demand Forecast</h2>

      {data.map((item) => (
        <div className="forecast-item" key={item.product}>
          <div className="forecast-label">
            <span>{item.product}</span>
            <span>{item.demand}</span>
          </div>

          <div className="forecast-bar">
            <div
              className="forecast-fill"
              style={{ width: `${item.demand / 1.5}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ForecastChart