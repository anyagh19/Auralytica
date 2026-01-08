import React from "react";
import { useNavigate } from "react-router-dom";
import { selectTotalAmount } from "../../../redux/slices/salesSelector";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const navigate = useNavigate();
  const totalAmount = useSelector(selectTotalAmount)

  // Example data (you can replace with API data)
  const stats = [
    { label: "Total Sales", value: totalAmount, change: "+8%" },
    { label: "Predicted Sales", value: "$27,300", change: "+11%" },
    { label: "Active Users", value: "1,245", change: "+5%" },
    { label: "Regions Covered", value: "12", change: "+2%" },
  ];


  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-6 md:px-12">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">📊 Sales Dashboard</h1>
        <button
          onClick={() => navigate("/prediction")}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          Prediction
        </button>
        <button
          onClick={() => navigate("/sales")}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          Sales
        </button>
        <button
          onClick={() => navigate("/inventory")}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          Inventory
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md p-6 border border-gray-100"
          >
            <h2 className="text-gray-500 font-medium">{item.label}</h2>
            <p className="text-2xl font-bold text-gray-800 mt-2">{totalAmount}</p>
            <p
              className={`mt-1 text-sm ${
                item.change.startsWith("+") ? "text-green-600" : "text-red-600"
              }`}
            >
              {item.change} from last month
            </p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Monthly Sales Forecast
        </h2>

        {/* Placeholder chart (replace later with Recharts or Chart.js) */}
        <div className="w-full h-64 flex items-center justify-center bg-gray-100 rounded-lg text-gray-500">
          [Sales Forecast Chart Here]
        </div>
      </div>

      {/* Footer note */}
      <div className="text-center text-gray-500 mt-8">
        Powered by <span className="text-green-600 font-semibold">Auralyst AI</span> — Smart Sales Predictions
      </div>
    </div>
  );
};

export default Dashboard;
