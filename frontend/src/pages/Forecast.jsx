import Sidebar from "../components/Sidebar"

function Forecast({ setPage }) {
  const products = [
    {
      id: "P101",
      name: "Smartphone",
      stock: 120,
      averageDailyDemand: 63.84,
      forecast: 63.92
    },
    {
      id: "P102",
      name: "Rice_Bag",
      stock: 450,
      averageDailyDemand: 34.02,
      forecast: 34.22
    }
  ]

  return (
    <div className="dashboard">
      <Sidebar setPage={setPage} />

      <main className="main-content">
        <h1>Demand Forecast</h1>
        <p>View predicted product demand.</p>

        <div className="table-container">
          <h2>Demand Forecast</h2>

          <table>
            <thead>
              <tr>
                <th>Product ID</th>
                <th>Product</th>
                <th>Current Stock</th>
                <th>Average Daily Demand</th>
                <th>Maximum Forecast Demand</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>{product.stock}</td>
                  <td>{product.averageDailyDemand}</td>
                  <td>{product.forecast}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}

export default Forecast