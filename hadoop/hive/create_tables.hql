CREATE DATABASE IF NOT EXISTS warehouse_inventory;

USE warehouse_inventory;

CREATE EXTERNAL TABLE IF NOT EXISTS sales (
    sale_date STRING,
    product_id STRING,
    quantity INT
)
ROW FORMAT DELIMITED
FIELDS TERMINATED BY ','
STORED AS TEXTFILE
LOCATION '/warehouse_inventory/sales';

ALTER TABLE sales SET TBLPROPERTIES ("skip.header.line.count"="1");

CREATE EXTERNAL TABLE IF NOT EXISTS inventory (
    product_id STRING,
    warehouse STRING,
    stock_level INT
)
ROW FORMAT DELIMITED
FIELDS TERMINATED BY ','
STORED AS TEXTFILE
LOCATION '/warehouse_inventory/inventory';

CREATE EXTERNAL TABLE IF NOT EXISTS products (
    product_id STRING,
    product_name STRING,
    category STRING,
    unit_price DOUBLE
)
ROW FORMAT DELIMITED
FIELDS TERMINATED BY ','
STORED AS TEXTFILE
LOCATION '/warehouse_inventory/products';

ALTER TABLE products SET TBLPROPERTIES ("skip.header.line.count"="1");

CREATE EXTERNAL TABLE IF NOT EXISTS suppliers (
    product_id STRING,
    supplier_id STRING,
    lead_time INT
)
ROW FORMAT DELIMITED
FIELDS TERMINATED BY ','
STORED AS TEXTFILE
LOCATION '/warehouse_inventory/suppliers';

CREATE EXTERNAL TABLE IF NOT EXISTS warehouses (
    warehouse_id STRING,
    warehouse_name STRING,
    city STRING
)
ROW FORMAT DELIMITED
FIELDS TERMINATED BY ','
STORED AS TEXTFILE
LOCATION '/warehouse_inventory/warehouses';

CREATE EXTERNAL TABLE IF NOT EXISTS external_events (
    event_date STRING,
    holiday INT,
    promotion INT
)
ROW FORMAT DELIMITED
FIELDS TERMINATED BY ','
STORED AS TEXTFILE
LOCATION '/warehouse_inventory/external';
