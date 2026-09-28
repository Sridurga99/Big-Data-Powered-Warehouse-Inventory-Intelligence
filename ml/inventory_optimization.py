import pandas as pd
from pathlib import Path
import numpy as np

# ---------------------------------------------------------
# 1. Define project locations
# ---------------------------------------------------------

ML_DIR = Path(__file__).resolve().parent

PROJECT_DIR = ML_DIR.parent

# Forecast file created by forecasting.py
FORECAST_FILE = ML_DIR / "output" / "forecast.csv"

# Inventory file from Member 1
INVENTORY_FILE = (
    PROJECT_DIR /
    "data" /
    "inventory.csv"
)

# Supplier file from Member 1
SUPPLIER_FILE = (
    PROJECT_DIR /
    "data" /
    "suppliers.csv"
)

# Output folder
OUTPUT_DIR = ML_DIR / "output"

OUTPUT_DIR.mkdir(exist_ok=True)


# ---------------------------------------------------------
# 2. Load project data
# ---------------------------------------------------------

def load_data():

    print("Loading forecast data...")

    if not FORECAST_FILE.exists():
        raise FileNotFoundError(
            f"Forecast file not found:\n{FORECAST_FILE}\n\n"
            "Please run forecasting.py first."
        )

    forecast = pd.read_csv(
        FORECAST_FILE
    )

    print(
        f"Forecast rows: {len(forecast)}"
    )

    print("\nLoading inventory data...")

    if not INVENTORY_FILE.exists():
        raise FileNotFoundError(
            f"Inventory file not found:\n{INVENTORY_FILE}"
        )

    inventory = pd.read_csv(
        INVENTORY_FILE
    )

    print(
        f"Inventory rows: {len(inventory)}"
    )

    print("\nLoading supplier data...")

    if not SUPPLIER_FILE.exists():
        raise FileNotFoundError(
            f"Supplier file not found:\n{SUPPLIER_FILE}"
        )

    suppliers = pd.read_csv(
        SUPPLIER_FILE
    )

    print(
        f"Supplier rows: {len(suppliers)}"
    )

    return (
        forecast,
        inventory,
        suppliers
    )


# ---------------------------------------------------------
# 3. Calculate demand statistics
# ---------------------------------------------------------

def calculate_demand_statistics(
    forecast,
    product_id
):

    product_forecast = forecast[
        forecast["product_id"] == product_id
    ].copy()

    # Average predicted daily demand
    average_daily_demand = (
        product_forecast[
            "forecast_demand"
        ].mean()
    )

    # Maximum predicted demand
    maximum_daily_demand = (
        product_forecast[
            "forecast_demand"
        ].max()
    )

    # Standard deviation of predicted demand
    demand_std = (
        product_forecast[
            "forecast_demand"
        ].std()
    )

    # If standard deviation is unavailable
    if pd.isna(demand_std):
        demand_std = 0

    return (
        average_daily_demand,
        maximum_daily_demand,
        demand_std
    )


# ---------------------------------------------------------
# 4. Calculate safety stock
# ---------------------------------------------------------

def calculate_safety_stock(
    demand_std,
    lead_time
):

    # Service level approximately 95%
    # Z value = 1.65
    z_value = 1.65

    safety_stock = (
        z_value *
        demand_std *
        np.sqrt(lead_time)
    )

    return round(
        safety_stock,
        2
    )


# ---------------------------------------------------------
# 5. Calculate inventory metrics
# ---------------------------------------------------------

