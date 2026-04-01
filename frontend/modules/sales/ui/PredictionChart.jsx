import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from 'recharts';

function PredictionChart({
  actual = [],
  predicted = [],
  dates = null,
  title = "Actual vs Predicted",
  height = 400
}) {
  // Guard against missing data
  if (!actual.length || !predicted.length) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg text-gray-500">
        No data available for prediction chart
      </div>
    );
  }

  // Prepare data: if dates provided, use them, otherwise use index numbers
  const chartData = actual.map((val, index) => ({
    time: dates ? dates[index] : `Point ${index + 1}`,
    actual: val,
    predicted: predicted[index]
  }));

  return (
    <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
      {title && <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>}
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

            <XAxis
              dataKey="time"
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
              interval={Math.ceil(chartData.length / 10)} // adjust label density
            />

            <YAxis
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
              label={{ value: 'Quantity', angle: -90, position: 'insideLeft', offset: -5 }}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
            />

            <Legend verticalAlign="top" height={36} />

            <Area
              type="monotone"
              dataKey="actual"
              stroke="#6366f1"
              fillOpacity={1}
              fill="url(#colorActual)"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 6 }}
              name="Actual"
            />

            <Area
              type="monotone"
              dataKey="predicted"
              stroke="#10b981"
              fillOpacity={1}
              fill="url(#colorPredicted)"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 6 }}
              name="Predicted"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <p className="text-center text-xs text-gray-500 mt-2">
        {dates ? 'Time series comparison' : 'Data point comparison'}
      </p>
    </div>
  );
}

export default PredictionChart;