# 📦 Big Data Powered Warehouse Inventory Intelligence

**Demand Forecasting • Inventory Risk Analysis • Smart Replenishment • Business Intelligence**

An end-to-end Big Data and Machine Learning powered warehouse inventory intelligence system designed to monitor inventory, forecast demand, identify stock risks, and generate intelligent reorder recommendations.

The project integrates Hadoop, HDFS, MapReduce, Hive, Apache Spark, Python, Machine Learning, Supabase PostgreSQL, Node.js, React, SQLite, and Power BI into a unified warehouse intelligence platform.

---

## 🎯 Project Overview

Traditional inventory management systems often depend on historical stock information and manual decisions. This can result in:

* Overstocking
* Stock shortages
* Poor demand planning
* Delayed replenishment
* Increased inventory costs
* Difficulty identifying high-risk products

This project addresses these challenges by processing warehouse data using Big Data technologies and Machine Learning to generate actionable inventory insights.

The system follows the flow:

**Historical Data → Big Data Processing → Demand Analysis → Demand Forecasting → Risk Analysis → Inventory Optimization → Reorder Recommendation**

---

## ✨ Key Features

### 📊 Big Data Processing

* Distributed data storage using HDFS
* Sales aggregation using MapReduce
* Data analysis using Hive
* Apache Spark based distributed demand processing
* Product-level daily demand aggregation using Spark
* Spark-derived average demand and demand variability statistics
* Hadoop ecosystem with YARN
* Large-scale warehouse dataset processing

### 🔮 Demand Forecasting

* Historical sales preprocessing
* Product-level demand analysis
* Machine Learning based forecasting
* Average daily demand calculation
* Maximum forecast demand estimation
* Demand variability analysis
* Spark-based demand statistics integration
* Random Forest based demand forecasting

### ⚠️ Inventory Risk Analysis

* Inventory Risk Score
* High, Medium, and Low risk classification
* Current stock monitoring
* Reorder point calculation
* Days of inventory analysis
* Identification of products requiring attention

### 🔄 Smart Replenishment

The system generates reorder recommendations using:

* Forecasted demand
* Current inventory
* Supplier lead time
* Demand variability
* Safety stock requirements
* Reorder point calculations

### ☁️ Cloud Data Storage

The project uses Supabase PostgreSQL as the cloud data storage layer.

* Supabase PostgreSQL database
* Inventory intelligence data storage
* Automatic inventory data synchronization
* Product and stock update synchronization
* Cloud-based storage for inventory analytics
* Integration with the Node.js backend

### 📈 Power BI Analytics

The interactive dashboard provides:

* Executive inventory overview
* Inventory intelligence
* Demand and forecasting analysis
* Warehouse and product analysis
* Risk distribution
* Product-level insights
* Inventory status analysis

### 🖥️ Interactive Web Application

The React-based warehouse application includes:

* Inventory Command Center
* Product management
* Demand forecasting
* Smart reorder recommendations
* Risk analysis
* Warehouse-themed animated interface
* Interactive navigation
* Power BI dashboard integration

---

## 🏗️ System Architecture

```text
                ┌────────────────────────┐
                │    Warehouse Dataset   │
                │ Sales / Inventory /    │
                │ Products / Suppliers   │
                │ External Events        │
                └────────────┬───────────┘
                             │
                             ▼
                ┌────────────────────────┐
                │          HDFS          │
                │   Distributed Storage  │
                └────────────┬───────────┘
                             │
                  ┌──────────┴──────────┐
                  ▼                     ▼
        ┌─────────────────┐   ┌─────────────────┐
        │    MapReduce    │   │  Apache Spark   │
        │ Sales Aggregation│   │ Demand Analysis │
        └────────┬────────┘   └────────┬────────┘
                 │                     │
                 ▼                     ▼
        ┌─────────────────┐   ┌─────────────────┐
        │      Hive       │   │ Spark Demand    │
        │  Data Analysis  │   │   Statistics    │
        └────────┬────────┘   └────────┬────────┘
                 │                     │
                 └──────────┬──────────┘
                            ▼
                ┌────────────────────────┐
                │   Python + ML Pipeline │
                │                        │
                │ Data Preprocessing     │
                │ Demand Forecasting     │
                │ Inventory Optimization │
                └────────────┬───────────┘
                             │
                             ▼
                ┌────────────────────────┐
                │  Supabase PostgreSQL   │
                │ Cloud Inventory Data   │
                └────────────┬───────────┘
                             │
                             ▼
                ┌────────────────────────┐
                │      Node.js API       │
                │ Express + SQLite       │
                │ Supabase Synchronization│
                └────────────┬───────────┘
                             │
                    ┌────────┴────────┐
                    ▼                 ▼
           ┌─────────────────┐ ┌─────────────────┐
           │ React Frontend  │ │    Power BI     │
           │  Warehouse UI   │ │   Dashboards    │
           └─────────────────┘ └─────────────────┘
```

