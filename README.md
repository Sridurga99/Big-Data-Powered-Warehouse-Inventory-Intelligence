📦 Big Data Powered Warehouse Inventory Intelligence

Demand Forecasting • Inventory Risk Analysis • Smart Replenishment • Business Intelligence

An end-to-end Big Data and Machine Learning powered warehouse inventory intelligence system designed to help warehouses monitor stock levels, forecast future demand, identify inventory risks, and generate intelligent reorder recommendations.

The system combines Hadoop, MapReduce, Hive, Python, Machine Learning, Node.js, React, and Power BI into a unified warehouse analytics platform.

---

🎯 Project Overview

Traditional inventory management systems often rely on historical stock information and manual reorder decisions. This can lead to:

- Overstocking
- Stock shortages
- Poor demand planning
- Delayed replenishment
- Increased holding costs
- Difficulty identifying high-risk products

This project addresses these challenges by processing large-scale warehouse data and combining Big Data processing, demand forecasting, inventory optimization, and interactive analytics.

The system transforms raw sales and inventory data into actionable insights such as:

«What is selling? → What will be needed? → What is at risk? → What should be reordered?»

---

✨ Key Features

📊 Big Data Processing

- HDFS-based distributed data storage
- MapReduce-based sales aggregation
- Hive-based data analysis
- YARN-supported Hadoop ecosystem
- Large-scale warehouse dataset processing

🔮 Demand Forecasting

- Historical sales preprocessing
- Product-level demand analysis
- Machine Learning based forecasting
- Average daily demand calculation
- Maximum forecast demand estimation
- Demand variability analysis

⚠️ Inventory Risk Intelligence

- Inventory Risk Score
- High / Medium / Low risk classification
- Current stock monitoring
- Reorder point calculation
- Days of inventory analysis
- Identification of products requiring attention

🔄 Smart Replenishment

The system generates recommended order quantities based on:

- Forecasted demand
- Current inventory
- Supplier lead time
- Demand variability
- Safety stock requirements

📈 Power BI Analytics

Interactive dashboards provide:

- Executive inventory overview
- Inventory intelligence
- Demand & forecasting analysis
- Warehouse/product analysis
- Risk distribution
- Product-level insights
- Inventory status analysis

🖥️ Interactive Warehouse Web Application

The frontend provides:

- Inventory Command Center
- Product management
- Demand forecasting
- Smart recommendations
- Risk analysis
- Warehouse-themed animations
- Interactive navigation
- Power BI dashboard integration

---

🏗️ System Architecture

                    ┌───────────────────────┐
                    │   Warehouse Dataset   │
                    │ Sales / Inventory /   │
                    │ Products / Suppliers │
                    └───────────┬───────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │         HDFS          │
                    │ Distributed Storage   │
                    └───────────┬───────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │      MapReduce        │
                    │ Sales Aggregation     │
                    └───────────┬───────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │         Hive          │
                    │ Data Analysis / SQL   │
                    └───────────┬───────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │ Python + ML Pipeline  │
                    │ Preprocessing         │
                    │ Demand Forecasting    │
                    │ Inventory Optimization│
                    └───────────┬───────────┘
                                │
                 ┌──────────────┴──────────────┐
                 ▼                             ▼
       ┌──────────────────┐          ┌──────────────────┐
       │ Node.js Backend  │          │    Power BI      │
       │ REST API + DB    │          │ Interactive      │
       │                  │          │ Dashboards       │
       └────────┬─────────┘          └──────────────────┘
                │
                ▼
       ┌──────────────────┐
       │ React Frontend   │
       │ Warehouse UI     │
       └──────────────────┘

---

🧠 Inventory Intelligence

The system calculates important inventory indicators.

Safety Stock

Safety Stock = Demand Standard Deviation × √Lead Time

Reorder Point

Reorder Point = Lead Time Demand + Safety Stock

Risk Classification

Risk Score| Category
≥ 70| 🔴 High Risk
40–69| 🟠 Medium Risk
< 40| 🟢 Low Risk

These indicators help determine which products require immediate attention.

---

🔮 Demand Forecasting Pipeline

