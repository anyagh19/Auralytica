import React from "react";

const Services = () => {
  const services = [
    {
      title: "Sales Prediction",
      desc: "Generate accurate sales forecasts using AI models trained on past data and seasonal trends.",
      icon: "📈",
    },
    {
      title: "Data Visualization",
      desc: "Interactive charts and graphs help businesses visualize their sales trends in real-time.",
      icon: "📊",
    },
    {
      title: "Model Comparison",
      desc: "Compare model accuracy (ARIMA, LSTM, Regression) and choose the best-performing predictor.",
      icon: "🤖",
    },
    {
      title: "Dashboard Analytics",
      desc: "A central hub where users can monitor key performance indicators and prediction summaries.",
      icon: "🧭",
    },
    {
      title: "CSV Upload & Processing",
      desc: "Upload your own sales dataset (CSV) and get instant analysis and future sales predictions.",
      icon: "📂",
    },
    {
      title: "Custom Report Generation",
      desc: "Export sales forecasting reports for business review and decision-making.",
      icon: "📝",
    },
  ];

  return (
    <div className="bg-white min-h-screen pt-24 pb-16 px-6 md:px-20 text-gray-800">
      <h1 className="text-4xl font-bold text-center text-green-600 mb-12">
        Our Services
      </h1>

      <div className="grid md:grid-cols-3 gap-10">
        {services.map((service, index) => (
          <div
            key={index}
            className="bg-gray-50 shadow-md rounded-2xl p-8 hover:shadow-xl transition transform hover:-translate-y-1"
          >
            <div className="text-5xl mb-4">{service.icon}</div>
            <h2 className="text-2xl font-semibold mb-2 text-green-700">
              {service.title}
            </h2>
            <p className="text-gray-600">{service.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
