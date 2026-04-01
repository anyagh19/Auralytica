import React, { useEffect, useState } from 'react';
import api from '../../../src/api';
import { Search, Package } from 'lucide-react';

function CreateSalesProductForm({ onSubmit }) {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [quantity, setQuantity] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('list-inventory-product/');
        // Filter only products with quantity > 0
        const availableProducts = res.data.filter(item => item.quantity > 0);
        setProducts(availableProducts);
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    };
    fetchProducts();
  }, []);

  // Filter by product name
  const filteredInventory = products.filter(item =>
    item.product_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProduct) {
      alert("Please select a product");
      return;
    }
    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty <= 0) {
      alert("Please enter a valid quantity greater than 0");
      return;
    }
    if (qty > selectedProduct.quantity) {
      alert(`Only ${selectedProduct.quantity} units available in inventory.`);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        product_id: selectedProduct.id,
        quantity: qty,
        price: selectedProduct.price,
        product_name: selectedProduct.product_name,
        brand_name: selectedProduct.brand_name,
        category: selectedProduct.category,
      });
      // Clear form after successful submission (optional)
      setSelectedProduct(null);
      setQuantity("");
    } catch (error) {
      console.error("Submission failed", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
        />
      </div>

      {/* Products Table */}
      <div className="overflow-x-auto bg-white rounded-xl border border-gray-100 max-h-80 overflow-y-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Brand
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Price (₹)
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                In Stock
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredInventory.length > 0 ? (
              filteredInventory.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => setSelectedProduct(item)}
                  className={`cursor-pointer transition-colors duration-150 ${
                    selectedProduct?.id === item.id
                      ? "bg-green-50 border-l-4 border-green-500"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <td className="px-6 py-3 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap font-medium text-gray-900">
                    {item.product_name}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-gray-600">
                    {item.brand_name}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-gray-600">
                    ₹{item.price.toLocaleString()}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.quantity <= 5
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {item.quantity}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                  No available products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Selected Product Indicator (optional) */}
      {selectedProduct && (
        <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
          <Package className="w-5 h-5 text-green-600" />
          <span className="text-sm text-gray-700">
            Selected: <strong>{selectedProduct.product_name}</strong> (Max available: {selectedProduct.quantity})
          </span>
        </div>
      )}

      {/* Quantity Input */}
      <div>
        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
          Quantity to Sell
        </label>
        <input
          id="quantity"
          type="number"
          placeholder="Enter quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          min="1"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
          disabled={!selectedProduct}
        />
        {selectedProduct && (
          <p className="text-xs text-gray-500 mt-1">
            Available: {selectedProduct.quantity} units
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting || !selectedProduct}
        className={`w-full py-2 rounded-lg font-medium transition ${
          isSubmitting || !selectedProduct
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-green-600 text-white hover:bg-green-700"
        }`}
      >
        {isSubmitting ? "Adding..." : "Add to Sales"}
      </button>
    </form>
  );
}

export default CreateSalesProductForm;