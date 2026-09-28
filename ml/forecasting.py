import pandas as pd
import numpy as np
from pathlib import Path

from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error

# ---------------------------------------------------------
# 1. Define project locations
# ---------------------------------------------------------

# Current file = ml/forecasting.py
ML_DIR = Path(__file__).resolve().parent

# Main project folder
PROJECT_DIR = ML_DIR.parent

# Input file created by preprocessing.py
INPUT_FILE = ML_DIR / "output" / "clean_sales.csv"

# Output folder
OUTPUT_DIR = ML_DIR / "output"

OUTPUT_DIR.mkdir(exist_ok=True)


# ---------------------------------------------------------
# 2. Load cleaned sales data
# ---------------------------------------------------------

def load_clean_data():

    print("Loading cleaned sales data...")

    if not INPUT_FILE.exists():
        raise FileNotFoundError(
            f"Could not find:\n{INPUT_FILE}\n\n"
            "Please run preprocessing.py first."
        )

    df = pd.read_csv(INPUT_FILE)

    # Convert date back to datetime
    df["date"] = pd.to_datetime(
        df["date"]
    )

    print("\nLoaded columns:")
    print(df.columns.tolist())

    print(
        f"\nTotal rows: {len(df)}"
    )

    print(
        f"Products: {df['product_id'].nunique()}"
    )

    return df


# ---------------------------------------------------------
# 3. Create forecasting features
# ---------------------------------------------------------

def create_features(group):

    group = group.sort_values(
        "date"
    ).copy()

    # -----------------------------------------------------
    # Previous-day demand
    # -----------------------------------------------------

    group["lag_1"] = (
        group["quantity"]
        .shift(1)
    )

    # -----------------------------------------------------
    # Demand from 3 days ago
    # -----------------------------------------------------

    group["lag_3"] = (
        group["quantity"]
        .shift(3)
    )

    # -----------------------------------------------------
    # Demand from 7 days ago
    # -----------------------------------------------------

    group["lag_7"] = (
        group["quantity"]
        .shift(7)
    )

    # -----------------------------------------------------
    # Rolling average of previous 3 days
    # -----------------------------------------------------

    group["rolling_mean_3"] = (
        group["quantity"]
        .shift(1)
        .rolling(3)
        .mean()
    )

    # -----------------------------------------------------
    # Rolling average of previous 7 days
    # -----------------------------------------------------

    group["rolling_mean_7"] = (
        group["quantity"]
        .shift(1)
        .rolling(7)
        .mean()
    )

    # -----------------------------------------------------
    # Calendar features
    # -----------------------------------------------------

    group["day_of_week"] = (
        group["date"].dt.dayofweek
    )

    group["day_of_month"] = (
        group["date"].dt.day
    )

    group["month"] = (
        group["date"].dt.month
    )

    return group


# ---------------------------------------------------------
# 4. Train forecasting model
# ---------------------------------------------------------

def train_model(df, product_id):

    print(
        f"\nTraining forecasting model for {product_id}..."
    )

    product_data = df[
        df["product_id"] == product_id
    ].copy()

    product_data = create_features(
        product_data
    )

    # -----------------------------------------------------
    # Remove rows where lag features are unavailable
    # -----------------------------------------------------

    feature_columns = [
        "lag_1",
        "lag_3",
        "lag_7",
        "rolling_mean_3",
        "rolling_mean_7",
        "day_of_week",
        "day_of_month",
        "month"
    ]

    model_data = product_data.dropna(
        subset=feature_columns
    ).copy()

    # -----------------------------------------------------
    # Small dataset protection
    # -----------------------------------------------------

    if len(model_data) < 3:

        print(
            "Not enough data for ML training."
        )

        print(
            "Using recent average demand instead."
        )

        return None, product_data, feature_columns

    # -----------------------------------------------------
    # Features and target
    # -----------------------------------------------------

    X = model_data[
        feature_columns
    ]

    y = model_data[
        "quantity"
    ]

    # -----------------------------------------------------
    # Train-test split
    #
    # We use the last 20% as test data.
    # For time-series data, we should not randomly shuffle.
    # -----------------------------------------------------

    split_index = int(
        len(model_data) * 0.8
    )

    # Make sure at least one training row exists
    if split_index < 1:
        split_index = 1

    X_train = X.iloc[
        :split_index
    ]

    X_test = X.iloc[
        split_index:
    ]

    y_train = y.iloc[
        :split_index
    ]

    y_test = y.iloc[
        split_index:
    ]

    # -----------------------------------------------------
    # Create Random Forest model
    # -----------------------------------------------------

    model = RandomForestRegressor(
        n_estimators=100,
        random_state=42
    )

    # Train model
    model.fit(
        X_train,
        y_train
    )

    # -----------------------------------------------------
    # Evaluate model
    # -----------------------------------------------------

    if len(X_test) > 0:

        predictions = model.predict(
            X_test
        )

        mae = mean_absolute_error(
            y_test,
            predictions
        )

        rmse = np.sqrt(
            mean_squared_error(
                y_test,
                predictions
            )
        )

        print(
            f"MAE: {mae:.2f}"
        )

        print(
            f"RMSE: {rmse:.2f}"
        )

    return (
        model,
        product_data,
        feature_columns
    )


# ---------------------------------------------------------
# 5. Forecast future demand
# ---------------------------------------------------------