def calculate_inventory_metrics(
    forecast,
    inventory,
    suppliers
):

    results = []

    # Get products
    products = (
        forecast["product_id"]
        .unique()
    )

    for product_id in products:

        print(
            f"\nCalculating inventory metrics "
            f"for {product_id}..."
        )

        # -------------------------------------------------
        # Get forecast statistics
        # -------------------------------------------------

        (
            average_daily_demand,
            maximum_daily_demand,
            demand_std
        ) = calculate_demand_statistics(
            forecast,
            product_id
        )

        # -------------------------------------------------
        # Get inventory information
        # -------------------------------------------------

        inventory_row = inventory[
            inventory["product_id"] ==
            product_id
        ]

        if inventory_row.empty:

            print(
                f"Warning: inventory not found "
                f"for {product_id}"
            )

            continue

        current_stock = (
            inventory_row[
                "stock_level"
            ].iloc[0]
        )

        warehouse = (
            inventory_row[
                "warehouse"
            ].iloc[0]
        )

        # -------------------------------------------------
        # Get supplier information
        # -------------------------------------------------

        supplier_row = suppliers[
            suppliers["product_id"] ==
            product_id
        ]

        if supplier_row.empty:

            print(
                f"Warning: supplier not found "
                f"for {product_id}"
            )

            continue

        supplier_id = (
            supplier_row[
                "supplier_id"
            ].iloc[0]
        )

        lead_time = (
            supplier_row[
                "lead_time"
            ].iloc[0]
        )

        # -------------------------------------------------
        # Lead-time demand
        # -------------------------------------------------

        lead_time_demand = (
            average_daily_demand *
            lead_time
        )

        lead_time_demand = round(
            lead_time_demand,
            2
        )

        # -------------------------------------------------
        # Safety stock
        # -------------------------------------------------

        safety_stock = calculate_safety_stock(
            demand_std,
            lead_time
        )

        # -------------------------------------------------
        # Reorder point
        #
        # ROP =
        # Lead-time demand + Safety stock
        # -------------------------------------------------

        reorder_point = (
            lead_time_demand +
            safety_stock
        )

        reorder_point = round(
            reorder_point,
            2
        )

        # -------------------------------------------------
        # Days of inventory remaining
        # -------------------------------------------------

        if average_daily_demand > 0:

            days_of_inventory = (
                current_stock /
                average_daily_demand
            )

        else:

            days_of_inventory = 0

        days_of_inventory = round(
            days_of_inventory,
            2
        )

        # -------------------------------------------------
        # Recommended order quantity
        # -------------------------------------------------

        if current_stock < reorder_point:

            recommended_order = (
                reorder_point -
                current_stock
            )

        else:

            recommended_order = 0

        recommended_order = max(
            0,
            recommended_order
        )

        recommended_order = round(
            recommended_order,
            2
        )

        # -------------------------------------------------
        # Inventory status
        # -------------------------------------------------

        if current_stock <= lead_time_demand:

            inventory_status = (
                "Critical"
            )

        elif current_stock < reorder_point:

            inventory_status = (
                "Reorder Required"
            )

        else:

            inventory_status = (
                "Sufficient"
            )

        # -------------------------------------------------
        # Store result
        # -------------------------------------------------

        results.append(
            {
                "product_id":
                    product_id,

                "warehouse":
                    warehouse,

                "supplier_id":
                    supplier_id,

                "lead_time_days":
                    lead_time,

                "average_daily_demand":
                    round(
                        average_daily_demand,
                        2
                    ),

                "maximum_forecast_demand":
                    round(
                        maximum_daily_demand,
                        2
                    ),

                "demand_std":
                    round(
                        demand_std,
                        2
                    ),

                "current_stock":
                    current_stock,

                "lead_time_demand":
                    lead_time_demand,

                "safety_stock":
                    safety_stock,

                "reorder_point":
                    reorder_point,

                "days_of_inventory":
                    days_of_inventory,

                "recommended_order":
                    recommended_order,

                "inventory_status":
                    inventory_status
            }
        )

    return pd.DataFrame(
        results
    )


# ---------------------------------------------------------
# 6. Main program
# ---------------------------------------------------------

def main():

    print("=" * 60)
    print(
        "MEMBER 2 - INVENTORY OPTIMIZATION"
    )
    print("=" * 60)

    # -----------------------------------------------------
    # Load data
    # -----------------------------------------------------

    (
        forecast,
        inventory,
        suppliers
    ) = load_data()

    # -----------------------------------------------------
    # Calculate inventory metrics
    # -----------------------------------------------------

    result = calculate_inventory_metrics(
        forecast,
        inventory,
        suppliers
    )

    # -----------------------------------------------------
    # Save result
    # -----------------------------------------------------

    output_file = (
        OUTPUT_DIR /
        "inventory_optimization.csv"
    )

    result.to_csv(
        output_file,
        index=False
    )

    print(
        "\nInventory optimization completed!"
    )

    print(
        "\nOutput file:"
    )

    print(
        output_file
    )

    print(
        "\nInventory optimization results:"
    )

    print(
        result.to_string(
            index=False
        )
    )


# ---------------------------------------------------------
# Run program
# ---------------------------------------------------------

if __name__ == "__main__":
    main()