import React, { useEffect, useState } from 'react';
import api from '../../../src/api';
import PredictionChart from '../ui/PredictionChart';
import MetricsChart from '../ui/MetricChart';
import FeatureImportanceChart from '../ui/FeatureImportanceChart'; // optional new component
import { Loader2 } from 'lucide-react';

function SalesAnalysis() {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrediction = async () => {
      try {
        const response = await api.get('sales-prediction'); // adjust endpoint as needed
        setPrediction(response.data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Failed to load prediction data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchPrediction();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
          <p className="text-gray-600">Loading prediction data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center max-w-md">
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  const { metrics, test_data, feature_importance, best_params } = prediction;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-24 px-6 md:px-12 font-sans">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
          Sales Prediction Dashboard
        </h1>
        <p className="text-gray-500 mt-2">
          Machine Learning Model Analysis & Performance Metrics
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Test MSE</h3>
          <p className="text-2xl font-bold text-blue-600 mt-2">{metrics.test_mse.toFixed(4)}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Test R² Score</h3>
          <p className="text-2xl font-bold text-green-600 mt-2">{metrics.test_r2.toFixed(4)}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Train MSE</h3>
          <p className="text-2xl font-bold text-gray-700 mt-2">{metrics.train_mse.toFixed(4)}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Train R² Score</h3>
          <p className="text-2xl font-bold text-gray-700 mt-2">{metrics.train_r2.toFixed(4)}</p>
        </div>
      </div>

      {/* Actual vs Predicted Chart */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Actual vs Predicted (Test Data)
        </h2>
        <PredictionChart
          actual={test_data.actual}
          predicted={test_data.predicted}
          dates={test_data.dates}
        />
      </div>

      {/* Metrics Chart */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Model Performance Metrics
        </h2>
        <MetricsChart
          trainMse={metrics.train_mse}
          trainR2={metrics.train_r2}
          testMse={metrics.test_mse}
          testR2={metrics.test_r2}
        />
      </div>

      {/* Feature Importance (optional) */}
      {feature_importance && Object.keys(feature_importance).length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Top Feature Importances
          </h2>
          <FeatureImportanceChart data={feature_importance} />
        </div>
      )}

      {/* Best Parameters (optional) */}
      {best_params && (
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Best model parameters: {JSON.stringify(best_params)}</p>
        </div>
      )}
    </div>
  );
}

export default SalesAnalysis;