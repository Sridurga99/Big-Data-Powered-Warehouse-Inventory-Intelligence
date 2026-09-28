import Sidebar from "../components/Sidebar"

function Inventory({ setPage }) {
  const products = [
    {
      id: "P101",
      name: "Smartphone",
      warehouse: "W01",
      stock: 120,
      forecast: 63.92,
      risk: "High Risk",
      status: "Critical"
    },
    {
      id: "P102",
      name: "Rice_Bag",
      warehouse: "W01",
      stock: 450,
      forecast: 34.22,
      risk: "Low Risk",
      status: "Sufficient"
    }
  ]

  return (
    <div className="dashboard">
      <Sidebar setPage={setPage} />

      <main className="main-content">
        <h1>Inventory Management</h1>
        <p>View current inventory and stock conditions.</p>

        <div className="table-container">
          <h2>Current Inventory</h2>

          <table>
            <thead>
              <tr>
                <th>Product ID</th>
                <th>Product</th>
                <th>Warehouse</th>
                <th>Current Stock</th>
                <th>Forecast</th>
                <th>Risk</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>{product.warehouse}</td>
                  <td>{product.stock}</td>
                  <td>{product.forecast}</td>

                  <td className={`risk-${product.risk.toLowerCase().replace(" ", "-")}`}>
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

export default Inventory