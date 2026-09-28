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

The Power BI module uses the resulting intelligence for visualization and dashboard development.

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
