import csv
import os
import random
import math
from datetime import date, timedelta

random.seed(42)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")

products = [
    ["P101", "Smartphone", "Electronics", 2500],
    ["P102", "Rice_Bag", "Grocery", 450],
    ["P103", "Cooking_Oil", "Grocery", 180],
    ["P104", "Sugar", "Grocery", 55],
    ["P105", "Laptop", "Electronics", 55000],
    ["P106", "Headphones", "Electronics", 1800],
    ["P107", "Television", "Electronics", 42000],
    ["P108", "Refrigerator", "Appliances", 38000],
    ["P109", "Washing_Machine", "Appliances", 32000],
    ["P110", "Air_Conditioner", "Appliances", 45000],
    ["P111", "Milk_Powder", "Grocery", 320],
    ["P112", "Wheat_Flour", "Grocery", 280],
    ["P113", "Biscuits", "Grocery", 40],
    ["P114", "Tea_Powder", "Grocery", 220],
    ["P115", "Coffee_Powder", "Grocery", 350],
    ["P116", "Shampoo", "Personal Care", 180],
    ["P117", "Soap", "Personal Care", 45],
    ["P118", "Toothpaste", "Personal Care", 110],
    ["P119", "Detergent", "Household", 260],
    ["P120", "Dishwash_Liquid", "Household", 190],
    ["P121", "Notebook", "Stationery", 70],
    ["P122", "Pen_Pack", "Stationery", 60],
    ["P123", "Printer", "Electronics", 12500],
    ["P124", "Keyboard", "Electronics", 900],
    ["P125", "Mouse", "Electronics", 600],
    ["P126", "Power_Bank", "Electronics", 1400],
    ["P127", "LED_Bulb", "Electrical", 180],
    ["P128", "Extension_Box", "Electrical", 450],
    ["P129", "Water_Bottle", "Household", 300],
    ["P130", "Lunch_Box", "Household", 420]
]

warehouses = [
    "W01", "W01", "W01", "W01", "W02", "W02",
    "W02", "W02", "W03", "W03", "W03", "W03",
    "W04", "W04", "W04", "W04", "W05", "W05",
    "W05", "W05", "W01", "W01", "W02", "W02",
    "W03", "W03", "W04", "W04", "W05", "W05"
]

supplier_data = [
    ["P101", "S01", 7],
    ["P102", "S02", 3],
    ["P103", "S03", 5],
    ["P104", "S04", 4],
    ["P105", "S05", 10],
    ["P106", "S06", 6],
    ["P107", "S07", 5],
    ["P108", "S08", 8],
    ["P109", "S09", 6],
    ["P110", "S10", 9],
    ["P111", "S11", 4],
    ["P112", "S12", 3],
    ["P113", "S13", 4],
    ["P114", "S14", 5],
    ["P115", "S15", 6],
    ["P116", "S16", 4],
    ["P117", "S17", 3],
    ["P118", "S18", 5],
    ["P119", "S19", 7],
    ["P120", "S20", 6],
    ["P121", "S21", 4],
    ["P122", "S22", 3],
    ["P123", "S23", 8],
    ["P124", "S24", 5],
    ["P125", "S25", 4],
    ["P126", "S26", 6],
    ["P127", "S27", 3],
    ["P128", "S28", 5],
    ["P129", "S29", 4],
    ["P130", "S30", 6]
]

inventory_stock = {
    "P101": 300,
    "P102": 500,
    "P103": 350,
    "P104": 600,
    "P105": 80,
    "P106": 220
}

category_demand = {
    "Grocery": (80, 160),
    "Electronics": (45, 110),
    "Appliances": (30, 75),
    "Personal Care": (50, 110),
    "Household": (45, 100),
    "Stationery": (35, 80),
    "Electrical": (40, 90)
}

start_date = date(2024, 4, 1)
days = 730
transactions_per_product_per_day = 20

promotion_dates = {
    date(2024, 5, 10),
    date(2024, 6, 15),
    date(2024, 8, 15),
    date(2024, 10, 2),
    date(2024, 11, 11),
    date(2024, 12, 25),
    date(2025, 1, 26),
    date(2025, 2, 14),
    date(2025, 4, 14),
    date(2025, 8, 15),
    date(2025, 10, 2),
    date(2025, 11, 11),
    date(2025, 12, 25)
}

