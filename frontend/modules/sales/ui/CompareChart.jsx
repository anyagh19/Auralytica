import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

function CompareChart({ actual, lrPred, rfPred, title = "Model Comparison" }) {
  // Guard against missing or empty data
  if (!actual || !actual.length) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg text-gray-500">
        No data available
      </div>
    );
  }

  // Prepare data for Recharts
  const chartData = actual.map((val, index) => ({
    index: index + 1, // start from 1 for better readability
    actual: val,
    lr: lrPred?.[index] ?? null,
    rf: rfPred?.[index] ?? null,
  }));

  return (
    <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
      {title && <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="index"
            label={{ value: 'Test Sample', position: 'insideBottom', offset: -5 }}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            label={{ value: 'Quantity', angle: -90, position: 'insideLeft' }}
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)',
            }}
          />
          <Legend verticalAlign="top" height={36} />
          <Line
            type="monotone"
            dataKey="actual"
            stroke="#000000"
            strokeWidth={2}
            dot={{ r: 2 }}
            activeDot={{ r: 6 }}
            name="Actual"
          />
          <Line
            type="monotone"
            dataKey="lr"
            stroke="#8884d8"
            strokeWidth={2}
            dot={{ r: 2 }}
            name="Linear Regression"
          />
          <Line
            type="monotone"
            dataKey="rf"
            stroke="#82ca9d"
            strokeWidth={2}
            dot={{ r: 2 }}
            name="Random Forest"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CompareChart;