const fs = require("fs")
const path = require("path")
const Database = require("better-sqlite3")

const dbPath = path.join(__dirname, "warehouse.db")
const csvPath = path.join(
  __dirname,
  "..",
  "ml",
  "output",
  "final_inventory_intelligence.csv"
)

const db = new Database(dbPath)

const csv = fs.readFileSync(csvPath, "utf8").trim()

const lines = csv.split(/\r?\n/)
const headers = lines[0].split(",")

const rows = lines.slice(1).map((line) => {
  const values = line.split(",")

  return headers.reduce((object, header, index) => {
    object[header.trim()] = values[index]?.trim() || ""
    return object
  }, {})
})

const updateProduct = db.prepare(`
  UPDATE products
  SET
    warehouse = @warehouse,
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
    updated_at = CURRENT_TIMESTAMP
  WHERE product_id = @product_id
`)

const migrate = db.transaction(() => {
  for (const row of rows) {
    updateProduct.run({
      product_id: row.product_id,
      warehouse: row.warehouse,
      supplier_id: row.supplier_id,
      lead_time_days: Number(row.lead_time_days) || 0,
      average_daily_demand: Number(row.average_daily_demand) || 0,
      maximum_forecast_demand: Number(row.maximum_forecast_demand) || 0,
      demand_std: Number(row.demand_std) || 0,
      current_stock: Number(row.current_stock) || 0,
      lead_time_demand: Number(row.lead_time_demand) || 0,
      safety_stock: Number(row.safety_stock) || 0,
      reorder_point: Number(row.reorder_point) || 0,
      days_of_inventory: Number(row.days_of_inventory) || 0,
      recommended_order: Number(row.recommended_order) || 0,
      inventory_status: row.inventory_status || "New",
      stock_coverage_ratio: Number(row.stock_coverage_ratio) || 0,
      risk_score: Number(row.risk_score) || 0,
      risk_category: row.risk_category || "Low Risk"
    })
  }
})

migrate()

const products = db
  .prepare(`
    SELECT
      product_id,
      current_stock,
      maximum_forecast_demand,
      recommended_order,
      inventory_status,
      risk_category
    FROM products
    ORDER BY product_id
  `)
  .all()

console.log("ML data migration completed successfully.")
console.table(products)

db.close()
