import pandas as pd
from pathlib import Path
from io import StringIO

# ---------------------------------------------------------
# 1. Define project locations
# ---------------------------------------------------------

# Current file = ml/preprocessing.py
ML_DIR = Path(__file__).resolve().parent

# Main project folder
PROJECT_DIR = ML_DIR.parent

# Member 1's processed data
INPUT_FILE = PROJECT_DIR / "data" / "processed" / "sales_clean.csv"

# Our output folder
OUTPUT_DIR = ML_DIR / "output"

# Create output folder if it does not exist
OUTPUT_DIR.mkdir(exist_ok=True)


# ---------------------------------------------------------
# 2. Load sales data
# ---------------------------------------------------------

def load_sales_data():

    print("Loading sales data...")

    if not INPUT_FILE.exists():
        raise FileNotFoundError(
            f"Could not find sales file:\n{INPUT_FILE}"
        )

    # -----------------------------------------------------
    # Member 1's Hive output contains Log4j messages
    # before the actual CSV header.
    #
    # We find the real CSV header and ignore everything
    # before it.
    # -----------------------------------------------------

    with open(INPUT_FILE, "r", encoding="utf-8") as file:
        lines = file.readlines()

    header_index = None

    for i, line in enumerate(lines):

        if line.strip().startswith(
            "sale_date,product_id,quantity"
        ):
            header_index = i
            break

    if header_index is None:
        raise ValueError(
            "Could not find the sales CSV header."
        )

    # Keep only the actual CSV portion
    csv_data = "".join(lines[header_index:])

    # Read CSV data using pandas
    df = pd.read_csv(
        StringIO(csv_data)
    )

    print("\nOriginal columns:")
    print(df.columns.tolist())

    print(f"\nOriginal rows: {len(df)}")

    return df


# ---------------------------------------------------------
# 3. Clean sales data
# ---------------------------------------------------------

def clean_sales_data(df):

    print("\nCleaning sales data...")

    # Remove spaces from column names
    df.columns = (
        df.columns
        .str.strip()
        .str.lower()
    )

    # -----------------------------------------------------
    # Member 1's file uses sale_date.
    # Convert it to the standard column name: date
    # -----------------------------------------------------

    if "sale_date" in df.columns:
        df = df.rename(
            columns={
                "sale_date": "date"
            }
        )

    # Required columns
    required_columns = [
        "date",
        "product_id",
        "quantity"
    ]

    # Check required columns
    for column in required_columns:

        if column not in df.columns:

            raise ValueError(
                f"Required column '{column}' was not found."
            )

    # Keep only required columns
    df = df[
        required_columns
    ].copy()

    # Convert date column
    df["date"] = pd.to_datetime(
        df["date"],
        errors="coerce"
    )

    # Convert quantity to numeric
    df["quantity"] = pd.to_numeric(
        df["quantity"],
        errors="coerce"
    )

    # Remove invalid rows
    df = df.dropna(
        subset=[
            "date",
            "product_id",
            "quantity"
        ]
    )

    # Remove negative sales quantities
    df = df[
        df["quantity"] >= 0
    ]

    # Clean product IDs
    df["product_id"] = (
        df["product_id"]
        .astype(str)
        .str.strip()
    )

    # Sort data
    df = df.sort_values(
        [
            "product_id",
            "date"
        ]
    )

    # -----------------------------------------------------
    # If the same product has multiple records
    # on the same date, combine them.
    # -----------------------------------------------------

    df = (
        df.groupby(
            [
                "date",
                "product_id"
            ],
            as_index=False
        )["quantity"]
        .sum()
    )

    # Sort again
    df = df.sort_values(
        [
            "product_id",
            "date"
        ]
    )

    # Reset index
    df = df.reset_index(
        drop=True
    )

    return df


# ---------------------------------------------------------
# 4. Create continuous daily demand
# ---------------------------------------------------------

def create_daily_dataset(df):

    print(
        "\nCreating continuous daily demand..."
    )

    all_products = []

    # Process each product separately
    for product_id, group in df.groupby(
        "product_id"
    ):

        group = group.sort_values(
            "date"
        )

        # Create every date between
        # first and last sale
        date_range = pd.date_range(
            start=group["date"].min(),
            end=group["date"].max(),
            freq="D"
        )

        # Put dates into index
        group = group.set_index(
            "date"
        )

        # Reindex using continuous dates
        group = group.reindex(
            date_range
        )

        # Missing sales days = zero demand
        group["quantity"] = (
            group["quantity"]
            .fillna(0)
        )

        group.index.name = "date"

        # Restore product ID
        group["product_id"] = product_id

        # Restore column order
        group = group.reset_index()

        group = group[
            [
                "date",
                "product_id",
                "quantity"
            ]
        ]

        all_products.append(
            group
        )

    # Combine all products
    final_df = pd.concat(
        all_products,
        ignore_index=True
    )

    # Sort final data
    final_df = final_df.sort_values(
        [
            "product_id",
            "date"
        ]
    )

    # Reset index
    final_df = final_df.reset_index(
        drop=True
    )

    return final_df


# ---------------------------------------------------------
# 5. Main program
# ---------------------------------------------------------

def main():

    print("=" * 60)
    print(
        "MEMBER 2 - SALES DATA PREPROCESSING"
    )
    print("=" * 60)

    # -----------------------------------------------------
    # Step 1: Load data
    # -----------------------------------------------------

    df = load_sales_data()

    # -----------------------------------------------------
    # Step 2: Clean data
    # -----------------------------------------------------

    df = clean_sales_data(df)

    print(
        f"\nRows after cleaning: {len(df)}"
    )

    # -----------------------------------------------------
    # Step 3: Create continuous daily data
    # -----------------------------------------------------

    df = create_daily_dataset(df)

    print(
        f"Rows after creating daily dataset: "
        f"{len(df)}"
    )

    # -----------------------------------------------------
    # Dataset information
    # -----------------------------------------------------

    print(
        f"\nNumber of products: "
        f"{df['product_id'].nunique()}"
    )

    print(
        f"Date range: "
        f"{df['date'].min().date()} "
        f"to "
        f"{df['date'].max().date()}"
    )

    # -----------------------------------------------------
    # Step 4: Save cleaned data
    # -----------------------------------------------------

    output_file = (
        OUTPUT_DIR /
        "clean_sales.csv"
    )

    df.to_csv(
        output_file,
        index=False
    )

    print(
        "\nPreprocessing completed successfully!"
    )

    print(
        "\nOutput file:"
    )

    print(output_file)

    # -----------------------------------------------------
    # Show first 10 rows
    # -----------------------------------------------------

    print(
        "\nFirst 10 rows:"
    )

    print(
        df.head(10)
    )


# ---------------------------------------------------------
# Run program
# ---------------------------------------------------------

if __name__ == "__main__":
    main()