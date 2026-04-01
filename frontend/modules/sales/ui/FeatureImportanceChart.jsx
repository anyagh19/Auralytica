import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

function FeatureImportanceChart({ data, title = "Feature Importances" }) {
  const chartData = Object.entries(data).map(([name, importance]) => ({
    name,
    importance: parseFloat(importance.toFixed(4))
  })).sort((a, b) => b.importance - a.importance);

  if (!chartData.length) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg text-gray-500">
        No feature importance data available
      </div>
    );
  }

  const getBarColor = (importance) => {
    if (importance >= 0.1) return '#10b981';
    if (importance >= 0.05) return '#3b82f6';
    return '#9ca3af';
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
      {title && <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis type="number" tick={{ fontSize: 12 }} />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 12 }}
            width={120}
          />
          <Tooltip
            formatter={(value) => value.toFixed(4)}
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
            }}
          />
          <Bar dataKey="importance" name="Importance">
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.importance)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default FeatureImportanceChart;