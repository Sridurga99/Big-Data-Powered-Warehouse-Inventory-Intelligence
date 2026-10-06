require("dotenv").config()

const Database = require("better-sqlite3")
const { createClient } = require("@supabase/supabase-js")
const path = require("path")

const db = new Database(path.join(__dirname, "warehouse.db"))

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
)

async function syncProducts() {
  try {
    const products = db
      .prepare("SELECT * FROM products ORDER BY product_id")
      .all()

    console.log(`Found ${products.length} products in SQLite`)

    const data = products.map((product) => ({
      product_id: product.product_id,
      product_name: product.product_name,
      category: product.category,
      warehouse: product.warehouse,
      current_stock: Number(product.current_stock || 0),
      reorder_point: Number(product.reorder_point || 0),
      recommended_order: Number(product.recommended_order || 0),
      average_daily_demand: Number(product.average_daily_demand || 0),
      maximum_forecast_demand: Number(
        product.maximum_forecast_demand || 0
      ),
      demand_std: Number(product.demand_std || 0),
      days_of_inventory: Number(product.days_of_inventory || 0),
      risk_score: Number(product.risk_score || 0),
      risk_category: product.risk_category,
      inventory_status: product.inventory_status,
      unit_price: Number(product.unit_price || 0)
    }))

    const { error } = await supabase
      .from("inventory_intelligence")
      .upsert(data, {
        onConflict: "product_id"
      })

    if (error) {
      throw error
    }

    console.log(
      `Successfully synced ${data.length} products to Supabase`
    )
  } catch (error) {
    console.error("Supabase sync failed:")
    console.error(error.message)
  } finally {
    db.close()
  }
}

syncProducts()
