import { useState } from "react"

function ProductTable() {
  const [search, setSearch] = useState("")

  const products = [
    {
      id: "P101",
      name: "Smartphone",
      stock: 120,
      forecast: 63.92,
      risk: "High Risk",
      recommendedOrder: 327.32,
      status: "Critical"
    },
    {
      id: "P102",
      name: "Rice_Bag",
      stock: 450,
      forecast: 34.22,
      risk: "Low Risk",
      recommendedOrder: 0,
      status: "Sufficient"
    }
  ]

  return (
    <div className="table-container">
      <h2>Inventory Overview</h2>

      <input
        type="text"
        placeholder="Search product..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Current Stock</th>
            <th>Forecast</th>
            <th>Risk</th>
            <th>Recommended Order</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {products
            .filter((product) =>
              product.name.toLowerCase().includes(search.toLowerCase())
            )
            .map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.stock}</td>
                <td>{product.forecast}</td>

                <td className={`risk-${product.risk.toLowerCase().replace(" ", "-")}`}>
                  {product.risk}
                </td>

                <td>{product.recommendedOrder}</td>

                <td
                  className={`status-${product.status
                    .toLowerCase()
                    .replace(" ", "-")}`}
                >
                  {product.status}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}

export default ProductTable