import React, { useState } from "react";

function CreateProductForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    product_name: "",
    brand_name: "",
    category: "ELECTRONICS",
    quantity: "",
    price: "",
  });

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); // Pass data to parent
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* Product Name */}
      <div>
        <label className="block mb-1 font-medium">Product Name</label>
        <input
          type="text"
          name="product_name"
          value={formData.product_name}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      {/* Brand */}
      <div>
        <label className="block mb-1 font-medium">Brand Name</label>
        <input
          type="text"
          name="brand_name"
          value={formData.brand_name}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      {/* Category */}
      <div>
        <label className="block mb-1 font-medium">Category</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        >
          <option value="ELECTRONICS">Electronics</option>
          <option value="GROCERY">Grocery</option>
          <option value="CLOTHING">Clothing</option>
          <option value="OTHER">Other</option>
        </select>
      </div>

      {/* Quantity */}
      <div>
        <label className="block mb-1 font-medium">Quantity</label>
        <input
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      {/* Price */}
      <div>
        <label className="block mb-1 font-medium">Price</label>
        <input
          type="number"
          step="0.01"
          name="price"
          value={formData.price}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
      >
        Create Product
      </button>
    </form>
  );
}

export default CreateProductForm;
