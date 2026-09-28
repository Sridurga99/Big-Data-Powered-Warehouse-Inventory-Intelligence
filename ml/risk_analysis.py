import pandas as pd
from pathlib import Path

# Project paths
ML_DIR = Path(__file__).resolve().parent
OUTPUT_DIR = ML_DIR / "output"

INPUT_FILE = OUTPUT_DIR / "inventory_optimization.csv"
OUTPUT_FILE = OUTPUT_DIR / "final_inventory_intelligence.csv"


def calculate_risk(df):
    print("\nCalculating inventory risk...")

    # Stock coverage compared with lead-time demand
    df["stock_coverage_ratio"] = (
        df["current_stock"] / df["lead_time_demand"]
    )

    # Risk score
    df["risk_score"] = (
        (1 - df["stock_coverage_ratio"]) * 100
    ).clip(lower=0, upper=100)

    # Risk category
    def get_risk_category(score):
        if score >= 70:
            return "High Risk"
        elif score >= 30:
            return "Medium Risk"
        else:
            return "Low Risk"

    df["risk_category"] = df["risk_score"].apply(get_risk_category)

    # Round values
    df["stock_coverage_ratio"] = df["stock_coverage_ratio"].round(2)
    df["risk_score"] = df["risk_score"].round(2)

    return df


def save_csv_correctly(df, output_file):
    """
    Save CSV with explicit newline handling.
    """

    csv_text = df.to_csv(
        index=False,
        lineterminator="\r\n"
    )

    # Make sure the file ends with a newline
    if not csv_text.endswith("\r\n"):
        csv_text += "\r\n"

    with open(
        output_file,
        "w",
        encoding="utf-8",
        newline=""
    ) as file:
        file.write(csv_text)


def main():

    print("=" * 60)
    print("MEMBER 2 - INVENTORY RISK ANALYSIS")
    print("=" * 60)

    # Check input file
    if not INPUT_FILE.exists():
        raise FileNotFoundError(
            f"Could not find inventory optimization file:\n{INPUT_FILE}"
        )

    # Load inventory optimization data
    print("\nLoading inventory optimization data...")
    df = pd.read_csv(INPUT_FILE)

    print(f"Rows loaded: {len(df)}")

    # Calculate risk
    df = calculate_risk(df)

    # Save final output
    save_csv_correctly(df, OUTPUT_FILE)

    print("\nRisk analysis completed successfully!")

    print("\nFinal output:")
    print(OUTPUT_FILE)

    print("\nRisk analysis results:")
    print(
        df[
            [
                "product_id",
                "current_stock",
                "lead_time_demand",
                "reorder_point",
                "days_of_inventory",
                "recommended_order",
                "inventory_status",
                "stock_coverage_ratio",
                "risk_score",
                "risk_category"
            ]
        ].to_string(index=False)
    )


if __name__ == "__main__":
    main()