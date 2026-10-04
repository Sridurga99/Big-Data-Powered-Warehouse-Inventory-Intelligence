const Database = require("better-sqlite3")
const fs = require("fs")

const db = new Database("backend/warehouse.db")

function readCsv(file) {
  const lines = fs.readFileSync(file, "utf8").trim().split("\n")
  const headers = lines[0].split(",")
  return lines.slice(1).map(line => {
    const values = line.split(",")
    const row = {}
    headers.forEach((header, i) => {
      row[header] = values[i]
    })
    return row
  })
}

const products = readCsv("data/products.csv")
const inventory = readCsv("ml/output/inventory_optimization.csv")

const productMap = new Map(
  products.map(p => [p.product_id, p])
)

const upsert = db.prepare(`
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
    COALESCE((SELECT created_at FROM products WHERE product_id = @product_id), datetime('now')),
    datetime('now')
  )
  ON CONFLICT(product_id) DO UPDATE SET
    product_name = excluded.product_name,
    category = excluded.category,
    warehouse = excluded.warehouse,
    unit_price = excluded.unit_price,
    supplier_id = excluded.supplier_id,
    lead_time_days = excluded.lead_time_days,
    average_daily_demand = excluded.average_daily_demand,
    maximum_forecast_demand = excluded.maximum_forecast_demand,
    demand_std = excluded.demand_std,
    current_stock = excluded.current_stock,
    lead_time_demand = excluded.lead_time_demand,
    safety_stock = excluded.safety_stock,
    reorder_point = excluded.reorder_point,
    days_of_inventory = excluded.days_of_inventory,
    recommended_order = excluded.recommended_order,
    inventory_status = excluded.inventory_status,
    stock_coverage_ratio = excluded.stock_coverage_ratio,
    risk_score = excluded.risk_score,
    risk_category = excluded.risk_category,
    updated_at = datetime('now')
`)

const sync = db.transaction(() => {
  for (const row of inventory) {
    const product = productMap.get(row.product_id)

    if (!product) {
      throw new Error(`Product ${row.product_id} not found in products.csv`)
    }

    const riskScore = Math.min(
      100,
      Math.max(
        0,
        (Number(row.recommended_order) / Math.max(Number(row.reorder_point), 1)) * 100
      )
    )

    const stockCoverageRatio =
      Number(row.reorder_point) > 0
        ? Number(row.current_stock) / Number(row.reorder_point)
        : 0

    upsert.run({
      product_id: row.product_id,
      product_name: product.product_name,
      category: product.category,
      warehouse: row.warehouse,
      unit_price: Number(product.unit_price),
      supplier_id: row.supplier_id,
      lead_time_days: Number(row.lead_time_days),
      average_daily_demand: Number(row.average_daily_demand),
      maximum_forecast_demand: Number(row.maximum_forecast_demand),
      demand_std: Number(row.demand_std),
      current_stock: Number(row.current_stock),
      lead_time_demand: Number(row.lead_time_demand),
      safety_stock: Number(row.safety_stock),
      reorder_point: Number(row.reorder_point),
      days_of_inventory: Number(row.days_of_inventory),
      recommended_order: Number(row.recommended_order),
      inventory_status: row.inventory_status,
      stock_coverage_ratio: stockCoverageRatio,
      risk_score: riskScore,
      risk_category:
        riskScore >= 70
          ? "High Risk"
          : riskScore >= 40
            ? "Medium Risk"
            : "Low Risk"
    })
  }
})

sync()

console.log("ML inventory sync completed successfully!")

const result = db
  .prepare("SELECT COUNT(*) AS count FROM products")
  .get()

console.log(`Products in backend database: ${result.count}`)

db.close()
