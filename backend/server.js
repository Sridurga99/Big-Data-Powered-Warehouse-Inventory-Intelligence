const express = require("express")
const cors = require("cors")
const Database = require("better-sqlite3")
const fs = require("fs")
const path = require("path")

const app = express()
const PORT = 5000

app.use(cors())
app.use(express.json())

const db = new Database(path.join(__dirname, "warehouse.db"))

db.exec(`
CREATE TABLE IF NOT EXISTS stock_receipts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id TEXT NOT NULL,
  quantity REAL NOT NULL,
  previous_stock REAL NOT NULL,
  updated_stock REAL NOT NULL,
  received_at TEXT NOT NULL
)
`)

function calculateInventoryIntelligence(product) {
  const currentStock = Math.max(0, Number(product.current_stock || 0))
  const averageDailyDemand = Math.max(
    0,
    Number(product.average_daily_demand || 0)
  )
  const leadTimeDemand = Math.max(
    0,
    Number(product.lead_time_demand || 0)
  )
  const safetyStock = Math.max(
    0,
    Number(product.safety_stock || 0)
  )
  const reorderPoint = Math.max(
    0,
    Number(product.reorder_point || leadTimeDemand + safetyStock)
  )

  const daysOfInventory =
    averageDailyDemand > 0
      ? currentStock / averageDailyDemand
      : 0

  const stockCoverageRatio =
    leadTimeDemand > 0
      ? currentStock / leadTimeDemand
      : 1

  const riskScore = Math.max(
    0,
    Math.min(100, (1 - stockCoverageRatio) * 100)
  )

  let riskCategory = "Low Risk"

  if (riskScore >= 70) {
    riskCategory = "High Risk"
  } else if (riskScore >= 40) {
    riskCategory = "Medium Risk"
  }

  const inventoryStatus =
    currentStock < reorderPoint
      ? "Critical"
      : "Sufficient"

  const recommendedOrder = Math.max(
    0,
    reorderPoint - currentStock
  )

  return {
    current_stock: currentStock,
    lead_time_demand: Number(leadTimeDemand.toFixed(2)),
    safety_stock: Number(safetyStock.toFixed(2)),
    reorder_point: Number(reorderPoint.toFixed(2)),
    days_of_inventory: Number(daysOfInventory.toFixed(2)),
    recommended_order: Number(recommendedOrder.toFixed(2)),
    inventory_status: inventoryStatus,
    stock_coverage_ratio: Number(stockCoverageRatio.toFixed(2)),
    risk_score: Number(riskScore.toFixed(2)),
    risk_category: riskCategory,
    updated_at: new Date().toISOString()
  }
}

function getProduct(productId) {
  return db
    .prepare(
      "SELECT * FROM products WHERE product_id = ?"
    )
    .get(productId)
}

app.get("/api/health", (req, res) => {
  res.json({
    status: "online",
    message: "Warehouse Intelligence Backend is running"
  })
})

app.get("/api/products", (req, res) => {
  const products = db
    .prepare(
      "SELECT * FROM products ORDER BY product_id"
    )
    .all()

  res.json(products)
})

app.get("/api/products/:id", (req, res) => {
  const product = getProduct(req.params.id)

  if (!product) {
    return res.status(404).json({
      error: "Product not found"
    })
  }

  res.json(product)
})

