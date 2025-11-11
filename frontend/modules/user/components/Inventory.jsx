import React, { useState } from "react";

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Example static data — replace with data from your Django API
  const inventoryData = [
    { id: 1, name: "Laptop", quantity: 45, price: 55000, status: "In Stock" },
    { id: 2, name: "Keyboard", quantity: 10, price: 1200, status: "Low Stock" },
    { id: 3, name: "Monitor", quantity: 0, price: 8000, status: "Out of Stock" },
    { id: 4, name: "Mouse", quantity: 125, price: 600, status: "In Stock" },
    { id: 5, name: "Printer", quantity: 5, price: 15000, status: "Low Stock" },
  ];

  // Filter logic
  const filteredInventory = inventoryData.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Status color helper
  const getStatusColor = (status) => {
    switch (status) {
      case "In Stock":
        return "text-green-600 bg-green-50";
      case "Low Stock":
        return "text-yellow-600 bg-yellow-50";
      case "Out of Stock":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-6 md:px-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">📦 Inventory</h1>
        <div className="flex space-x-3 mt-4 md:mt-0">
          <input
            type="text"
            placeholder="Search item..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
            + Add Item
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-xl border border-gray-100">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">#</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Product</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Quantity</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Price (₹)</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredInventory.length > 0 ? (
              filteredInventory.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{item.id}</td>
                  <td className="px-6 py-4 font-medium text-gray-800">{item.name}</td>
                  <td className="px-6 py-4">{item.quantity}</td>
                  <td className="px-6 py-4">₹{item.price.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="text-center text-gray-500 py-6 font-medium"
                >
                  No items found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Note */}
      <div className="text-center text-gray-500 mt-8">
        Real-time inventory powered by <span className="text-green-600 font-semibold">Auralyst AI</span>
      </div>
    </div>
  );
};

export default Inventory;