holiday_dates = {
    date(2024, 5, 1),
    date(2024, 8, 15),
    date(2024, 10, 2),
    date(2024, 12, 25),
    date(2025, 1, 26),
    date(2025, 8, 15),
    date(2025, 10, 2),
    date(2025, 12, 25)
}

os.makedirs(DATA_DIR, exist_ok=True)

with open(os.path.join(DATA_DIR, "products.csv"), "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(["product_id", "product_name", "category", "unit_price"])
    writer.writerows(products)

with open(os.path.join(DATA_DIR, "inventory.csv"), "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(["product_id", "warehouse", "stock_level"])

    for i, product in enumerate(products):
        product_id = product[0]
        warehouse = warehouses[i]

        if product_id in inventory_stock:
            stock = inventory_stock[product_id]
        else:
            category = product[2]
            low, high = category_demand[category]
            base = (low + high) // 2
            lead_time = supplier_data[i][2]
            factor = random.uniform(0.8, 1.6)
            stock = max(
                50,
                round(base * lead_time * factor)
            )

        writer.writerow([
            product_id,
            warehouse,
            stock
        ])

with open(os.path.join(DATA_DIR, "suppliers.csv"), "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerow([
        "product_id",
        "supplier_id",
        "lead_time"
    ])
    writer.writerows(supplier_data)

with open(os.path.join(DATA_DIR, "sales.csv"), "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerow([
        "date",
        "product_id",
        "quantity"
    ])

    current_date = start_date

    for day_index in range(days):

        for product_index, product in enumerate(products):

            product_id = product[0]
            category = product[2]

            low, high = category_demand[category]

            base = random.randint(
                low,
                high
            )

            product_factor = (
                0.85 +
                (product_index % 7) * 0.07
            )

            seasonal = (
                1 +
                0.18 *
                math.sin(
                    2 *
                    math.pi *
                    day_index /
                    365
                )
            )

            weekly_pattern = [
                0.92,
                0.96,
                1.00,
                1.03,
                1.08,
                1.20,
                1.14
            ]

            weekday_factor = weekly_pattern[
                current_date.weekday()
            ]

            promotion_factor = (
                1.30
                if current_date in promotion_dates
                else 1.0
            )

            holiday_factor = (
                1.20
                if current_date in holiday_dates
                else 1.0
            )

            trend = (
                1 +
                0.00025 *
                day_index
            )

            daily_target = (
                base
                * product_factor
                * seasonal
                * weekday_factor
                * promotion_factor
                * holiday_factor
                * trend
            )

            daily_target = max(
                transactions_per_product_per_day,
                round(daily_target)
            )

            remaining = daily_target

            for transaction_index in range(
                transactions_per_product_per_day
            ):

                transactions_left = (
                    transactions_per_product_per_day
                    - transaction_index
                )

                if transactions_left == 1:
                    quantity = remaining
                else:
                    average_remaining = (
                        remaining /
                        transactions_left
                    )

                    variation = random.uniform(
                        0.60,
                        1.40
                    )

                    quantity = max(
                        1,
                        round(
                            average_remaining *
                            variation
                        )
                    )

                    max_allowed = (
                        remaining -
                        (transactions_left - 1)
                    )

                    quantity = min(
                        quantity,
                        max_allowed
                    )

                remaining -= quantity

                writer.writerow([
                    current_date.isoformat(),
                    product_id,
                    quantity
                ])

        current_date += timedelta(days=1)

event_rows = []

current_date = start_date

for day_index in range(days):

    if random.random() < 0.22:

        holiday = random.choice([
            0,
            1
        ])

        promotion = random.choice([
            0,
            1
        ])

        if holiday == 0 and promotion == 0:
            promotion = 1

        event_rows.append([
            current_date.isoformat(),
            holiday,
            promotion
        ])

    current_date += timedelta(days=1)

with open(
    os.path.join(
        DATA_DIR,
        "external_events.csv"
    ),
    "w",
    newline=""
) as f:

    writer = csv.writer(f)

    writer.writerow([
        "date",
        "holiday",
        "promotion"
    ])

    writer.writerows(
        event_rows
    )

print(
    "Dataset generation completed successfully!"
)

print(
    f"Products: {len(products)}"
)

print(
    "Sales transactions: "
    f"{days * len(products) * transactions_per_product_per_day}"
)

print(
    f"Inventory records: {len(products)}"
)

print(
    f"Supplier records: {len(supplier_data)}"
)

print(
    f"External events: {len(event_rows)}"
)

print(
    "Date range: 2024-04-01 to 2026-03-31"
)