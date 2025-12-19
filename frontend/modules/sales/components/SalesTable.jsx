import { useEffect, useState } from "react";
import Dialog from "../../common/ui/Dialog";
import api from "../../../src/api";
import { EllipsisVertical } from 'lucide-react';
import { AiTwotoneDelete } from "react-icons/ai"
import CreateSalesProductForm from "../ui/CreateSalesProductForm";


const SalesTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [openCreateSalesDialog, setOpenCreateSalesDialog] = useState(false)
  const [openDeleteSalesDialog, setOpenDeleteSalesDialog] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [products, setProducts] = useState([])

  // Example static data — replace with data from your Django API


  //Filter logic
  const filteredInventory = products.filter((item) =>
    item.product_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenCreateSalesProduct = () => {
    setOpenCreateSalesDialog(true)
  }
  const handleOpenDeleteSalesProduct = (id) => {
    setSelectedProductId(id);
    setOpenDeleteSalesDialog(true);
  };

  const handleAddSalesProduct = async (data) => {
    try {
      const res = await api.post('create-sales-product/', data)
      console.log('add', res.data)
      setOpenCreateSalesDialog(false)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('list-sales-product/')
        // console.log(res.data)
        const sortedData = res.data.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      )
        setProducts(sortedData)
      } catch (error) {
        console.log(error)
      }
    }
    fetchProducts()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-6 md:px-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div className="flex item-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">📦 Sales</h1>

        </div>
        <div className="flex space-x-3 mt-4 md:mt-0">
          <input
            type="text"
            placeholder="Search item..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition" onClick={() => handleOpenCreateSalesProduct()}>
            + Add Item
          </button>
        </div>
      </div>

      {openCreateSalesDialog && (
        <Dialog
          isOpen={openCreateSalesDialog}
          onClose={() => setOpenCreateSalesDialog(false)}
          title='Create Product'
        >
          <CreateSalesProductForm onSubmit={handleAddSalesProduct} />
        </Dialog>
      )}
      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-xl border border-gray-100">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">#</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Category</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Product</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Brand</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Quantity</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Price (₹)</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Amount</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Created At</th>

            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredInventory.length > 0 ? (
              filteredInventory.map((item) => (
                <tr key={item.created_at} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{item.id}</td>
                  <td className="px-6 py-4 font-medium text-gray-800">{item.category}</td>
                  <td className="px-6 py-4 font-medium text-gray-800">{item.product_name}</td>
                  <td className="px-6 py-4 font-medium text-gray-800">{item.brand_name}</td>
                  <td className="px-6 py-4">{item.quantity}</td>
                  <td className="px-6 py-4">₹{item.price.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    Rs. {item.price * item.quantity}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {new Date(item.created_at).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>

                  <td className="px-6 py-4">
                    <button onClick={() => handleOpenDeleteSalesProduct(item.id)}>
                      <AiTwotoneDelete />
                    </button>
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

      {openDeleteSalesDialog && (
        <Dialog
          isOpen={openDeleteDialog}
          onClose={() => setOpenDeleteSalesDialog(false)}
          title="Delete Product"
        >
          <DeleteProductForm
            onSubmit={handleDeleteProduct}
            onCancel={() => setOpenDeleteSalesDialog(false)}
          />
        </Dialog>
      )}


      {/* Footer Note */}
      <div className="text-center text-gray-500 mt-8">
        Real-time inventory powered by <span className="text-green-600 font-semibold">Auralyst AI</span>
      </div>
    </div>
  );
};

export default SalesTable;
