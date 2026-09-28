import Sidebar from "../components/Sidebar"

function RiskAnalysis({ setPage }) {
  const products = [
    {
      id: "P101",
      name: "Smartphone",
      stock: 120,
      forecast: 63.92,
      riskScore: 73.15,
      risk: "High Risk",
      status: "Critical"
    },
    {
      id: "P102",
      name: "Rice_Bag",
      stock: 450,
      forecast: 34.22,
      riskScore: 0,
      risk: "Low Risk",
      status: "Sufficient"
    }
  ]

  return (
    <div className="dashboard">
      <Sidebar setPage={setPage} />

      <main className="main-content">
        <h1>Risk Analysis</h1>
        <p>Analyze inventory risk levels and stock conditions.</p>

        <div className="table-container">
          <h2>Inventory Risk</h2>

          <table>
            <thead>
              <tr>
                <th>Product ID</th>
                <th>Product</th>
                <th>Current Stock</th>
                <th>Forecast</th>
                <th>Risk Score</th>
                <th>Risk Level</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>{product.stock}</td>
                  <td>{product.forecast}</td>
                  <td>{product.riskScore}</td>

                  <td
                    className={`risk-${product.risk
                      .toLowerCase()
                      .replace(" ", "-")}`}
                  >
                    {product.risk}
                  </td>

                  <td>{product.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}

export default RiskAnalysis