import React from "react";

const About = () => {
  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-16 px-6 md:px-20 text-gray-800">
      <h1 className="text-4xl font-bold text-center text-green-600 mb-8">
        About Auralyst
      </h1>

      <div className="max-w-4xl mx-auto text-center space-y-6">
        <p className="text-lg leading-relaxed">
          <strong>Auralyst</strong> is an intelligent <span className="text-green-600 font-semibold">Sales Forecasting System</span> that leverages 
          the power of <span className="font-semibold">Machine Learning</span> and <span className="font-semibold">Data Analytics</span> to predict future sales trends, 
          helping organizations make data-driven decisions.
        </p>

        <p className="text-gray-700">
          Our goal is to assist businesses in understanding customer demand, 
          reducing overstocking and understocking issues, and improving overall 
          profit margins through predictive insights.
        </p>

        <div className="bg-white shadow-md rounded-xl p-6 mt-10">
          <h2 className="text-2xl font-semibold mb-4 text-green-700">
            Key Objectives
          </h2>
          <ul className="text-left list-disc list-inside space-y-2 text-gray-700">
            <li>Analyze historical sales data to detect patterns and seasonality.</li>
            <li>Predict upcoming sales volumes using ML algorithms like ARIMA, LSTM, and Regression models.</li>
            <li>Provide a user-friendly dashboard for visualizing sales forecasts.</li>
            <li>Enable data uploads and automatic analysis of sales trends.</li>
          </ul>
        </div>

        <p className="mt-8 text-gray-600">
          Built using <span className="font-semibold">React, TailwindCSS, and Machine Learning APIs</span>, 
          Auralyst aims to make predictive analytics accessible to every business — from startups to enterprises.
        </p>
      </div>
    </div>
  );
};

export default About;
