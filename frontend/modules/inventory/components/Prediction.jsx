import React, { useState } from 'react';
import { Upload, Brain, TrendingUp, AlertCircle, CheckCircle, Database, TrendingDown, Package, Globe, ShoppingCart, Lightbulb, BarChart3 } from 'lucide-react';

export default function SalesPredictionApp() {
  const [file, setFile] = useState(null);
  const [encodedData, setEncodedData] = useState(null);
  const [encodingPlan, setEncodingPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modelMetrics, setModelMetrics] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);

  const handleFileUpload = async (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    setError(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', uploadedFile);

      const response = await fetch('http://localhost:8000/api/get-encoding-plan/', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setEncodedData(data.encoded_data);
        setEncodingPlan(data.encoding_plan);
        setCurrentStep(2);
      } else {
        setError(data.error || 'Failed to process file');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const trainModel = async (modelType = 'random_forest') => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/api/train-model/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          encoded_data: encodedData,
          model_type: modelType,
          target_column: 'Total Revenue',
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setModelMetrics(data.metrics);
        setCurrentStep(3);
      } else {
        setError(data.error || 'Failed to train model');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const makePredictions = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/api/predict/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          encoded_data: encodedData,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setPredictions(data);
        setCurrentStep(4);
      } else {
        setError(data.error || 'Failed to make predictions');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
            <Brain className="text-indigo-600" size={40} />
            Sales Prediction ML System
          </h1>
          <p className="text-gray-600">Upload your sales data, train AI models, and predict revenue</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8 bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            {[
              { num: 1, label: 'Upload Data', icon: Upload },
              { num: 2, label: 'Train Model', icon: Brain },
              { num: 3, label: 'View Results', icon: TrendingUp },
              { num: 4, label: 'Predictions', icon: CheckCircle }
            ].map((step, idx) => (
              <React.Fragment key={step.num}>
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    currentStep >= step.num ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    <step.icon size={20} />
                  </div>
                  <span className="mt-2 text-sm font-medium text-gray-600">{step.label}</span>
                </div>
                {idx < 3 && (
                  <div className={`flex-1 h-1 mx-4 ${
                    currentStep > step.num ? 'bg-indigo-600' : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
            <div>
              <h3 className="font-semibold text-red-800">Error</h3>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Step 1: File Upload */}
        {currentStep === 1 && (
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Database className="text-indigo-600" />
              Upload Sales Data
            </h2>
            <p className="text-gray-600 mb-6">
              Upload a CSV file with your sales data. It should include columns like Region, Country, Item Type, Sales Channel, etc.
            </p>
            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-indigo-300 rounded-lg cursor-pointer bg-indigo-50 hover:bg-indigo-100 transition">
              <Upload className="text-indigo-600 mb-3" size={48} />
              <span className="text-lg font-medium text-indigo-600">
                {file ? file.name : 'Click to upload CSV file'}
              </span>
              <span className="text-sm text-gray-500 mt-2">CSV files only</span>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
                disabled={loading}
              />
            </label>
            {loading && (
              <div className="mt-4 text-center text-indigo-600 font-medium">
                Processing file... This may take a moment.
              </div>
            )}
          </div>
        )}

        {/* Step 2: Train Model */}
        {currentStep === 2 && encodedData && (
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Brain className="text-indigo-600" />
              Train Machine Learning Model
            </h2>
            <div className="mb-6">
              <p className="text-gray-600 mb-2">
                Data encoded successfully! {encodedData.length} rows ready for training.
              </p>
              <div className="bg-indigo-50 p-4 rounded-lg">
                <h3 className="font-semibold text-indigo-900 mb-2">Encoding Summary:</h3>
                <ul className="text-sm text-indigo-700 space-y-1">
                  {encodingPlan?.slice(0, 5).map((plan, idx) => (
                    <li key={idx}>
                      • {plan.column}: {plan.recommended_encoding}
                    </li>
                  ))}
                  {encodingPlan?.length > 5 && <li>• ... and {encodingPlan.length - 5} more</li>}
                </ul>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { type: 'random_forest', name: 'Random Forest', desc: 'Best for accuracy' },
                { type: 'gradient_boosting', name: 'Gradient Boosting', desc: 'Powerful ensemble' },
                { type: 'linear_regression', name: 'Linear Regression', desc: 'Fast and simple' }
              ].map((model) => (
                <button
                  key={model.type}
                  onClick={() => trainModel(model.type)}
                  disabled={loading}
                  className="p-4 border-2 border-indigo-200 rounded-lg hover:border-indigo-600 hover:bg-indigo-50 transition disabled:opacity-50"
                >
                  <h3 className="font-semibold text-gray-800">{model.name}</h3>
                  <p className="text-sm text-gray-600">{model.desc}</p>
                </button>
              ))}
            </div>
            {loading && (
              <div className="text-center text-indigo-600 font-medium">
                Training model... This may take a minute.
              </div>
            )}
          </div>
        )}

        {/* Step 3: Model Results */}
        {currentStep === 3 && modelMetrics && (
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUp className="text-indigo-600" />
              Training Results
            </h2>
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="font-semibold text-green-900 mb-3">Test Set Performance</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-green-700">R² Score:</span>
                    <span className="font-bold text-green-900">
                      {(modelMetrics.test_metrics.r2 * 100).toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">RMSE:</span>
                    <span className="font-bold text-green-900">
                      ${modelMetrics.test_metrics.rmse.toLocaleString(undefined, {maximumFractionDigits: 2})}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">MAE:</span>
                    <span className="font-bold text-green-900">
                      ${modelMetrics.test_metrics.mae.toLocaleString(undefined, {maximumFractionDigits: 2})}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-3">Model Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-700">Model Type:</span>
                    <span className="font-medium text-blue-900">{modelMetrics.model_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Training Size:</span>
                    <span className="font-medium text-blue-900">{modelMetrics.train_size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Test Size:</span>
                    <span className="font-medium text-blue-900">{modelMetrics.test_size}</span>
                  </div>
                </div>
              </div>
            </div>

            {modelMetrics.feature_importance && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">Top 10 Important Features</h3>
                <div className="space-y-2">
                  {modelMetrics.feature_importance.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <span className="text-sm text-gray-600 w-48 truncate">{feat.feature}</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-4">
                        <div
                          className="bg-indigo-600 h-4 rounded-full"
                          style={{ width: `${(feat.importance * 100).toFixed(1)}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {(feat.importance * 100).toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={makePredictions}
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
            >
              Make Predictions on Dataset
            </button>
          </div>
        )}

        {/* Step 4: Predictions */}
        {currentStep === 4 && predictions && (
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <CheckCircle className="text-indigo-600" />
              Predictions Complete
            </h2>
            {predictions.comparison && (
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-purple-50 p-6 rounded-lg text-center">
                  <div className="text-3xl font-bold text-purple-900 mb-1">
                    {(predictions.comparison.r2 * 100).toFixed(1)}%
                  </div>
                  <div className="text-purple-700">Accuracy (R²)</div>
                </div>
                <div className="bg-orange-50 p-6 rounded-lg text-center">
                  <div className="text-3xl font-bold text-orange-900 mb-1">
                    ${predictions.comparison.rmse.toLocaleString(undefined, {maximumFractionDigits: 0})}
                  </div>
                  <div className="text-orange-700">RMSE</div>
                </div>
                <div className="bg-teal-50 p-6 rounded-lg text-center">
                  <div className="text-3xl font-bold text-teal-900 mb-1">
                    ${predictions.comparison.mae.toLocaleString(undefined, {maximumFractionDigits: 0})}
                  </div>
                  <div className="text-teal-700">MAE</div>
                </div>
              </div>
            )}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-3">Sample Predictions (First 10 rows):</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-indigo-100">
                    <tr>
                      <th className="p-2 text-left">Actual</th>
                      <th className="p-2 text-left">Predicted</th>
                      <th className="p-2 text-left">Difference</th>
                    </tr>
                  </thead>
                  <tbody>
                    {predictions.comparison?.actual.slice(0, 10).map((actual, idx) => {
                      const predicted = predictions.comparison.predicted[idx];
                      const diff = actual - predicted;
                      return (
                        <tr key={idx} className="border-b">
                          <td className="p-2">${actual.toLocaleString(undefined, {maximumFractionDigits: 2})}</td>
                          <td className="p-2">${predicted.toLocaleString(undefined, {maximumFractionDigits: 2})}</td>
                          <td className={`p-2 ${diff > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            ${Math.abs(diff).toLocaleString(undefined, {maximumFractionDigits: 2})}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            <button
              onClick={() => {
                setCurrentStep(1);
                setFile(null);
                setEncodedData(null);
                setModelMetrics(null);
                setPredictions(null);
              }}
              className="w-full mt-6 bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition"
            >
              Start Over with New Data
            </button>
          </div>
        )}
      </div>
    </div>
  );
}