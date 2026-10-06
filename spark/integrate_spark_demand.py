import pandas as pd
from pathlib import Path

PROJECT_DIR = Path(__file__).resolve().parent.parent

SPARK_OUTPUT = (
    PROJECT_DIR
    / "data"
    / "processed"
    / "spark_sales"
    / "product_demand"
)

OUTPUT_FILE = (
    PROJECT_DIR
    / "ml"
    / "output"
    / "spark_demand_statistics.csv"
)

spark_files = list(SPARK_OUTPUT.glob("part-*.csv"))

if not spark_files:
    raise FileNotFoundError(
        f"No Spark output found in {SPARK_OUTPUT}"
    )

spark_df = pd.concat(
    [pd.read_csv(file) for file in spark_files],
    ignore_index=True
)

spark_df = spark_df[
    [
        "product_id",
        "average_daily_demand",
        "demand_std",
        "sales_days"
    ]
]

spark_df = spark_df.sort_values(
    "product_id"
).reset_index(drop=True)

spark_df.to_csv(
    OUTPUT_FILE,
    index=False
)

print("Spark demand statistics integrated successfully.")
print(f"Products integrated: {len(spark_df)}")
print(f"Output: {OUTPUT_FILE}")
print("\nPreview:")
print(spark_df.head())
