import React, { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for reaching out! We'll get back to you soon.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-16 px-6 md:px-20 text-gray-800">
      {/* Page Title */}
      <h1 className="text-4xl font-bold text-center text-green-600 mb-8">
        Contact Us
      </h1>
      <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
        Have questions, feedback, or collaboration ideas? Get in touch with us —
        we’d love to hear from you.
      </p>

      {/* Contact Section */}
      <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
        {/* Contact Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 shadow-lg rounded-2xl"
        >
          <h2 className="text-2xl font-semibold mb-6 text-green-700">
            Send a Message
          </h2>

          <div className="space-y-5">
            <div>
              <label className="block font-medium mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block font-medium mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block font-medium mb-2">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="5"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition"
            >
              Submit
            </button>
          </div>
        </form>

        {/* Contact Info */}
        <div className="flex flex-col justify-center space-y-6 bg-green-50 p-8 rounded-2xl shadow-md">
          <h2 className="text-2xl font-semibold text-green-700 mb-4">
            Get in Touch
          </h2>
          <p className="text-gray-700">
            We're here to help you with your sales forecasting and data
            analytics needs. Reach us through the following channels:
          </p>
          <div className="space-y-3 text-gray-700">
            <p>📧 Email: <span className="font-medium">support@auralyst.ai</span></p>
            <p>📞 Phone: <span className="font-medium">+91 98765 43210</span></p>
            <p>📍 Location: <span className="font-medium">Pune, Maharashtra, India</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
