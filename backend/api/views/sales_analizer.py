import pandas as pd
import numpy as np
from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.preprocessing import LabelEncoder, StandardScaler
from ..serializers import SalesSerializer
from ..models import Sales

class SalesPredictionView(generics.GenericAPIView):
    """
    Returns sales prediction using RandomForest with feature engineering.
    """
    queryset = Sales.objects.all()
    serializer_class = SalesSerializer
    permission_classes = [AllowAny]

    def get(self, request):
        sales = self.get_queryset()
        if not sales.exists():
            return Response({"error": "No sales data available"}, status=status.HTTP_404_NOT_FOUND)

        # Serialize to DataFrame
        serializer = self.get_serializer(sales, many=True)
        df = pd.DataFrame(serializer.data)

        # Feature engineering
        df['created_at'] = pd.to_datetime(df['created_at'])
        df['year'] = df['created_at'].dt.year
        df['month'] = df['created_at'].dt.month
        df['day'] = df['created_at'].dt.day
        df['dayofweek'] = df['created_at'].dt.dayofweek   # Monday=0, Sunday=6
        df['quarter'] = df['created_at'].dt.quarter

        # Drop columns not needed as features
        feature_cols = ['product_name', 'brand_name', 'category', 'price',
                        'year', 'month', 'day', 'dayofweek', 'quarter']
        target_col = 'quantity'

        X = df[feature_cols]
        y = df[target_col]

        # Encode categorical features
        categorical_cols = ['product_name', 'brand_name', 'category']
        X_encoded = pd.get_dummies(X, columns=categorical_cols, drop_first=False)

        # Split data (time‑based split would be better but we'll do random for simplicity)
        X_train, X_test, y_train, y_test = train_test_split(
            X_encoded, y, test_size=0.2, random_state=42, shuffle=True
        )

        # Align columns after split (in case one‑hot columns differ due to unseen categories)
        # Ensure test set has same columns as training set
        missing_cols = set(X_train.columns) - set(X_test.columns)
        for col in missing_cols:
            X_test[col] = 0
        X_test = X_test[X_train.columns]

        # Optional scaling (RandomForest doesn't require scaling, but it's harmless)
        # scaler = StandardScaler()
        # X_train_scaled = scaler.fit_transform(X_train)
        # X_test_scaled = scaler.transform(X_test)

        # Hyperparameter tuning with GridSearchCV
        param_grid = {
            'n_estimators': [50, 100, 200],
            'max_depth': [5, 10, None],
            'min_samples_split': [2, 5, 10]
        }
        rf = RandomForestRegressor(random_state=42)
        grid_search = GridSearchCV(rf, param_grid, cv=3, scoring='neg_mean_squared_error', n_jobs=-1)
        grid_search.fit(X_train, y_train)

        best_rf = grid_search.best_estimator_

        # Predictions
        y_train_pred = best_rf.predict(X_train)
        y_test_pred = best_rf.predict(X_test)

        # Metrics
        train_mse = mean_squared_error(y_train, y_train_pred)
        train_r2 = r2_score(y_train, y_train_pred)
        test_mse = mean_squared_error(y_test, y_test_pred)
        test_r2 = r2_score(y_test, y_test_pred)

        # Feature importances
        feature_importance = pd.Series(
            best_rf.feature_importances_,
            index=X_train.columns
        ).sort_values(ascending=False).head(10).to_dict()

        # Prepare response data for the test set
        test_actual = y_test.values.tolist()
        test_predicted = y_test_pred.tolist()
        # Optionally include dates for plotting
        test_dates = df.loc[y_test.index, 'created_at'].dt.strftime('%Y-%m-%d').tolist()

        return Response({
            "status": "success",
            "model": "RandomForest",
            "best_params": grid_search.best_params_,
            "metrics": {
                "train_mse": train_mse,
                "train_r2": train_r2,
                "test_mse": test_mse,
                "test_r2": test_r2
            },
            "feature_importance": feature_importance,
            "test_data": {
                "dates": test_dates,
                "actual": test_actual,
                "predicted": test_predicted
            }
        })