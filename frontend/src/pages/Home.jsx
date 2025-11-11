import React from "react";
import { ArrowRight } from "lucide-react";

const Home = () => {
  return (
    <div className="w-full min-h-screen bg-gray-50 text-gray-800">

      {/* HERO SECTION */}
      <section className="flex flex-col md:flex-row items-center justify-between px-8 md:px-20 py-20 bg-gradient-to-red from-blue-600 to-indigo-700 text-white">
        <div className="md:w-1/2 space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Sales Forecasting using Machine Learning
          </h1>
          <p className="text-lg text-gray-100">
            Predict future sales trends with accuracy using data-driven insights and AI-powered forecasting models.
          </p>
          <button className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-gray-100 transition">
            Get Started <ArrowRight size={18} />
          </button>
        </div>
        <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/9348/9348062.png"
            alt="Sales Forecasting"
            className="w-80 md:w-96"
          />
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-20 px-8 md:px-20 bg-white">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          Key Features
        </h2>
        <div className="grid md:grid-cols-3 gap-10">
          {[
            {
              title: "Data Visualization",
              desc: "Interactive charts and graphs for clear insights into sales patterns."
            },
            {
              title: "Accurate Forecasting",
              desc: "Machine Learning algorithms like ARIMA, LSTM, and Regression ensure high accuracy."
            },
            {
              title: "Dashboard Access",
              desc: "Track performance, compare trends, and monitor KPIs in one place."
            },
          ].map((f, i) => (
            <div key={i} className="bg-gray-100 p-8 rounded-2xl shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-3 text-blue-700">{f.title}</h3>
              <p className="text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT / OBJECTIVE SECTION */}
      <section className="py-20 px-8 md:px-20 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">
          Project Objective
        </h2>
        <div className="max-w-4xl mx-auto text-center text-gray-700 leading-relaxed">
          The main objective of this project is to build a predictive system that 
          helps organizations estimate future sales using past data, market trends, 
          and seasonal factors. By leveraging Machine Learning, businesses can 
          make informed decisions, reduce inventory loss, and optimize profit margins.
        </div>
      </section>

    </div>
  );
};

export default Home;
