📦 Big Data Powered Warehouse Inventory Intelligence

Demand Forecasting • Inventory Risk Analysis • Smart Replenishment • Business Intelligence

An end-to-end Big Data and Machine Learning powered warehouse inventory intelligence system designed to monitor inventory, forecast demand, identify stock risks, and generate intelligent reorder recommendations.

The project integrates Hadoop, MapReduce, Hive, Python, Machine Learning, Node.js, React, SQLite, and Power BI into a unified warehouse intelligence platform.

---

🎯 Project Overview

Traditional inventory management systems often depend on historical stock information and manual decisions. This can result in:

- Overstocking
- Stock shortages
- Poor demand planning
- Delayed replenishment
- Increased inventory costs
- Difficulty identifying high-risk products

This project addresses these challenges by processing warehouse data using Big Data technologies and Machine Learning to generate actionable inventory insights.

The system follows the flow:

Historical Data → Big Data Processing → Demand Forecasting → Risk Analysis → Inventory Optimization → Reorder Recommendation

---

✨ Key Features

📊 Big Data Processing

- Distributed data storage using HDFS
- Sales aggregation using MapReduce
- Data analysis using Hive
- Hadoop ecosystem with YARN
- Large-scale warehouse dataset processing

🔮 Demand Forecasting

- Historical sales preprocessing
- Product-level demand analysis
- Machine Learning based forecasting
- Average daily demand calculation
- Maximum forecast demand estimation
- Demand variability analysis

⚠️ Inventory Risk Analysis

- Inventory Risk Score
- High, Medium, and Low risk classification
- Current stock monitoring
- Reorder point calculation
- Days of inventory analysis
- Identification of products requiring attention

🔄 Smart Replenishment

The system generates reorder recommendations using:

- Forecasted demand
- Current inventory
- Supplier lead time
- Demand variability
- Safety stock requirements

📈 Power BI Analytics

The interactive dashboard provides:

- Executive inventory overview
- Inventory intelligence
- Demand and forecasting analysis
- Warehouse and product analysis
- Risk distribution
- Product-level insights
- Inventory status analysis

🖥️ Interactive Web Application

The React-based warehouse application includes:

- Inventory Command Center
- Product management
- Demand forecasting
- Smart reorder recommendations
- Risk analysis
- Warehouse-themed animated interface
- Interactive navigation
- Power BI dashboard integration

---

🏗️ System Architecture

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
                                 ▼
                    ┌────────────────────────┐
                    │       MapReduce        │
                    │    Sales Aggregation   │
                    └────────────┬───────────┘
                                 │
                                 ▼
                    ┌────────────────────────┐
                    │          Hive          │
                    │     Data Analysis      │
                    └────────────┬───────────┘
                                 │
                                 ▼
                    ┌────────────────────────┐
                    │   Python + ML Pipeline │
                    │                        │
                    │ Data Preprocessing     │
                    │ Demand Forecasting     │
                    │ Inventory Optimization│
                    └────────────┬───────────┘
                                 │
                   ┌─────────────┴─────────────┐
                   ▼                           ▼
          ┌─────────────────┐         ┌─────────────────┐
          │  Node.js API    │         │    Power BI     │
          │ Express + SQLite│         │   Dashboards    │
          └────────┬────────┘         └─────────────────┘
                   │
                   ▼
          ┌─────────────────┐
          │ React Frontend  │
          │ Warehouse UI    │
          └─────────────────┘

---

🧠 Inventory Intelligence

The system calculates important inventory indicators to support data-driven replenishment decisions.

Safety Stock

Safety Stock = Demand Standard Deviation × √Lead Time

Reorder Point

Reorder Point = Lead Time Demand + Safety Stock

Risk Classification

Risk Score| Category
≥ 70| 🔴 High Risk
40–69| 🟠 Medium Risk
< 40| 🟢 Low Risk

These indicators help identify products that require immediate attention and support proactive inventory management.

---

🔮 Demand Forecasting Pipeline

Raw Sales Data
      │
      ▼
Data Cleaning
      │
      ▼
Feature Preparation
      │
      ▼
Historical Demand Analysis
      │
      ▼
Machine Learning Model
      │
      ▼
Demand Forecast
      │
      ▼
Inventory Optimization
      │
      ▼
Reorder Recommendation

The ML pipeline generates processed and optimized inventory datasets for further analysis and visualization.

Generated Outputs

- "processed_sales.csv"
- "forecasted_sales.csv"
- "inventory_recommendations.csv"

---

📊 Power BI Dashboard

The project contains four major Power BI dashboard areas.

1. Executive Dashboard

Provides a high-level overview of:

- Total Products
- High Risk Products
- Total Recommended Order
- Average Risk Score
- Risk Category Distribution
- Inventory Status

2. Inventory Intelligence

Provides:

- Current Stock by Product
- Current Stock vs Reorder Point
- Recommended Order by Product
- Days of Inventory
- Inventory Status

3. Demand & Forecasting

Provides:

- Average Daily Demand
- Maximum Forecast Demand
- Demand Standard Deviation
- Daily Demand by Product
- Average Demand vs Maximum Forecast

4. Warehouse & Product Analysis

Provides:

- Products by Warehouse
- Products by Category
- Risk Score by Product
- Unit Price by Product
- Unit Price vs Current Stock
- Current Stock by Category
- Risk Category by Warehouse

---

🖥️ Web Application Modules

Module| Purpose
🏠 Dashboard| Overall warehouse command center
📦 Inventory| Product and stock management
🔮 Forecast| Demand forecasting insights
🔄 Recommendations| Smart replenishment suggestions
⚠️ Risk Analysis| Inventory risk monitoring
📊 Power BI| Interactive business intelligence

---

🛠️ Technology Stack

Big Data

- Apache Hadoop
- HDFS
- MapReduce
- Apache Hive
- YARN

Data Science & Machine Learning

- Python
- Pandas
- NumPy
- Scikit-learn
- Jupyter Notebook

Backend

- Node.js
- Express.js
- REST API
- SQLite
- better-sqlite3

Frontend

- React
- Vite
- JavaScript
- CSS

Business Intelligence

- Microsoft Power BI

Development Environment

- VS Code
- Git
- GitHub
- WSL2
- Ubuntu

---

📁 Project Structure

Big-Data-Powered-Warehouse-Inventory-Intelligence/
│
├── backend/
│   ├── migrate_ml_data.js
│   ├── package-lock.json
│   ├── package.json
│   ├── server.js
│   ├── sync_ml_to_db.js
│   └── warehouse.db
│
├── data/
│   ├── backup_small_demo/
│   ├── external_events.csv
│   ├── inventory.csv
│   ├── products.csv
│   ├── sales.csv
│   ├── suppliers.csv
│   └── processed/
│
├── docs/
│
├── frontend/
│   ├── public/
│   │   └── data/
│   └── src/
│       ├── components/
│       └── pages/
│
├── hadoop/
│
├── ml/
│   ├── preprocessing.py
│   └── output/
│
├── scripts/
│   └── generate_dataset.py
│
├── .gitignore
└── README.md

---

⚙️ Getting Started

Prerequisites

Make sure the following are installed:

- Node.js
- npm
- Python
- Hadoop
- Hive
- WSL2 / Ubuntu
- Power BI Desktop

---

1. Clone the Repository

git clone <repository-url>
cd Big-Data-Powered-Warehouse-Inventory-Intelligence

---

2. Install Backend Dependencies

cd backend
npm install

---

3. Start the Backend

node server.js

The backend API runs on:

http://localhost:5000

---

4. Install Frontend Dependencies

Open another terminal and run:

cd frontend
npm install

---

5. Start the Frontend

npm run dev

Open the local URL displayed by Vite in your browser.

---

🔗 Backend API

The frontend communicates with the backend through REST APIs.

Example inventory endpoint:

http://localhost:5000/api/powerbi/inventory

The backend provides product, inventory, forecasting, and analytics data required by the application.

---

📦 Dataset

The project contains warehouse datasets covering:

- Sales
- Products
- Inventory
- Suppliers
- External events
- Processed sales information
- Forecasting outputs

The dataset was expanded to provide a more realistic environment for Big Data processing, demand forecasting, and inventory intelligence.

---

💡 Project Novelty

The major strength of this project is the integration of Big Data processing, Machine Learning, inventory risk analysis, and business intelligence into a single decision-support platform.

Instead of simply displaying current inventory levels, the system connects:

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

This moves the system beyond basic descriptive inventory reporting toward predictive and decision-support analytics.

---

🎯 Benefits

The system can help warehouse managers:

- Identify high-risk products
- Anticipate future demand
- Reduce potential stockouts
- Avoid unnecessary overstocking
- Prioritize replenishment
- Monitor inventory health
- Understand product-level demand patterns
- Make data-driven inventory decisions

---

🚀 Future Scope

The system can be extended with:

- Real-time IoT-based inventory monitoring
- Barcode and RFID integration
- Advanced time-series forecasting
- Automated supplier selection
- Automated purchase-order generation
- Cloud deployment
- Real-time streaming using Apache Kafka
- Advanced anomaly detection
- Mobile warehouse management application

---

👥 Team

Big Data Powered Warehouse Inventory Intelligence using Demand Forecasting

Team Size: 3 Members

Developed as an academic project integrating Big Data, Machine Learning, Web Development, and Business Intelligence.

---

📌 Project Status

Component| Status
Big Data Processing| ✅ Complete
HDFS / MapReduce / Hive| ✅ Complete
Machine Learning| ✅ Complete
Demand Forecasting| ✅ Complete
Inventory Optimization| ✅ Complete
Risk Analysis| ✅ Complete
Smart Recommendations| ✅ Complete
React Web Application| ✅ Complete
Power BI Dashboard| ✅ Complete
Dataset Enhancement| ✅ Complete
GitHub Repository| ✅ Complete

🏆 Overall Development Status: 100% Complete

---

📜 License

This project was developed for academic and educational purposes.
