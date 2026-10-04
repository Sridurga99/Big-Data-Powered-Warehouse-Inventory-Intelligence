import { useState } from "react"

function ProductTable({ products = [] }) {
  const [search, setSearch] = useState("")

  const filteredProducts = products.filter((product) =>
    String(product.product_name || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  return (
    <div className="table-container">
      <div className="table-header">
        <div>
          <h2>Inventory Overview</h2>
          <p>Current warehouse inventory intelligence</p>
        </div>

        <input
          type="text"
          placeholder="Search product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="table-scroll">
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
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="6">
                  No products found.
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => {
                const risk = product.risk_category || "Low Risk"
                const status =
                  product.inventory_status || "Sufficient"

                return (
                  <tr key={product.product_id}>
                    <td>
                      <strong>
                        {product.product_name}
                      </strong>
                    </td>

                    <td>
                      {Number(
                        product.current_stock || 0
                      ).toFixed(0)}
                    </td>

                    <td>
                      {Number(
                        product.maximum_forecast_demand || 0
                      ).toFixed(2)}
                    </td>

                    <td
                      className={`risk-${risk
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                    >
                      {risk}
                    </td>

                    <td>
                      {Number(
                        product.recommended_order || 0
                      ).toFixed(2)}
                    </td>

                    <td
                      className={`status-${status
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                    >
                      {status}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ProductTable