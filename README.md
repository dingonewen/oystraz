# Oystraz

> **"Life is your oyster; Orchestrate its essence."**
> A high-precision nutrition management and life-optimization engine powered by the USDA Foundation Foods database.

---

## 1. Project Philosophy
Oystraz is a portmanteau of **Oyster** (representing the inherent potential in raw opportunities) and **Orchestration** (the systematic coordination of complex elements). In a high-velocity environment, Oystraz empowers users to transition from passive consumption to active orchestration of their nutritional health through rigorous data-driven insights.

## 2. Technical Architecture
The project is built with a modular, decoupled architecture to ensure scalability, data integrity, and maintainability.

### 2.1 Repository Structure
```text
Oystraz/
├── app.py                 # Streamlit application entry point
├── preprocess.py          # ETL Pipeline (Raw Data -> Processed Parquet)
├── requirements.txt       # Dependency management (Version-locked)
├── .gitignore             # Environment & OS-level exclusions
├── data/
│   ├── raw/               # Immutable USDA source files (Audit Trail)
│   └── processed/         # Optimized, cleaned master dataset
├── src/
│   ├── components/        # Reusable UI modules
│   └── utils/             # Business logic & unit conversions
└── tests/                 # QA & Data validation scripts