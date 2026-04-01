import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

function MetricsChart({ mse = 0, r2 = 0, trainMse = null, trainR2 = null, testMse = null, testR2 = null }) {
  // For backward compatibility, if the new props are not provided, use the old ones
  const useTrainTest = trainMse !== null && trainR2 !== null && testMse !== null && testR2 !== null;
  const mseValue = useTrainTest ? testMse : mse;
  const r2Value = useTrainTest ? testR2 : r2;

  // If we have train/test data, we can display both
  if (useTrainTest) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* MSE Card */}
        <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
          <h3 className="text-gray-700 font-medium mb-2">Mean Squared Error (Test)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[{ name: 'MSE', value: testMse }]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-center text-sm text-gray-500 mt-2">Lower is better</p>
        </div>

        {/* R² Score Card */}
        <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
          <h3 className="text-gray-700 font-medium mb-2">R² Score (Test)</h3>
          <div className="flex flex-col items-center justify-center h-64">
            <div className="relative w-48 h-48">
              <svg className="transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="10" />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke={testR2 >= 0.8 ? '#10b981' : testR2 >= 0.6 ? '#3b82f6' : testR2 >= 0.4 ? '#eab308' : '#ef4444'}
                  strokeWidth="10"
                  strokeDasharray={`${testR2 * 283} 283`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-800">{testR2.toFixed(2)}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {testR2 >= 0.8 ? 'Excellent' : testR2 >= 0.6 ? 'Good' : testR2 >= 0.4 ? 'Fair' : 'Poor'}
                  </p>
                </div>
              </div>
            </div>
            <p className="text-center text-sm text-gray-500 mt-4">Closer to 1 is better</p>
          </div>
        </div>
      </div>
    );
  }

  // Fallback to simple cards for older data format
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* MSE Card */}
      <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
        <h3 className="text-gray-700 font-medium mb-2">Mean Squared Error (MSE)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[{ name: 'MSE', value: mseValue }]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-center text-sm text-gray-500 mt-2">Lower is better</p>
      </div>

      {/* R² Score Card */}
      <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
        <h3 className="text-gray-700 font-medium mb-2">R² Score</h3>
        <div className="flex flex-col items-center justify-center h-64">
          <div className="relative w-48 h-48">
            <svg className="transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="10" />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke={r2Value >= 0.8 ? '#10b981' : r2Value >= 0.6 ? '#3b82f6' : r2Value >= 0.4 ? '#eab308' : '#ef4444'}
                strokeWidth="10"
                strokeDasharray={`${r2Value * 283} 283`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-800">{r2Value.toFixed(2)}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {r2Value >= 0.8 ? 'Excellent' : r2Value >= 0.6 ? 'Good' : r2Value >= 0.4 ? 'Fair' : 'Poor'}
                </p>
              </div>
            </div>
          </div>
          <p className="text-center text-sm text-gray-500 mt-4">Closer to 1 is better</p>
        </div>
      </div>
    </div>
  );
}

export default MetricsChart;