---

## ⚡ Apache Spark Integration

Apache Spark is used for distributed processing and analysis of warehouse sales data.

The Spark processing pipeline:

**Sales Data → Spark → Daily Product Demand → Demand Statistics → ML & Inventory Optimization**

Spark performs the following operations:

* Reads historical sales data
* Aggregates sales by date and product
* Calculates daily product-level demand
* Calculates average daily demand
* Calculates demand standard deviation
* Calculates the number of sales days
* Generates product-level demand statistics

The Spark-derived demand statistics are integrated into the inventory optimization pipeline.

The resulting statistics are used for:

* Average daily demand
* Demand variability
* Safety stock calculation
* Reorder point calculation
* Inventory status
* Recommended order quantity

The project therefore uses both Hadoop MapReduce and Apache Spark for Big Data processing.

**MapReduce** demonstrates batch-based processing and sales aggregation, while **Spark** provides fast in-memory analytics for product-level demand statistics.

---

## ☁️ Supabase Integration

Supabase provides the cloud PostgreSQL storage layer for the inventory intelligence system.

The Node.js backend synchronizes inventory information between the local SQLite database and the Supabase `inventory_intelligence` table.

The synchronized information includes:

* Product ID
* Product name
* Category
* Warehouse
* Current stock
* Reorder point
* Recommended order
* Average daily demand
* Maximum forecast demand
* Demand standard deviation
* Days of inventory
* Risk score
* Risk category
* Inventory status
* Unit price

This creates a hybrid database architecture:

**SQLite → Local Application Operations**

**Supabase PostgreSQL → Cloud Inventory Data Storage**

The backend automatically synchronizes inventory changes with Supabase.

---

## 🧠 Inventory Intelligence

The system calculates important inventory indicators to support data-driven replenishment decisions.

### Safety Stock

```text
Safety Stock = z × Demand Standard Deviation × √Lead Time
```

The implementation uses a service-level factor of approximately **1.65**, corresponding to approximately 95% service level under the underlying assumptions.

### Reorder Point

```text
Reorder Point = Lead Time Demand + Safety Stock
```

### Risk Classification

| Risk Score | Category       |
| ---------- | -------------- |
| ≥ 70       | 🔴 High Risk   |
| 40–69      | 🟠 Medium Risk |
| < 40       | 🟢 Low Risk    |

These indicators help identify products that require immediate attention and support proactive inventory management.

---

## 🔮 Demand Forecasting Pipeline

```text
Raw Sales Data
      │
      ▼
HDFS
      │
      ├──────────────► MapReduce / Hive Analysis
      │
      ▼
Apache Spark
      │
      ▼
Daily Demand Aggregation
      │
      ▼
Demand Statistics
      │
      ▼
Data Preprocessing
      │
      ▼
Machine Learning Forecast
      │
      ▼
Inventory Optimization
      │
      ▼
Reorder Recommendation
      │
      ▼
Supabase PostgreSQL
      │
      ▼
Node.js API
      │
      ├──────────────► React Dashboard
      │
      └──────────────► Power BI
```

The ML pipeline generates processed and optimized inventory datasets for further analysis and visualization.

### Generated Outputs

* `processed_sales.csv`
* `forecasted_sales.csv`
* `inventory_optimization.csv`
* `spark_demand_statistics.csv`

---

## 📊 Power BI Dashboard

The project contains four major Power BI dashboard areas.

