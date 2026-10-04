import { useEffect, useState } from "react"

function Inventory({ setPage }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [showReceive, setShowReceive] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [receivingProduct, setReceivingProduct] = useState(null)
  const [receiveQuantity, setReceiveQuantity] = useState("")
  const [message, setMessage] = useState("")
  const [form, setForm] = useState({
    product_id: "",
    product_name: "",
    category: "",
    warehouse: "",
    unit_price: "",
    supplier_id: "",
    lead_time_days: "",
    current_stock: ""
  })

  const loadProducts = async () => {
    try {
      setLoading(true)
      setError("")

      const response = await fetch(
        "http://localhost:5000/api/products"
      )

      if (!response.ok) {
        throw new Error("Unable to load products")
      }

      const data = await response.json()
      setProducts(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const resetForm = () => {
    setForm({
      product_id: "",
      product_name: "",
      category: "",
      warehouse: "",
      unit_price: "",
      supplier_id: "",
      lead_time_days: "",
      current_stock: ""
    })
    setEditingProduct(null)
  }

  const handleInput = (event) => {
    const { name, value } = event.target

    setForm((current) => ({
      ...current,
      [name]: value
    }))
  }

  const openAdd = () => {
    resetForm()
    setShowForm(true)
    setMessage("")
  }

  const openEdit = (product) => {
    setEditingProduct(product)

    setForm({
      product_id: product.product_id,
      product_name: product.product_name || "",
      category: product.category || "",
      warehouse: product.warehouse || "",
      unit_price: product.unit_price || "",
      supplier_id: product.supplier_id || "",
      lead_time_days: product.lead_time_days || "",
      current_stock: product.current_stock || ""
    })

    setShowForm(true)
    setMessage("")
  }

  const saveProduct = async (event) => {
    event.preventDefault()

    try {
      const payload = {
        product_name: form.product_name,
        category: form.category,
        warehouse: form.warehouse,
        unit_price: Number(form.unit_price || 0),
        supplier_id: form.supplier_id,
        lead_time_days: Number(form.lead_time_days || 0),
        current_stock: Number(form.current_stock || 0)
      }

      const url = editingProduct
        ? `http://localhost:5000/api/products/${editingProduct.product_id}`
        : "http://localhost:5000/api/products"

      const method = editingProduct ? "PUT" : "POST"

      if (!editingProduct) {
        payload.product_id = form.product_id
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to save product"
        )
      }

      setMessage(
        editingProduct
          ? "Product updated successfully."
          : "Product added successfully."
      )

      setShowForm(false)
      resetForm()
      await loadProducts()
    } catch (err) {
      setMessage(err.message)
    }
  }

  const deleteProduct = async (productId) => {
    const confirmed = window.confirm(
      `Delete ${productId}?`
    )

    if (!confirmed) {
      return
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/products/${productId}`,
        {
          method: "DELETE"
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to delete product"
        )
      }

      setMessage("Product deleted successfully.")
      await loadProducts()
    } catch (err) {
      setMessage(err.message)
    }
  }

  const openReceive = (product) => {
    setReceivingProduct(product)
    setReceiveQuantity("")
    setShowReceive(true)
    setMessage("")
  }

  const receiveStock = async (event) => {
    event.preventDefault()

    const quantity = Number(receiveQuantity)

    if (!Number.isFinite(quantity) || quantity <= 0) {
      setMessage(
        "Enter a received quantity greater than 0."
      )
      return
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/products/${receivingProduct.product_id}/receive`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            quantity
          })
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to receive stock"
        )
      }

      setShowReceive(false)
      setReceivingProduct(null)
      setReceiveQuantity("")

      setMessage(
        `${quantity} units received. Current stock is now ${Number(
          data.updated_stock
        ).toFixed(0)}.`
      )

      await loadProducts()
    } catch (err) {
      setMessage(err.message)
    }
  }

  const filteredProducts = products.filter((product) => {
    const text = `
      ${product.product_id}
      ${product.product_name}
      ${product.category}
      ${product.warehouse}
    `.toLowerCase()

    return text.includes(search.toLowerCase())
  })

  const totalProducts = products.length

  const totalStock = products.reduce(
    (total, product) =>
      total + Number(product.current_stock || 0),
    0
  )

  const lowStockProducts = products.filter(
    (product) =>
      Number(product.current_stock || 0) <=
      Number(product.reorder_point || 0)
  ).length

  const highRiskProducts = products.filter(
    (product) =>
      product.risk_category === "High Risk"
  ).length

  const riskClass = (risk) =>
    String(risk || "Low Risk")
      .toLowerCase()
      .replace(/\s+/g, "-")

  const statusClass = (status) =>
    String(status || "Sufficient")
      .toLowerCase()
      .replace(/\s+/g, "-")

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-mark">W</div>
          <div>
            <h2>Warehouse AI</h2>
            <span>Inventory Intelligence</span>
          </div>
        </div>

        <div className="sidebar-section-title">
          MAIN MENU
        </div>

        <nav className="sidebar-nav">
          <button
            type="button"
            className="sidebar-link"
            onClick={() => setPage("dashboard")}
          >
            <span className="sidebar-icon">▦</span>
            <span>Dashboard</span>
          </button>

          <button
            type="button"
            className="sidebar-link active"
            onClick={() => setPage("inventory")}
          >
            <span className="sidebar-icon">▤</span>
            <span>Inventory</span>
          </button>

          <button
            type="button"
            className="sidebar-link"
            onClick={() => setPage("forecast")}
          >
            <span className="sidebar-icon">⌁</span>
            <span>Demand Forecast</span>
          </button>

          <button
            type="button"
            className="sidebar-link"
            onClick={() => setPage("recommendations")}
          >
            <span className="sidebar-icon">↗</span>
            <span>Recommendations</span>
          </button>

          <button
            type="button"
            className="sidebar-link"
            onClick={() => setPage("risk")}
          >
            <span className="sidebar-icon">◈</span>
            <span>Risk Analysis</span>
          </button>

          <button
            type="button"
            className="sidebar-link"
            onClick={() => setPage("powerbi")}
          >
            <span className="sidebar-icon">📊</span>
            <span>Power BI</span>
          </button>
        </nav>

        <div className="sidebar-bottom">
          <div className="system-status">
            <span className="status-dot"></span>
            <div>
              <strong>System Online</strong>
              <small>ML pipeline connected</small>
            </div>
          </div>
        </div>
      </aside>

      <main className="main-content inventory-page">
        <div className="page-header inventory-header inventory-hero">
          <div className="inventory-hero-glow inventory-hero-glow-one"></div>
          <div className="inventory-hero-glow inventory-hero-glow-two"></div>

          <div className="inventory-floating-items">
            <span className="inventory-float box-one">📦</span>
            <span className="inventory-float box-two">📊</span>
            <span className="inventory-float box-three">🚚</span>
            <span className="inventory-float box-four">📦</span>
            <span className="inventory-float box-five">🏭</span>
            <span className="inventory-float box-six">↗</span>
          </div>

          <div className="inventory-hero-content">
            <p className="eyebrow">
              INVENTORY MANAGEMENT
            </p>

            <h1>Warehouse Inventory</h1>

            <p>
              Manage current stock and record incoming inventory.
            </p>

            <div className="inventory-hero-tags">
              <span>LIVE STOCK</span>
              <span>WAREHOUSE</span>
              <span>SMART INVENTORY</span>
            </div>
          </div>

          <button
            type="button"
            className="primary-button"
            onClick={openAdd}
          >
            + Add Product
          </button>
        </div>

        <section className="inventory-overview">
          <div className="inventory-overview-card overview-products">
            <div className="overview-icon">▤</div>
            <div>
              <span>Total Products</span>
              <strong>{totalProducts}</strong>
              <small>Products tracked</small>
            </div>
          </div>

          <div className="inventory-overview-card overview-stock">
            <div className="overview-icon">📦</div>
            <div>
              <span>Total Stock</span>
              <strong>{totalStock.toFixed(0)}</strong>
              <small>Units currently available</small>
            </div>
          </div>

          <div className="inventory-overview-card overview-low">
            <div className="overview-icon">!</div>
            <div>
              <span>Low Stock</span>
              <strong>{lowStockProducts}</strong>
              <small>Need attention</small>
            </div>
          </div>

          <div className="inventory-overview-card overview-risk">
            <div className="overview-icon">◈</div>
            <div>
              <span>High Risk</span>
              <strong>{highRiskProducts}</strong>
              <small>Risk flagged products</small>
            </div>
          </div>
        </section>

        {message && (
          <div className="inventory-message">
            <span>✓</span>
            {message}
          </div>
        )}

        <section className="inventory-toolbar">
          <div>
            <p className="section-label">
              LIVE INVENTORY
            </p>

            <h2>Product Inventory</h2>

            <p>
              Live inventory intelligence from the backend.
            </p>
          </div>

          <div className="inventory-search">
            <span>⌕</span>

            <input
              type="text"
              placeholder="Search product, category or warehouse..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />
          </div>
        </section>

        {loading && (
          <div className="inventory-empty">
            <div className="inventory-loader-icon">📦</div>
            <strong>Loading warehouse inventory</strong>
            <span>Connecting to inventory intelligence...</span>
          </div>
        )}

        {error && !loading && (
          <div className="inventory-empty inventory-error">
            <div className="inventory-loader-icon">!</div>
            <strong>Unable to load inventory</strong>
            <span>{error}</span>
          </div>
        )}

        {!loading && !error && (
          <div className="inventory-table-card">
            <div className="table-card-header">
              <div>
                <span className="table-live-dot"></span>
                LIVE DATA
              </div>

              <span>
                {filteredProducts.length} of {products.length} products
              </span>
            </div>

            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Warehouse</th>
                    <th>Current Stock</th>
                    <th>Reorder Point</th>
                    <th>Risk</th>
                    <th>Status</th>
                    <th>Recommended Order</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan="8">
                        No products found.
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((product) => (
                      <tr key={product.product_id}>
                        <td>
                          <div className="product-cell">
                            <div className="product-box-icon">
                              📦
                            </div>

                            <div>
                              <strong>
                                {product.product_name}
                              </strong>

                              <small>
                                {product.product_id}
                              </small>
                            </div>
                          </div>
                        </td>

                        <td>
                          <span className="warehouse-badge">
                            {product.warehouse}
                          </span>
                        </td>

                        <td>
                          <div className="stock-value">
                            <strong>
                              {Number(
                                product.current_stock || 0
                              ).toFixed(0)}
                            </strong>

                            <span>units</span>
                          </div>
                        </td>

                        <td>
                          {Number(
                            product.reorder_point || 0
                          ).toFixed(2)}
                        </td>

                        <td
                          className={`risk-${riskClass(
                            product.risk_category
                          )}`}
                        >
                          <span className="status-pill">
                            {product.risk_category}
                          </span>
                        </td>

                        <td
                          className={`status-${statusClass(
                            product.inventory_status
                          )}`}
                        >
                          <span className="status-pill">
                            {product.inventory_status}
                          </span>
                        </td>

                        <td>
                          <strong>
                            {Number(
                              product.recommended_order || 0
                            ).toFixed(2)}
                          </strong>
                        </td>

                        <td>
                          <div className="inventory-actions">
                            <button
                              type="button"
                              className="receive-button"
                              onClick={() =>
                                openReceive(product)
                              }
                            >
                              + Receive
                            </button>

                            <button
                              type="button"
                              className="edit-button"
                              onClick={() =>
                                openEdit(product)
                              }
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              className="delete-button"
                              onClick={() =>
                                deleteProduct(
                                  product.product_id
                                )
                              }
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {showForm && (
          <div className="inventory-modal-overlay">
            <div className="inventory-modal">
              <div className="inventory-modal-header">
                <div>
                  <p className="eyebrow">
                    INVENTORY MANAGEMENT
                  </p>

                  <h2>
                    {editingProduct
                      ? "Edit Product"
                      : "Add Product"}
                  </h2>
                </div>

                <button
                  type="button"
                  className="modal-close"
                  onClick={() => {
                    setShowForm(false)
                    resetForm()
                  }}
                >
                  ×
                </button>
              </div>

              <form onSubmit={saveProduct}>
                <div className="inventory-form-grid">
                  <label>
                    Product ID
                    <input
                      name="product_id"
                      value={form.product_id}
                      onChange={handleInput}
                      disabled={Boolean(editingProduct)}
                      required
                    />
                  </label>

                  <label>
                    Product Name
                    <input
                      name="product_name"
                      value={form.product_name}
                      onChange={handleInput}
                      required
                    />
                  </label>

                  <label>
                    Category
                    <input
                      name="category"
                      value={form.category}
                      onChange={handleInput}
                    />
                  </label>

                  <label>
                    Warehouse
                    <input
                      name="warehouse"
                      value={form.warehouse}
                      onChange={handleInput}
                    />
                  </label>

                  <label>
                    Unit Price
                    <input
                      name="unit_price"
                      type="number"
                      min="0"
                      value={form.unit_price}
                      onChange={handleInput}
                    />
                  </label>

                  <label>
                    Supplier ID
                    <input
                      name="supplier_id"
                      value={form.supplier_id}
                      onChange={handleInput}
                    />
                  </label>

                  <label>
                    Lead Time Days
                    <input
                      name="lead_time_days"
                      type="number"
                      min="0"
                      value={form.lead_time_days}
                      onChange={handleInput}
                    />
                  </label>

                  <label>
                    Current Stock
                    <input
                      name="current_stock"
                      type="number"
                      min="0"
                      value={form.current_stock}
                      onChange={handleInput}
                    />
                  </label>
                </div>

                <div className="inventory-form-actions">
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => {
                      setShowForm(false)
                      resetForm()
                    }}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="primary-button"
                  >
                    {editingProduct
                      ? "Save Changes"
                      : "Add Product"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showReceive && receivingProduct && (
          <div className="inventory-modal-overlay">
            <div className="inventory-modal receive-modal">
              <div className="inventory-modal-header">
                <div>
                  <p className="eyebrow">
                    STOCK RECEIPT
                  </p>

                  <h2>Receive Inventory</h2>
                </div>

                <button
                  type="button"
                  className="modal-close"
                  onClick={() => {
                    setShowReceive(false)
                    setReceivingProduct(null)
                  }}
                >
                  ×
                </button>
              </div>

              <div className="receive-product-summary">
                <div className="receive-product-icon">
                  📦
                </div>

                <strong>
                  {receivingProduct.product_name}
                </strong>

                <span>
                  {receivingProduct.product_id} ·{" "}
                  {receivingProduct.warehouse}
                </span>

                <div className="receive-stock-row">
                  <span>Current stock</span>

                  <strong>
                    {Number(
                      receivingProduct.current_stock || 0
                    ).toFixed(0)}
                  </strong>
                </div>
              </div>

              <form onSubmit={receiveStock}>
                <label>
                  Quantity Received

                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={receiveQuantity}
                    onChange={(event) =>
                      setReceiveQuantity(
                        event.target.value
                      )
                    }
                    placeholder="Enter quantity"
                    autoFocus
                    required
                  />
                </label>

                {Number(receiveQuantity) > 0 && (
                  <div className="receive-preview">
                    <span>Updated stock</span>

                    <strong>
                      {(
                        Number(
                          receivingProduct.current_stock ||
                            0
                        ) +
                        Number(receiveQuantity || 0)
                      ).toFixed(0)}
                    </strong>
                  </div>
                )}

                <div className="inventory-form-actions">
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => {
                      setShowReceive(false)
                      setReceivingProduct(null)
                    }}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="primary-button"
                  >
                    Receive Stock
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default Inventory