app.post("/api/products", (req, res) => {
  try {
    const data = req.body

    if (!data.product_id || !data.product_name) {
      return res.status(400).json({
        error: "Product ID and Product Name are required"
      })
    }

    const existing = getProduct(data.product_id)

    if (existing) {
      return res.status(409).json({
        error: "Product already exists"
      })
    }

    const currentStock = Math.max(
      0,
      Number(data.current_stock || 0)
    )

    const averageDailyDemand = Math.max(
      0,
      Number(data.average_daily_demand || 0)
    )

    const leadTimeDays = Math.max(
      0,
      Number(data.lead_time_days || 0)
    )

    const leadTimeDemand = Math.max(
      0,
      Number(
        data.lead_time_demand ||
          averageDailyDemand * leadTimeDays
      )
    )

    const safetyStock = Math.max(
      0,
      Number(data.safety_stock || 0)
    )

    const reorderPoint = Math.max(
      0,
      Number(
        data.reorder_point ||
          leadTimeDemand + safetyStock
      )
    )

    const product = {
      ...data,
      current_stock: currentStock,
      lead_time_demand: leadTimeDemand,
      safety_stock: safetyStock,
      reorder_point: reorderPoint
    }

    const intelligence =
      calculateInventoryIntelligence(product)

    db.prepare(`
      INSERT INTO products (
        product_id,
        product_name,
        category,
        warehouse,
        unit_price,
        supplier_id,
        lead_time_days,
        average_daily_demand,
        maximum_forecast_demand,
        demand_std,
        current_stock,
        lead_time_demand,
        safety_stock,
        reorder_point,
        days_of_inventory,
        recommended_order,
        inventory_status,
        stock_coverage_ratio,
        risk_score,
        risk_category,
        created_at,
        updated_at
      )
      VALUES (
        @product_id,
        @product_name,
        @category,
        @warehouse,
        @unit_price,
        @supplier_id,
        @lead_time_days,
        @average_daily_demand,
        @maximum_forecast_demand,
        @demand_std,
        @current_stock,
        @lead_time_demand,
        @safety_stock,
        @reorder_point,
        @days_of_inventory,
        @recommended_order,
        @inventory_status,
        @stock_coverage_ratio,
        @risk_score,
        @risk_category,
        @created_at,
        @updated_at
      )
    `).run({
      product_id: data.product_id,
      product_name: data.product_name,
      category: data.category || "",
      warehouse: data.warehouse || "",
      unit_price: Number(data.unit_price || 0),
      supplier_id: data.supplier_id || "NEW",
      lead_time_days: leadTimeDays,
      average_daily_demand: averageDailyDemand,
      maximum_forecast_demand: Number(
        data.maximum_forecast_demand || 0
      ),
      demand_std: Number(data.demand_std || 0),
      current_stock: intelligence.current_stock,
      lead_time_demand: intelligence.lead_time_demand,
      safety_stock: intelligence.safety_stock,
      reorder_point: intelligence.reorder_point,
      days_of_inventory: intelligence.days_of_inventory,
      recommended_order: intelligence.recommended_order,
      inventory_status: intelligence.inventory_status,
      stock_coverage_ratio:
        intelligence.stock_coverage_ratio,
      risk_score: intelligence.risk_score,
      risk_category: intelligence.risk_category,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })

    res.status(201).json(getProduct(data.product_id))
  } catch (error) {
    res.status(500).json({
      error: error.message
    })
  }
})

app.put("/api/products/:id", (req, res) => {
  try {
    const existing = getProduct(req.params.id)

    if (!existing) {
      return res.status(404).json({
        error: "Product not found"
      })
    }

    const data = {
      ...existing,
      ...req.body
    }

    const intelligence =
      calculateInventoryIntelligence(data)

    db.prepare(`
      UPDATE products
      SET
        product_name = @product_name,
        category = @category,
        warehouse = @warehouse,
        unit_price = @unit_price,
        supplier_id = @supplier_id,
        lead_time_days = @lead_time_days,
        average_daily_demand = @average_daily_demand,
        maximum_forecast_demand = @maximum_forecast_demand,
        demand_std = @demand_std,
        current_stock = @current_stock,
        lead_time_demand = @lead_time_demand,
        safety_stock = @safety_stock,
        reorder_point = @reorder_point,
        days_of_inventory = @days_of_inventory,
        recommended_order = @recommended_order,
        inventory_status = @inventory_status,
        stock_coverage_ratio = @stock_coverage_ratio,
        risk_score = @risk_score,
        risk_category = @risk_category,
        updated_at = @updated_at
      WHERE product_id = @product_id
    `).run({
      product_id: req.params.id,
      product_name: data.product_name,
      category: data.category || "",
      warehouse: data.warehouse || "",
      unit_price: Number(data.unit_price || 0),
      supplier_id: data.supplier_id || "NEW",
      lead_time_days: Number(data.lead_time_days || 0),
      average_daily_demand: Number(
        data.average_daily_demand || 0
      ),
      maximum_forecast_demand: Number(
        data.maximum_forecast_demand || 0
      ),
      demand_std: Number(data.demand_std || 0),
      ...intelligence
    })

    res.json(getProduct(req.params.id))
  } catch (error) {
    res.status(500).json({
      error: error.message
    })
  }
})