### 1. Executive Dashboard

Provides a high-level overview of:

* Total Products
* High Risk Products
* Total Recommended Order
* Average Risk Score
* Risk Category Distribution
* Inventory Status

### 2. Inventory Intelligence

Provides:

* Current Stock by Product
* Current Stock vs Reorder Point
* Recommended Order by Product
* Days of Inventory
* Inventory Status

### 3. Demand & Forecasting

Provides:

* Average Daily Demand
* Maximum Forecast Demand
* Demand Standard Deviation
* Daily Demand by Product
* Average Demand vs Maximum Forecast

### 4. Warehouse & Product Analysis

Provides:

* Products by Warehouse
* Products by Category
* Risk Score by Product
* Unit Price by Product
* Unit Price vs Current Stock
* Current Stock by Category
* Risk Category by Warehouse

---

## 🖥️ Web Application Modules

| Module             | Purpose                           |
| ------------------ | --------------------------------- |
| 🏠 Dashboard       | Overall warehouse command center  |
| 📦 Inventory       | Product and stock management      |
| 🔮 Forecast        | Demand forecasting insights       |
| 🔄 Recommendations | Smart replenishment suggestions   |
| ⚠️ Risk Analysis   | Inventory risk monitoring         |
| 📊 Power BI        | Interactive business intelligence |

---

## 🛠️ Technology Stack

### Big Data

* Apache Hadoop
* HDFS
* MapReduce
* Apache Hive
* Apache Spark
* YARN

### Data Science & Machine Learning

* Python
* Pandas
* NumPy
* Scikit-learn
* Jupyter Notebook

### Database & Cloud

* SQLite
* better-sqlite3
* Supabase
* PostgreSQL

### Backend

* Node.js
* Express.js
* REST API

### Frontend

* React
* Vite
* JavaScript
* CSS

### Business Intelligence

* Microsoft Power BI

### Development Environment

* VS Code
* Git
* GitHub
* WSL2
* Ubuntu

---

## 📁 Project Structure

```text
Big-Data-Powered-Warehouse-Inventory-Intelligence/
│
├── backend/
│   ├── migrate_ml_data.js
│   ├── package-lock.json
│   ├── package.json
│   ├── server.js
│   ├── sync_ml_to_db.js
│   ├── sync_to_supabase.js
│   └── warehouse.db
│
├── data/
│   ├── backup_small_demo/
│   ├── external_events.csv
│   ├── external_events_no_header.csv
│   ├── inventory.csv
│   ├── inventory_no_header.csv
│   ├── products.csv
│   ├── products_no_header.csv
│   ├── sales.csv
│   ├── sales_no_header.csv
│   ├── suppliers.csv
│   ├── suppliers_no_header.csv
│   └── processed/
│       ├── sales_by_product.csv
│       ├── sales_clean.csv
│       └── spark_sales/
│           ├── daily_sales/
│           └── product_demand/
│
├── docs/
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/
│       └── pages/
│
├── hadoop/
│
├── ml/
│   ├── preprocessing.py
│   ├── forecasting.py
│   ├── inventory_optimization.py
│   ├── risk_analysis.py
│   ├── output/
│   │   ├── clean_sales.csv
│   │   ├── forecast.csv
│   │   ├── inventory_optimization.csv
│   │   └── spark_demand_statistics.csv
│   └── inventory_optimization_backup_before_spark.py
│
├── scripts/
│   └── generate_dataset.py
│
├── spark/
│   ├── process_sales.py
│   └── integrate_spark_demand.py
│
├── .gitignore
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites

Make sure the following are installed:

* Node.js
* npm
* Python
* Java 17+
* Hadoop
* Hive
* Apache Spark
* WSL2 / Ubuntu
* Power BI Desktop
* Supabase account

---

### 1. Clone the Repository

```bash
git clone https://github.com/Sridurga99/Big-Data-Powered-Warehouse-Inventory-Intelligence.git
cd Big-Data-Powered-Warehouse-Inventory-Intelligence
```

---

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

---

### 3. Configure Environment Variables

Create a `.env` file inside the `backend` directory containing the required Supabase configuration.

```text
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_key
```

Do not commit the `.env` file to GitHub.

---

### 4. Start the Backend

```bash
node server.js
```

The backend API runs on:

```text
http://localhost:5000
```

---

### 5. Install Frontend Dependencies

Open another terminal and run:

```bash
cd frontend
npm install
```

---

### 6. Start the Frontend

```bash
npm run dev
```

Open the local URL displayed by Vite in your browser.

---

## 🔗 Backend API

The frontend communicates with the backend through REST APIs.

Example inventory endpoint:

```text
http://localhost:5000/api/powerbi/inventory
```

The backend provides product, inventory, forecasting, and analytics data required by the application.

The backend also synchronizes inventory updates with Supabase PostgreSQL.

---

## ⚡ Running Apache Spark

From the project root:

```bash
spark-submit spark/process_sales.py
```

The Spark job processes the sales dataset and generates:

```text
data/processed/spark_sales/daily_sales/
data/processed/spark_sales/product_demand/
```

The Spark demand statistics can then be integrated into the ML pipeline using:

```bash
python3 spark/integrate_spark_demand.py
```

This generates:

```text
ml/output/spark_demand_statistics.csv
```

The inventory optimization module then uses these Spark-derived demand statistics.

---

## 📦 Dataset

The project contains warehouse datasets covering:

* Sales
* Products
* Inventory
* Suppliers
* External events
* Processed sales information
* Spark demand statistics
* Forecasting outputs
* Inventory optimization results

The dataset was expanded to provide a more realistic environment for Big Data processing, demand forecasting, and inventory intelligence.

---

## 💡 Project Novelty

The major strength of this project is the integration of Big Data processing, Machine Learning, inventory risk analysis, cloud data storage, and business intelligence into a single decision-support platform.

Instead of simply displaying current inventory levels, the system connects:

```text
Historical Sales
      +
