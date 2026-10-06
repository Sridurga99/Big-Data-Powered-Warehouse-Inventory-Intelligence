from pyspark.sql import SparkSession
from pyspark.sql.functions import col, sum, avg, stddev, count

spark = SparkSession.builder \
    .appName("WarehouseSalesProcessing") \
    .master("local[*]") \
    .getOrCreate()

input_path = "data/sales.csv"
output_path = "data/processed/spark_sales"

sales = spark.read \
    .option("header", True) \
    .option("inferSchema", True) \
    .csv(input_path)

sales = sales.withColumn("date", col("date").cast("date"))

daily_sales = sales.groupBy(
    "date",
    "product_id"
).agg(
    sum("quantity").alias("daily_quantity")
)

product_demand = daily_sales.groupBy(
    "product_id"
).agg(
    avg("daily_quantity").alias("average_daily_demand"),
    stddev("daily_quantity").alias("demand_std"),
    count("date").alias("sales_days")
)

daily_sales.orderBy("date", "product_id") \
    .write \
    .mode("overwrite") \
    .option("header", True) \
    .csv(output_path + "/daily_sales")

product_demand.orderBy("product_id") \
    .write \
    .mode("overwrite") \
    .option("header", True) \
    .csv(output_path + "/product_demand")

print("Spark processing completed successfully.")
print("Daily sales records:", daily_sales.count())
print("Products processed:", product_demand.count())

spark.stop()
