import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectTotalAmount } from "../../../redux/slices/salesSelector";
import { TrendingUp, Users, MapPin, DollarSign, BarChart3, Package, ClipboardList } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const totalAmount = useSelector(selectTotalAmount);

  const stats = [
    { label: "Total Sales", value: totalAmount, change: "+8%", icon: DollarSign, color: "green" },
    { label: "Predicted Sales", value: "$27,300", change: "+11%", icon: TrendingUp, color: "blue" },
    { label: "Active Users", value: "1,245", change: "+5%", icon: Users, color: "purple" },
    { label: "Regions Covered", value: "12", change: "+2%", icon: MapPin, color: "orange" },
  ];

  const formatCurrency = (value) => {
    if (typeof value === "number") return `₹${value.toLocaleString()}`;
    return value;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-24 px-4 sm:px-6 md:px-12 font-sans">
      {/* Header */}
      <div className="mb-10 flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
          📊 Sales Dashboard
        </h1>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => navigate("/prediction")}
            className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition shadow-sm hover:shadow-md"
          >
            <TrendingUp className="w-4 h-4" />
            Prediction
          </button>
          <button
            onClick={() => navigate("/sales-analysis")}
            className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition shadow-sm hover:shadow-md"
          >
            <BarChart3 className="w-4 h-4" />
            Sales Analysis
          </button>
          <button
            onClick={() => navigate("/sales")}
            className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition shadow-sm hover:shadow-md"
          >
            <ClipboardList className="w-4 h-4" />
            Sales
          </button>
          <button
            onClick={() => navigate("/inventory")}
            className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition shadow-sm hover:shadow-md"
          >
            <Package className="w-4 h-4" />
            Inventory
          </button>
        </div>
      </div>

      {/* Stats Grid – fully responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-gray-500 font-medium text-sm sm:text-base">{item.label}</h2>
              <item.icon className={`w-5 h-5 text-${item.color}-500`} />
            </div>
            <p className="text-2xl font-bold text-gray-800 mt-2">
              {formatCurrency(item.value)}
            </p>
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

      {/* Chart Section – responsive width and height */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-green-600" />
          Monthly Sales Forecast
        </h2>
        <div className="w-full h-64 sm:h-80 md:h-96 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg text-gray-500 border border-gray-200">
          <div className="text-center px-4">
            <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p>Sales forecast chart will appear here</p>
            <p className="text-xs text-gray-400 mt-1">Powered by Auralyst AI</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-gray-500 mt-8 text-sm">
        Powered by{" "}
        <span className="text-green-600 font-semibold">Auralyst AI</span> — Smart Sales Predictions
      </div>
    </div>
  );
};

export default Dashboard;