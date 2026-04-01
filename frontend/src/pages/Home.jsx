import React from "react";
import { ArrowRight, BarChart3, TrendingUp, LayoutDashboard } from "lucide-react";

const Home = () => {
  const features = [
    {
      title: "Data Visualization",
      desc: "Interactive charts and graphs for clear insights into sales patterns.",
      icon: BarChart3,
    },
    {
      title: "Accurate Forecasting",
      desc: "Machine Learning algorithms like ARIMA, LSTM, and Regression ensure high accuracy.",
      icon: TrendingUp,
    },
    {
      title: "Dashboard Access",
      desc: "Track performance, compare trends, and monitor KPIs in one place.",
      icon: LayoutDashboard,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* HERO SECTION */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="md:w-1/2 space-y-6 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Sales Forecasting using Machine Learning
            </h1>
            <p className="text-lg text-gray-100">
              Predict future sales trends with accuracy using data-driven insights and AI-powered forecasting models.
            </p>
            <button className="inline-flex items-center gap-2 bg-white text-blue-700 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition shadow-md hover:shadow-lg">
              Get Started <ArrowRight size={18} />
            </button>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img
              src="https://cdn-icons-png.flaticon.com/512/9348/9348062.png"
              alt="Sales Forecasting"
              className="w-72 md:w-96"
            />
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Key Features
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-6 border border-gray-100"
              >
                <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT / OBJECTIVE SECTION */}
      <section className="py-20 px-6 md:px-12 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Project Objective
          </h2>
          <p className="text-gray-600 leading-relaxed text-lg">
            The main objective of this project is to build a predictive system that
            helps organizations estimate future sales using past data, market trends,
            and seasonal factors. By leveraging Machine Learning, businesses can
            make informed decisions, reduce inventory loss, and optimize profit margins.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;