Raw Sales Data
      ↓
Data Cleaning
      ↓
Feature Preparation
      ↓
Historical Demand Analysis
      ↓
Machine Learning Model
      ↓
Demand Forecast
      ↓
Inventory Optimization
      ↓
Reorder Recommendation

Generated outputs include:

processed_sales.csv
forecasted_sales.csv
inventory_recommendations.csv

---

📊 Power BI Dashboard

The project includes four major Power BI dashboard areas.

1. Executive Dashboard

Provides a high-level view of:

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

- Hadoop HDFS
- Hadoop MapReduce
- Apache Hive
- YARN

Data & Machine Learning

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

Visualization & BI

- Power BI

Development Tools

- VS Code
- Git
- GitHub
- WSL2 / Ubuntu

---

📁 Project Structure

Big-Data-Powered-Warehouse-Inventory-Intelligence/
│
├── backend/
│   ├── server.js
│   ├── migrate_ml_data.js
│   ├── sync_ml_to_db.js
│   ├── package.json
│   └── warehouse.db
│
├── data/
│   ├── sales.csv
│   ├── inventory.csv
│   ├── products.csv
│   ├── suppliers.csv
│   ├── external_events.csv
│   └── processed/
│
├── frontend/
│   ├── public/
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
├── docs/
│
└── README.md

---

⚙️ Getting Started

1. Clone the Repository

git clone <repository-url>
cd Big-Data-Powered-Warehouse-Inventory-Intelligence

2. Install Backend Dependencies

cd backend
npm install

3. Start the Backend

node server.js

The backend runs on:

http://localhost:5000

4. Install Frontend Dependencies

Open another terminal:

cd frontend
npm install

5. Start the Frontend

npm run dev

The Vite development server will provide the local frontend URL.

---

🔗 Backend API

The application uses REST APIs to connect the frontend with warehouse data.

Example inventory endpoint:

/api/powerbi/inventory

The backend provides product and inventory information required by the web application and analytics layer.

---

📦 Dataset

The project uses warehouse-related datasets containing information about:

- Sales
- Products
- Inventory
- Suppliers
- External events
- Demand-related information

The expanded dataset is designed to provide a more realistic Big Data processing environment for warehouse intelligence and forecasting.

---

💡 Project Novelty

The key contribution of this project is the integration of multiple decision-making components into a single warehouse intelligence platform.

Instead of simply displaying inventory levels, the system connects:

Historical Sales
      +
Demand Forecast
      +
Demand Variability
      +
Supplier Lead Time
      +
Current Stock
      ↓
Inventory Risk
      +
Reorder Recommendation

This allows the system to move from descriptive analytics toward predictive and decision-support analytics.

---

🎯 Expected Benefits

The system can help warehouse managers:

- Identify products at risk
- Anticipate future demand
- Reduce stockout possibilities
- Avoid unnecessary overstocking
- Prioritize replenishment
- Understand product-level inventory behavior
- Make data-driven inventory decisions

---

🚀 Future Scope

Possible future enhancements include:

- Real-time IoT-based inventory monitoring
- Barcode/RFID integration
- More advanced time-series forecasting
- Automated supplier selection
- Dynamic pricing intelligence
- Automated purchase-order generation
- Cloud deployment
- Real-time streaming with Kafka
- Advanced anomaly detection
- Mobile warehouse management application

---

👥 Team

Project: Big Data Powered Warehouse Inventory Intelligence using Demand Forecasting

Team Size: 3 Members

Developed as an academic Big Data and Machine Learning project.

---

📌 Project Status

Big Data Processing        ✅ Complete
Machine Learning           ✅ Complete
Demand Forecasting         ✅ Complete
Inventory Optimization     ✅ Complete
Risk Analysis              ✅ Complete
Smart Recommendations      ✅ Complete
React Web Application      ✅ Complete
Power BI Dashboard         ✅ Complete
Dataset Enhancement        ✅ Complete
GitHub Repository          ✅ Complete

🏆 Overall Development Status: 100% Complete

---

📜 License

This project was developed for academic and educational purposes.
