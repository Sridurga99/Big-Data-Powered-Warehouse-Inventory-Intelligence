# Big Data Powered Warehouse Inventory Intelligence

A Big Data-based warehouse inventory system that uses Hadoop and Hive for large-scale data processing and provides processed data for demand forecasting and inventory intelligence.

## Project Overview

The system processes warehouse sales, inventory, product, supplier, warehouse, and external-event data through a Big Data pipeline.

The complete project integrates:

- Hadoop HDFS
- Hadoop MapReduce
- Hive
- Python
- Machine Learning / Demand Forecasting
- Inventory Intelligence
- Power BI

## System Architecture

```text
Raw Warehouse Data
        |
        v
     HDFS
        |
        v
   MapReduce
        |
        v
      Hive
        |
        v
Processed Data
        |
        v
Demand Forecasting
        |
        v
Inventory Intelligence
        |
        v
Power BI Dashboard

## Big Data Module

The Big Data and Data Engineering module is responsible for:

1. Preparing warehouse datasets
2. Storing datasets in Hadoop HDFS
3. Processing sales data using MapReduce
4. Creating Hive external tables
5. Performing Hive-based aggregation and joins
6. Producing clean datasets for the downstream ML module

## Datasets

The project contains:

- `sales.csv`
- `inventory.csv`
- `products.csv`
- `suppliers.csv`
- `warehouses.csv`
- `external_events.csv`

## MapReduce

The MapReduce pipeline calculates total sales quantity for each product.

Verified result:

| Product ID | Product Name | Total Quantity |
|------------|--------------|----------------|
| P101 | Smartphone | 550 |
| P102 | Rice_Bag | 268 |

## Processed Data

The Big Data pipeline produces:

- `sales_clean.csv` — daily sales data for demand forecasting
- `sales_by_product.csv` — product-level aggregated sales
- `sales_by_product.txt` — Hadoop MapReduce output

## Hive

Hive external tables are created for:

- Sales
- Inventory
- Products
- Suppliers
- Warehouses
- External Events

Hive is used to query, join, and aggregate the warehouse datasets.

## Downstream Inventory Intelligence

The processed data is passed to the ML module for:

- Demand forecasting
- Dynamic safety stock
- Supplier lead-time analysis
- Reorder point calculation
- Inventory risk scoring
- Reorder recommendations

## Machine Learning & Inventory Intelligence Module

The Machine Learning and Inventory Intelligence module is responsible for:

1. Preparing the processed sales data for machine learning
2. Cleaning and transforming daily sales data
3. Performing demand forecasting using Random Forest
4. Generating short-term product-level demand forecasts
5. Calculating supplier lead-time demand
6. Calculating safety stock and reorder points
7. Generating recommended order quantities
8. Classifying inventory status
9. Performing inventory risk analysis
10. Producing final inventory intelligence data for Power BI

## Demand Forecasting

The demand forecasting module uses historical product-level sales data
to predict future demand.

The forecasting pipeline uses:

- Lag-based demand features
- Rolling average features
- Calendar-based features
- Random Forest Regression

The model generates a 7-day demand forecast for each product.

Output:

- `forecast.csv`

## Inventory Optimization

The inventory optimization module combines demand forecasts with current
inventory and supplier lead-time information.

It calculates:

- Average daily demand
- Maximum forecast demand
- Demand standard deviation
- Lead-time demand
- Safety stock
- Reorder point
- Days of inventory
- Recommended order quantity

Inventory status is classified as:

- Critical
- Reorder Required
- Sufficient

Output:

- `inventory_optimization.csv`

## Inventory Risk Analysis

The inventory risk module evaluates product inventory coverage and
identifies potential stock shortage risks.

It calculates:

- Stock coverage ratio
- Risk score
- Risk category

Risk categories include:

- High Risk
- Medium Risk
- Low Risk

Output:

- `final_inventory_intelligence.csv`

## ML Output

The ML module produces:

- `clean_sales.csv` — cleaned daily sales data
- `forecast.csv` — product demand forecasts
- `inventory_optimization.csv` — inventory optimization results
- `final_inventory_intelligence.csv` — final inventory intelligence data

The final output is passed to the Power BI module for visualization
and dashboard development.

## Repository Structure

```text
data/
├── raw datasets
└── processed/

hadoop/
├── mapreduce/
│   ├── mapper.py
│   └── reducer.py
└── hive/
    ├── create_tables.hql
    └── analysis_queries.hql
ml/
├── preprocessing.py
├── forecasting.py
├── inventory_optimization.py
├── risk_analysis.py
└── output/
    ├── clean_sales.csv
    ├── forecast.csv
    ├── inventory_optimization.csv
    └── final_inventory_intelligence.csv

scripts/
└── run_mapreduce.sh

docs/
└── architecture.md

## Team Module

This repository integrates three major project modules:

- Big Data and Data Engineering
- ML and Inventory Intelligence
- Power BI and Visualization

The Big Data module provides the processed foundation for the downstream forecasting and inventory intelligence components.