Demand Forecast
      +
Demand Variability
      +
Supplier Lead Time
      +
Current Stock
      │
      ▼
Inventory Risk
      +
Reorder Recommendation
```

Apache Spark strengthens the demand-analysis stage by generating product-level demand statistics, while Machine Learning provides future demand forecasts.

Supabase PostgreSQL adds a cloud-based data storage layer for inventory intelligence and synchronization.

This moves the system beyond basic descriptive inventory reporting toward predictive and decision-support analytics.

---

## 🎯 Benefits

The system can help warehouse managers:

* Identify high-risk products
* Anticipate future demand
* Reduce potential stockouts
* Avoid unnecessary overstocking
* Prioritize replenishment
* Monitor inventory health
* Understand product-level demand patterns
* Make data-driven inventory decisions
* Use cloud-based inventory data
* Improve replenishment planning

---

## 🚀 Future Scope

The system can be extended with:

* Real-time IoT-based inventory monitoring
* Barcode and RFID integration
* Advanced time-series forecasting
* Automated supplier selection
* Automated purchase-order generation
* Cloud deployment
* Real-time streaming using Apache Kafka
* Advanced anomaly detection
* Mobile warehouse management application
* Real-time Spark Streaming analytics

---

## 👥 Team

**Big Data Powered Warehouse Inventory Intelligence using Demand Forecasting**

**Team Size: 3 Members**

Developed as an academic project integrating Big Data, Machine Learning, Web Development, Cloud Database Technology, and Business Intelligence.

---

## 📌 Project Status

| Component                       | Status     |
| ------------------------------- | ---------- |
| Big Data Processing             | ✅ Complete |
| HDFS / MapReduce / Hive         | ✅ Complete |
| Apache Spark Integration        | ✅ Complete |
| Machine Learning                | ✅ Complete |
| Demand Forecasting              | ✅ Complete |
| Inventory Optimization          | ✅ Complete |
| Risk Analysis                   | ✅ Complete |
| Smart Recommendations           | ✅ Complete |
| Supabase PostgreSQL Integration | ✅ Complete |
| React Web Application           | ✅ Complete |
| Power BI Dashboard              | ✅ Complete |
| Dataset Enhancement             | ✅ Complete |
| GitHub Repository               | ✅ Complete |

### 🏆 Overall Development Status: 100% Complete

---

## 📜 License

This project was developed for academic and educational purposes.
