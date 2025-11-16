import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
import joblib
import json
from datetime import datetime
import os

class SalesPredictionModel:
    def __init__(self):
        self.model = None
        self.feature_columns = None
        self.target_column = None
        self.model_metadata = {}
        
    def prepare_features(self, df, target_col='Total Revenue'):
        """
        Prepare features by removing target and unnecessary columns
        """
        # Remove columns that shouldn't be features
        exclude_cols = [
            target_col, 
            'Total Cost',  # Derived from other features
            'Total Profit',  # Derived from other features
            'Order ID'  # Not useful for prediction
        ]
        
        # Get feature columns
        feature_cols = [col for col in df.columns if col not in exclude_cols]
        
        # Handle any remaining NaN values
        X = df[feature_cols].copy()
        X = X.fillna(0)  # Fill NaN with 0
        
        # Convert boolean columns to int
        for col in X.columns:
            if X[col].dtype == bool:
                X[col] = X[col].astype(int)
        
        y = df[target_col].copy()
        
        return X, y, feature_cols
    
    def train_model(self, df, target_col='Total Revenue', model_type='random_forest', test_size=0.2):
        """
        Train the sales prediction model
        
        Parameters:
        - df: Encoded dataframe
        - target_col: Column to predict (default: 'Total Revenue')
        - model_type: 'random_forest', 'gradient_boosting', or 'linear_regression'
        - test_size: Proportion of data for testing
        """
        # Prepare features
        X, y, feature_cols = self.prepare_features(df, target_col)
        self.feature_columns = feature_cols
        self.target_column = target_col
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=test_size, random_state=42
        )
        
        # Select and train model
        if model_type == 'random_forest':
            self.model = RandomForestRegressor(
                n_estimators=100,
                max_depth=15,
                min_samples_split=5,
                random_state=42,
                n_jobs=-1
            )
        elif model_type == 'gradient_boosting':
            self.model = GradientBoostingRegressor(
                n_estimators=100,
                max_depth=5,
                learning_rate=0.1,
                random_state=42
            )
        else:  # linear_regression
            self.model = LinearRegression()
        
        # Train
        print(f"Training {model_type} model...")
        self.model.fit(X_train, y_train)
        
        # Evaluate
        train_pred = self.model.predict(X_train)
        test_pred = self.model.predict(X_test)
        
        # Calculate metrics - CONVERT TO FLOAT
        train_metrics = {
            'rmse': float(np.sqrt(mean_squared_error(y_train, train_pred))),
            'mae': float(mean_absolute_error(y_train, train_pred)),
            'r2': float(r2_score(y_train, train_pred))
        }
        
        test_metrics = {
            'rmse': float(np.sqrt(mean_squared_error(y_test, test_pred))),
            'mae': float(mean_absolute_error(y_test, test_pred)),
            'r2': float(r2_score(y_test, test_pred))
        }
        
        # Feature importance (if available)
        feature_importance = None
        if hasattr(self.model, 'feature_importances_'):
            importance_df = pd.DataFrame({
                'feature': feature_cols,
                'importance': self.model.feature_importances_
            }).sort_values('importance', ascending=False)
            
            # Convert to list of dicts with float values
            feature_importance = [
                {'feature': row['feature'], 'importance': float(row['importance'])}
                for _, row in importance_df.iterrows()
            ]
        
        # Store metadata
        self.model_metadata = {
            'model_type': model_type,
            'target_column': target_col,
            'training_date': datetime.now().isoformat(),
            'train_size': int(len(X_train)),
            'test_size': int(len(X_test)),
            'train_metrics': train_metrics,
            'test_metrics': test_metrics,
            'feature_importance': feature_importance[:10] if feature_importance else None  # Top 10
        }
        
        return self.model_metadata
    
    def predict(self, df):
        """
        Make predictions on new data
        """
        if self.model is None:
            raise ValueError("Model not trained yet!")
        
        # Prepare features (same columns as training)
        X = df[self.feature_columns].copy()
        X = X.fillna(0)
        
        # Convert boolean to int
        for col in X.columns:
            if X[col].dtype == bool:
                X[col] = X[col].astype(int)
        
        predictions = self.model.predict(X)
        return predictions
    
    def save_model(self, filepath='sales_model.pkl'):
        """
        Save the trained model to disk
        """
        if self.model is None:
            raise ValueError("No model to save!")
        
        model_data = {
            'model': self.model,
            'feature_columns': self.feature_columns,
            'target_column': self.target_column,
            'metadata': self.model_metadata
        }
        
        joblib.dump(model_data, filepath)
        print(f"Model saved to {filepath}")
    
    def load_model(self, filepath='sales_model.pkl'):
        """
        Load a trained model from disk
        """
        if not os.path.exists(filepath):
            raise FileNotFoundError(f"Model file not found: {filepath}")
        
        model_data = joblib.load(filepath)
        self.model = model_data['model']
        self.feature_columns = model_data['feature_columns']
        self.target_column = model_data['target_column']
        self.model_metadata = model_data['metadata']
        
        print(f"Model loaded from {filepath}")
        return self.model_metadata