app.post(
  "/api/products/:id/receive",
  (req, res) => {
    try {
      const product = getProduct(req.params.id)

      if (!product) {
        return res.status(404).json({
          error: "Product not found"
        })
      }

      const quantity = Number(req.body.quantity)

      if (!Number.isFinite(quantity) || quantity <= 0) {
        return res.status(400).json({
          error: "Received quantity must be greater than 0"
        })
      }

      const previousStock = Number(
        product.current_stock || 0
      )

      const updatedStock =
        previousStock + quantity

      const intelligence =
        calculateInventoryIntelligence({
          ...product,
          current_stock: updatedStock
        })

      const transaction = db.transaction(() => {
        db.prepare(`
          UPDATE products
          SET
            current_stock = @current_stock,
            lead_time_demand = @lead_time_demand,
            safety_stock = @safety_stock,
            reorder_point = @reorder_point,
            days_of_inventory = @days_of_inventory,
            recommended_order = @recommended_order,
            inventory_status = @inventory_status,
            stock_coverage_ratio = @stock_coverage_ratio,
            risk_score = @risk_score,
            risk_category = @risk_category,
            updated_at = @updated_at
          WHERE product_id = @product_id
        `).run({
          product_id: product.product_id,
          ...intelligence
        })

        db.prepare(`
          INSERT INTO stock_receipts (
            product_id,
            quantity,
            previous_stock,
            updated_stock,
            received_at
          )
          VALUES (?, ?, ?, ?, ?)
        `).run(
          product.product_id,
          quantity,
          previousStock,
          updatedStock,
          new Date().toISOString()
        )
      })

      transaction()

      res.json({
        message: "Stock received successfully",
        received_quantity: quantity,
        previous_stock: previousStock,
        updated_stock: updatedStock,
        product: getProduct(req.params.id)
      })
    } catch (error) {
      res.status(500).json({
        error: error.message
      })
    }
  }
)

app.get(
  "/api/products/:id/receipts",
  (req, res) => {
    const product = getProduct(req.params.id)

    if (!product) {
      return res.status(404).json({
        error: "Product not found"
      })
    }

    const receipts = db
      .prepare(`
        SELECT *
        FROM stock_receipts
        WHERE product_id = ?
        ORDER BY received_at DESC
      `)
      .all(req.params.id)

    res.json(receipts)
  }
)

app.delete("/api/products/:id", (req, res) => {
  const product = getProduct(req.params.id)

  if (!product) {
    return res.status(404).json({
      error: "Product not found"
    })
  }

  db.prepare(
    "DELETE FROM stock_receipts WHERE product_id = ?"
  ).run(req.params.id)

  db.prepare(
    "DELETE FROM products WHERE product_id = ?"
  ).run(req.params.id)

  res.json({
    message: "Product deleted successfully"
  })
})

app.get("/api/forecast", (req, res) => {
  try {
    const forecastPath = path.join(
      __dirname,
      "..",
      "ml",
      "output",
      "forecast.csv"
    )

    if (!fs.existsSync(forecastPath)) {
      return res.status(404).json({
        error: "Forecast file not found"
      })
    }

    const lines = fs
      .readFileSync(forecastPath, "utf8")
      .trim()
      .split("\n")

    const headers = lines[0].split(",")

    const forecast = lines
      .slice(1)
      .filter(Boolean)
      .map((line) => {
        const values = line.split(",")

        return {
          [headers[0]]: values[0],
          [headers[1]]: values[1],
          [headers[2]]: Number(values[2])
        }
      })

    res.json(forecast)
  } catch (error) {
    res.status(500).json({
      error: error.message
    })
  }
})

app.get(
  "/api/forecast/:productId",
  (req, res) => {
    try {
      const forecastPath = path.join(
        __dirname,
        "..",
        "ml",
        "output",
        "forecast.csv"
      )

      if (!fs.existsSync(forecastPath)) {
        return res.status(404).json({
          error: "Forecast file not found"
        })
      }

      const lines = fs
        .readFileSync(forecastPath, "utf8")
        .trim()
        .split("\n")

      const forecast = lines
        .slice(1)
        .filter(Boolean)
        .map((line) => {
          const values = line.split(",")

          return {
            date: values[0],
            product_id: values[1],
            forecast_demand: Number(values[2])
          }
        })
        .filter(
          (item) =>
            item.product_id === req.params.productId
        )

      res.json(forecast)
    } catch (error) {
      res.status(500).json({
        error: error.message
      })
    }
  }
)
app.get("/api/powerbi/inventory", (req, res) => {
  try {
    const products = db
      .prepare(`
        SELECT
          product_id,
          product_name,
          category,
          warehouse,
          unit_price,
          supplier_id,
          lead_time_days,
          average_daily_demand,
          maximum_forecast_demand,
          demand_std,
          current_stock,
          lead_time_demand,
          safety_stock,
          reorder_point,
          days_of_inventory,
          recommended_order,
          inventory_status,
          stock_coverage_ratio,
          risk_score,
          risk_category,
          created_at,
          updated_at
        FROM products
        ORDER BY product_id
      `)
      .all()

    res.json(products)
  } catch (error) {
    res.status(500).json({
      error: error.message
    })
  }
})
app.listen(PORT, () => {
  console.log(
    `Warehouse Intelligence Backend running on http://localhost:${PORT}`
  )
})
