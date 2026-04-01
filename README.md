# Sales Forecasting System

A full‑stack web application for inventory and sales management with integrated machine learning forecasting. Built with Django (DRF) and React.

## Overview

The Sales Forecasting System helps businesses manage their inventory, track sales, and predict future sales using machine learning. It provides:

- **Inventory management** – Add, update, delete products.
- **Sales management** – Record sales, automatically deduct inventory.
- **Sales analysis** – Visualize actual vs predicted sales, view model metrics.
- **Sales forecasting** – Predict future sales based on historical data using Random Forest regression.

The backend uses Django REST Framework with JWT authentication. The frontend is built with React, Redux Toolkit, and Tailwind CSS.

## Features

- 🔐 **JWT Authentication** – Secure login and token refresh.
- 📦 **Inventory CRUD** – Manage products with quantity, price, category, brand.
- 💰 **Sales CRUD** – Record sales, automatically update inventory.
- 📊 **Sales Dashboard** – Overview of total sales, navigation to analysis and prediction.
- 📈 **Sales Analysis** – Visual comparison of actual vs predicted sales, model performance metrics (MSE, R²), feature importance.
- 🤖 **Machine Learning Forecasting** – Random Forest model with hyperparameter tuning.
- 📱 **Responsive UI** – Works on desktop and mobile.

## Tech Stack

### Backend
- Python 3.10+
- Django 4.2
- Django REST Framework
- Simple JWT (JSON Web Tokens)
- scikit‑learn
- pandas, numpy

### Frontend
- React 18
- Redux Toolkit (state management)
- React Router v6
- Axios (HTTP client)
- Tailwind CSS (styling)
- Recharts (data visualization)
- lucide-react (icons)

## Project Structure
project/
├── backend/
│   ├── api/
│   │   ├── migrations/
│   │   ├── __init__.py
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── urls.py
│   │   └── views.py
│   ├── backend/
│   │   ├── __init__.py
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── manage.py
│   └── requirements.txt
└── frontend/
    ├── public/
    │   ├── index.html
    │   └── favicon.ico
    ├── src/
    │   ├── api.js
    │   ├── constants.js
    │   ├── common/
    │   │   └── ui/
    │   │       └── Dialog.jsx
    │   ├── modules/
    │   │   ├── auth/
    │   │   │   ├── Login.jsx
    │   │   │   ├── Register.jsx
    │   │   │   └── ProtectedRoutes.jsx
    │   │   ├── dashboard/
    │   │   │   └── Dashboard.jsx
    │   │   ├── inventory/
    │   │   │   ├── InventoryTable.jsx
    │   │   │   └── ui/
    │   │   │       ├── CreateProductForm.jsx
    │   │   │       └── DeleteProductForm.jsx
    │   │   ├── sales/
    │   │   │   ├── SalesTable.jsx
    │   │   │   ├── SalesAnalysis.jsx
    │   │   │   └── ui/
    │   │   │       ├── CreateSalesProductForm.jsx
    │   │   │       ├── DeleteProductForm.jsx
    │   │   │       ├── UpdateSalesForm.jsx
    │   │   │       ├── PredictionChart.jsx
    │   │   │       ├── MetricsChart.jsx
    │   │   │       └── FeatureImportanceChart.jsx
    │   │   └── prediction/
    │   │       └── PredictionPage.jsx
    │   ├── redux/
    │   │   ├── store.js
    │   │   └── slices/
    │   │       ├── totalSalesSlice.js
    │   │       └── salesSelector.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── package.json
    ├── tailwind.config.js
    ├── postcss.config.js
    └── vite.config.js

## Installation

### Backend Setup

1. **Clone the repository**
   git clone https://github.com/your-username/sales-forecasting.git
   cd sales-forecasting/backend

2. **Create and activate a virtual environment**
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate

3. **Install dependencies**
   pip install -r requirements.txt

4. **Apply migrations**
   python manage.py makemigrations
   python manage.py migrate

5. **Create a superuser (optional)**
   python manage.py createsuperuser

6. **Run the development server**
   python manage.py runserver
   The API will be available at http://127.0.0.1:8000/api/.

### Frontend Setup

1. **Navigate to the frontend directory**
   cd ../frontend

2. **Install dependencies**
   npm install

3. **Create environment file**
   Copy .env.example to .env and set the API URL:
   VITE_API_URL=http://127.0.0.1:8000/api/

4. **Start the development server**
   npm run dev
   The app will open at http://localhost:5173.

## Environment Variables

### Backend
Create a .env file in the backend directory with:
   DEBUG=True
   SECRET_KEY=your-secret-key
   ALLOWED_HOSTS=localhost,127.0.0.1

### Frontend
Create a .env file in the frontend directory:
   VITE_API_URL=http://127.0.0.1:8000/api/

## Running the Application

1. Start the Django backend:
   cd backend
   python manage.py runserver

2. Start the React frontend (in another terminal):
   cd frontend
   npm run dev

3. Open http://localhost:5173 in your browser.

## API Endpoints

### Authentication
- POST /api/token/ – Obtain access and refresh tokens.
- POST /api/token/refresh/ – Refresh access token.
- POST /api/user/register/ – Register new user.

### Inventory
- GET /api/list-inventory-product/ – List all inventory items.
- POST /api/create-inventory-product/ – Create new inventory item (if duplicate, quantity is merged).
- DELETE /api/delete-inventory-product/<id>/ – Delete inventory item.
- PATCH /api/inventory/<id>/update/ – Update inventory item (quantity, price, etc.).

### Sales
- GET /api/list-sales-product/ – List all sales records.
- POST /api/create-sales-product/ – Create a sales record (deducts inventory).
- DELETE /api/delete-sales-product/<id>/ – Delete sales record.
- PATCH /api/update-sales-product/<id>/ – Update sales record.

### ML Prediction
- GET /api/sales-prediction/ – Returns model metrics, feature importance, and test set predictions.

## Machine Learning Model

The prediction endpoint (/api/sales-prediction/) trains a Random Forest regressor on the sales data, using:

- **Features**: product name, brand name, category, price, and date components (year, month, day, day of week, quarter).
- **Target**: quantity sold.
- **Hyperparameter tuning**: GridSearchCV with cross‑validation.
- **Output**: MSE, R², feature importance, and actual vs predicted quantities for the test set.

## Usage

### Inventory
- Add products with name, brand, category, price, quantity.
- Update products (e.g., adjust quantity).
- Delete products.

### Sales
- Create a sales record by selecting an existing inventory item and entering quantity.
- The system automatically reduces inventory.
- Update sales quantity/price (inventory is NOT automatically adjusted; this can be extended).
- View total sales amount.

### Dashboard
- Overview of key metrics.
- Quick navigation to Sales Analysis and Prediction.

### Sales Analysis
- View actual vs predicted sales (line chart).
- Model performance metrics (MSE, R²) displayed as gauges.
- Feature importance bar chart.

## License

This project is licensed under the MIT License – see the LICENSE file for details.

Built with ❤️ using Django & React
