import Sidebar from "../components/Sidebar"

function Recommendations({ setPage }) {
  const recommendations = [
    {
      id: "P101",
      name: "Smartphone",
      stock: 120,
      forecast: 63.92,
      order: 327.32,
      risk: "High Risk",
      status: "Critical"
    },
    {
      id: "P102",
      name: "Rice_Bag",
      stock: 450,
      forecast: 34.22,
      order: 0,
      risk: "Low Risk",
      status: "Sufficient"
    }
  ]

  return (
    <div className="dashboard">
      <Sidebar setPage={setPage} />

      <main className="main-content">
        <h1>Inventory Recommendations</h1>
        <p>Recommended stock orders based on inventory analysis.</p>

        <div className="table-container">
          <h2>Recommended Orders</h2>

          <table>
            <thead>
              <tr>
                <th>Product ID</th>
                <th>Product</th>
                <th>Current Stock</th>
                <th>Forecast</th>
                <th>Recommended Order</th>
                <th>Risk</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {recommendations.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.stock}</td>
                  <td>{item.forecast}</td>
                  <td>{item.order}</td>

                  <td
                    className={`risk-${item.risk
                      .toLowerCase()
                      .replace(" ", "-")}`}
                  >
                    {item.risk}
                  </td>

                  <td>{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}

export default Recommendations