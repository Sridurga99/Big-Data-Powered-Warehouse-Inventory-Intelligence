import pandas as pd
from pathlib import Path

ML_DIR = Path(__file__).resolve().parent
PROJECT_DIR = ML_DIR.parent

INPUT_FILE = PROJECT_DIR / "data" / "sales.csv"
OUTPUT_DIR = ML_DIR / "output"

OUTPUT_DIR.mkdir(exist_ok=True)


def load_sales_data():

    print("Loading sales data...")

    if not INPUT_FILE.exists():
        raise FileNotFoundError(
            f"Could not find sales file:\n{INPUT_FILE}"
        )

    df = pd.read_csv(INPUT_FILE)

    print("\nOriginal columns:")
    print(df.columns.tolist())

    print(f"\nOriginal rows: {len(df)}")

    return df


def clean_sales_data(df):

    print("\nCleaning sales data...")

    df.columns = (
        df.columns
        .str.strip()
        .str.lower()
    )

    required_columns = [
        "date",
        "product_id",
        "quantity"
    ]

    for column in required_columns:

        if column not in df.columns:
            raise ValueError(
                f"Required column '{column}' was not found."
            )

    df = df[required_columns].copy()

    df["date"] = pd.to_datetime(
        df["date"],
        errors="coerce"
    )

    df["quantity"] = pd.to_numeric(
        df["quantity"],
        errors="coerce"
    )

    df = df.dropna(
        subset=[
            "date",
            "product_id",
            "quantity"
        ]
    )

    df = df[
        df["quantity"] >= 0
    ]

    df["product_id"] = (
        df["product_id"]
        .astype(str)
        .str.strip()
    )

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

    df = df.sort_values(
        [
            "product_id",
            "date"
        ]
    )

    df = df.reset_index(
        drop=True
    )

    return df


def create_daily_dataset(df):

    print(
        "\nCreating continuous daily demand..."
    )

    all_products = []

    for product_id, group in df.groupby(
        "product_id"
    ):

        group = group.sort_values(
            "date"
        )

        date_range = pd.date_range(
            start=group["date"].min(),
            end=group["date"].max(),
            freq="D"
        )

        group = group.set_index(
            "date"
        )

        group = group.reindex(
            date_range
        )

        group["quantity"] = (
            group["quantity"]
            .fillna(0)
        )

        group.index.name = "date"

        group["product_id"] = product_id

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

    final_df = pd.concat(
        all_products,
        ignore_index=True
    )

    final_df = final_df.sort_values(
        [
            "product_id",
            "date"
        ]
    )

    final_df = final_df.reset_index(
        drop=True
    )

    return final_df


def main():

    print("=" * 60)
    print(
        "MEMBER 2 - SALES DATA PREPROCESSING"
    )
    print("=" * 60)

    df = load_sales_data()

    df = clean_sales_data(df)

    print(
        f"\nRows after cleaning: {len(df)}"
    )

    df = create_daily_dataset(df)

    print(
        f"Rows after creating daily dataset: "
        f"{len(df)}"
    )

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

    print(
        "\nFirst 10 rows:"
    )

    print(
        df.head(10)
    )


if __name__ == "__main__":
    main()