def forecast_product(
    df,
    product_id,
    forecast_days=7
):

    print(
        f"\nForecasting {forecast_days} days "
        f"for product {product_id}..."
    )

    product_data = df[
        df["product_id"] == product_id
    ].copy()

    product_data = product_data.sort_values(
        "date"
    ).reset_index(
        drop=True
    )

    # Train model
    model, feature_data, feature_columns = (
        train_model(
            df,
            product_id
        )
    )

    # -----------------------------------------------------
    # Last known date
    # -----------------------------------------------------

    last_date = (
        product_data["date"].max()
    )

    # -----------------------------------------------------
    # If model cannot be trained,
    # use average demand.
    # -----------------------------------------------------

    if model is None:

        average_demand = (
            product_data["quantity"]
            .tail(3)
            .mean()
        )

        forecast_rows = []

        for i in range(1, forecast_days + 1):

            future_date = (
                last_date +
                pd.Timedelta(days=i)
            )

            forecast_rows.append(
                {
                    "date": future_date,
                    "product_id": product_id,
                    "forecast_demand":
                        round(
                            average_demand,
                            2
                        )
                }
            )

        return pd.DataFrame(
            forecast_rows
        )

    # -----------------------------------------------------
    # Prepare data for recursive forecasting
    # -----------------------------------------------------

    history = product_data[
        [
            "date",
            "product_id",
            "quantity"
        ]
    ].copy()

    forecast_rows = []

    # -----------------------------------------------------
    # Predict one day at a time
    # -----------------------------------------------------

    for i in range(
        1,
        forecast_days + 1
    ):

        future_date = (
            last_date +
            pd.Timedelta(days=i)
        )

        quantities = (
            history["quantity"]
            .tolist()
        )

        # ---------------------------------------------
        # Create lag values
        # ---------------------------------------------

        lag_1 = (
            quantities[-1]
        )

        lag_3 = (
            quantities[-3]
            if len(quantities) >= 3
            else np.mean(quantities)
        )

        lag_7 = (
            quantities[-7]
            if len(quantities) >= 7
            else np.mean(quantities)
        )

        # ---------------------------------------------
        # Rolling averages
        # ---------------------------------------------

        rolling_mean_3 = np.mean(
            quantities[-3:]
        )

        rolling_mean_7 = np.mean(
            quantities[-7:]
        )

        # ---------------------------------------------
        # Calendar features
        # ---------------------------------------------

        day_of_week = (
            future_date.dayofweek
        )

        day_of_month = (
            future_date.day
        )

        month = (
            future_date.month
        )

        # ---------------------------------------------
        # Create feature row
        # ---------------------------------------------

        X_future = pd.DataFrame(
            [
                {
                    "lag_1": lag_1,
                    "lag_3": lag_3,
                    "lag_7": lag_7,
                    "rolling_mean_3":
                        rolling_mean_3,
                    "rolling_mean_7":
                        rolling_mean_7,
                    "day_of_week":
                        day_of_week,
                    "day_of_month":
                        day_of_month,
                    "month":
                        month
                }
            ]
        )

        # ---------------------------------------------
        # Predict demand
        # ---------------------------------------------

        prediction = model.predict(
            X_future
        )[0]

        # Demand cannot be negative
        prediction = max(
            0,
            prediction
        )

        prediction = round(
            prediction,
            2
        )

        # ---------------------------------------------
        # Store forecast
        # ---------------------------------------------

        forecast_rows.append(
            {
                "date": future_date,
                "product_id": product_id,
                "forecast_demand":
                    prediction
            }
        )

        # ---------------------------------------------
        # Add prediction to history
        #
        # This allows the next day's prediction
        # to use today's predicted demand.
        # ---------------------------------------------

        history.loc[
            len(history)
        ] = [
            future_date,
            product_id,
            prediction
        ]

    return pd.DataFrame(
        forecast_rows
    )


# ---------------------------------------------------------
# 6. Main program
# ---------------------------------------------------------

def main():

    print("=" * 60)
    print(
        "MEMBER 2 - DEMAND FORECASTING"
    )
    print("=" * 60)

    # -----------------------------------------------------
    # Load cleaned data
    # -----------------------------------------------------

    df = load_clean_data()

    # -----------------------------------------------------
    # Get all products
    # -----------------------------------------------------

    products = (
        df["product_id"]
        .unique()
    )

    print(
        f"\nProducts to forecast: "
        f"{list(products)}"
    )

    # -----------------------------------------------------
    # Forecast every product
    # -----------------------------------------------------

    all_forecasts = []

    for product_id in products:

        forecast = forecast_product(
            df,
            product_id,
            forecast_days=7
        )

        all_forecasts.append(
            forecast
        )

    # -----------------------------------------------------
    # Combine forecasts
    # -----------------------------------------------------

    final_forecast = pd.concat(
        all_forecasts,
        ignore_index=True
    )

    # -----------------------------------------------------
    # Save forecast
    # -----------------------------------------------------

    output_file = (
        OUTPUT_DIR /
        "forecast.csv"
    )

    final_forecast.to_csv(
        output_file,
        index=False
    )

    print(
        "\nDemand forecasting completed!"
    )

    print(
        "\nForecast output:"
    )

    print(output_file)

    print(
        "\nForecast results:"
    )

    print(
        final_forecast
    )


# ---------------------------------------------------------
# Run program
# ---------------------------------------------------------

if __name__ == "__main__":
    main()