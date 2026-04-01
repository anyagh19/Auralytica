import { useEffect, useState, useMemo } from "react";
import Dialog from "../../common/ui/Dialog";
import api from "../../../src/api";
import { AiTwotoneDelete } from "react-icons/ai";
import { Pencil, Search, ChevronLeft, ChevronRight } from "lucide-react";
import CreateSalesProductForm from "../ui/CreateSalesProductForm";
import DeleteProductForm from "../ui/DeleteProductForm";
import UpdateSalesForm from "../ui/UpdateSalesForm";
import { useDispatch, useSelector } from "react-redux";
import { setSales, addItem, deleteItem } from "../../../redux/slices/totalSalesSlice";
import { selectTotalAmount } from "../../../redux/slices/salesSelector";

const SalesTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [openCreateSalesDialog, setOpenCreateSalesDialog] = useState(false);
  const [openDeleteSalesDialog, setOpenDeleteSalesDialog] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedProductForUpdate, setSelectedProductForUpdate] = useState(null);
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const dispatch = useDispatch();
  const totalAmount = useSelector(selectTotalAmount);

  // Filter logic – search by product name, brand name, or formatted date
  const filteredInventory = useMemo(() => {
    if (!searchTerm.trim()) return products;

    const lowerSearch = searchTerm.toLowerCase();
    return products.filter((item) => {
      if (
        item.product_name.toLowerCase().includes(lowerSearch) ||
        item.brand_name.toLowerCase().includes(lowerSearch)
      ) {
        return true;
      }
      const formattedDate = new Date(item.created_at).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
      return formattedDate.toLowerCase().includes(lowerSearch);
    });
  }, [products, searchTerm]);

  // Pagination
  const totalPages = Math.ceil(filteredInventory.length / itemsPerPage);
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredInventory.slice(start, end);
  }, [filteredInventory, currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(Math.max(1, Math.min(newPage, totalPages)));
  };

  // Create handlers
  const handleOpenCreateSalesProduct = () => setOpenCreateSalesDialog(true);

  const handleAddSalesProduct = async (data) => {
    try {
      const res = await api.post("create-sales-product/", data);
      setOpenCreateSalesDialog(false);
      dispatch(addItem(res.data));
      const refreshRes = await api.get("list-sales-product/");
      const sortedData = refreshRes.data.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      setProducts(sortedData);
      dispatch(setSales(sortedData));
    } catch (error) {
      console.error("Add failed", error);
    }
  };

  // Delete handlers
  const handleOpenDeleteSalesProduct = (id) => {
    setSelectedProductId(id);
    setOpenDeleteSalesDialog(true);
  };

  const handleDeleteProduct = async () => {
    try {
      await api.delete(`delete-sales-product/${selectedProductId}`);
      setProducts((prev) => prev.filter((item) => item.id !== selectedProductId));
      setOpenDeleteSalesDialog(false);
      setSelectedProductId(null);
      dispatch(deleteItem(selectedProductId));
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  // Update handlers
  const handleOpenUpdateProduct = (product) => {
    setSelectedProductForUpdate(product);
    setOpenUpdateDialog(true);
  };

  const handleUpdateProduct = async (data) => {
    try {
      const res = await api.patch(`update-sales-product/${selectedProductForUpdate.id}/`, data);
      setProducts((prev) =>
        prev.map((p) => (p.id === selectedProductForUpdate.id ? res.data : p))
      );
      setOpenUpdateDialog(false);
      setSelectedProductForUpdate(null);
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  // Fetch products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("list-sales-product/");
        const sortedData = res.data.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setProducts(sortedData);
        dispatch(setSales(sortedData));
      } catch (error) {
        console.error("Fetch failed", error);
      }
    };
    fetchProducts();
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-24 px-4 sm:px-6 md:px-12 font-sans">
      {/* Header Section – responsive flex wrap */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            📦 Sales
          </h1>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by product, brand, or date (e.g., 15 Mar 2025)..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition w-full sm:w-80"
            />
          </div>
          <button
            onClick={handleOpenCreateSalesProduct}
            className="inline-flex items-center justify-center gap-2 bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition shadow-sm hover:shadow-md"
          >
            + Add Item
          </button>
        </div>
      </div>

      {/* Dialogs remain the same */}
      {openCreateSalesDialog && (
        <Dialog
          isOpen={openCreateSalesDialog}
          onClose={() => setOpenCreateSalesDialog(false)}
          title="Create Sales Entry"
        >
          <CreateSalesProductForm onSubmit={handleAddSalesProduct} />
        </Dialog>
      )}
      {openUpdateDialog && selectedProductForUpdate && (
        <Dialog
          isOpen={openUpdateDialog}
          onClose={() => setOpenUpdateDialog(false)}
          title="Update Sales Entry"
        >
          <UpdateSalesForm
            initialData={selectedProductForUpdate}
            onSubmit={handleUpdateProduct}
          />
        </Dialog>
      )}
      {openDeleteSalesDialog && (
        <Dialog
          isOpen={openDeleteSalesDialog}
          onClose={() => setOpenDeleteSalesDialog(false)}
          title="Delete Sales Entry"
        >
          <DeleteProductForm
            onSubmit={handleDeleteProduct}
            onCancel={() => setOpenDeleteSalesDialog(false)}
          />
        </Dialog>
      )}

      {/* Table container – already overflow-x-auto, but we keep it */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50/80 backdrop-blur-sm">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  #
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Brand
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Price (₹)
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Created At
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedItems.length > 0 ? (
                paginatedItems.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50/80 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      {item.product_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {item.brand_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
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
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      ₹{item.price.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {new Date(item.created_at).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => handleOpenUpdateProduct(item)}
                        className="p-1 rounded-md hover:bg-green-50 transition mr-2"
                        title="Edit sales entry"
                      >
                        <Pencil className="w-4 h-4 text-gray-500 hover:text-green-600" />
                      </button>
                      <button
                        onClick={() => handleOpenDeleteSalesProduct(item.id)}
                        className="p-1 rounded-md hover:bg-red-50 transition"
                        title="Delete sales entry"
                      >
                        <AiTwotoneDelete className="w-4 h-4 text-gray-500 hover:text-red-600" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="px-6 py-12 text-center text-gray-400">
                    No sales entries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls – responsive buttons */}
      {totalPages > 1 && (
        <div className="flex flex-wrap justify-center items-center gap-3 mt-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`inline-flex items-center gap-1 px-3 py-2 rounded-lg border transition ${
              currentPage === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`inline-flex items-center gap-1 px-3 py-2 rounded-lg border transition ${
              currentPage === totalPages
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Total Amount Card – full width on mobile, right aligned on larger screens */}
      <div className="mt-8 flex justify-end">
        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-100 w-full sm:w-auto">
          <p className="text-sm text-gray-600">Total Sales Amount</p>
          <p className="text-2xl font-bold text-green-600">₹{totalAmount.toLocaleString()}</p>
        </div>
      </div>

      {/* Footer Note */}
      <div className="text-center text-gray-500 mt-8 text-sm">
        Real‑time sales powered by{" "}
        <span className="text-green-600 font-semibold">Auralyst AI</span>
      </div>
    </div>
  );
};

export default SalesTable;