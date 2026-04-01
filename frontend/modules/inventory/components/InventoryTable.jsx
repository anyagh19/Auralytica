import { useEffect, useState } from "react";
import Dialog from "../../common/ui/Dialog";
import CreateProductForm from "../ui/CreateProductForm";
import DeleteProductForm from "../ui/DeleteProductForm";
import api from "../../../src/api";
import { EllipsisVertical, Pencil, Search, Plus } from 'lucide-react';

const InventoryTable = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [products, setProducts] = useState([]);
    const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
    const [selectedProductForUpdate, setSelectedProductForUpdate] = useState(null);

    // Filter logic
    const filteredInventory = products.filter((item) =>
        item.product_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOpenCreateProduct = () => setOpenCreateDialog(true);
    const handleOpenDeleteProduct = (id) => {
        setSelectedProductId(id);
        setOpenDeleteDialog(true);
    };
    const handleOpenUpdateProduct = (product) => {
        setSelectedProductForUpdate(product);
        setOpenUpdateDialog(true);
    };

    const handleCreateProduct = async (data) => {
        try {
            const res = await api.post("/create-inventory-product/", data);
            setProducts((prev) => [...prev, res.data]);
            setOpenCreateDialog(false);
        } catch (err) {
            console.error("Create failed", err);
        }
    };

    const handleDeleteProduct = async () => {
        try {
            await api.delete(`delete-inventory-product/${selectedProductId}/`);
            setProducts((prev) => prev.filter((item) => item.id !== selectedProductId));
            setOpenDeleteDialog(false);
            setSelectedProductId(null);
        } catch (error) {
            console.error("Delete failed", error);
        }
    };

    const handleUpdateProduct = async (data) => {
        console.log("Updating product with data:", data);
        try {
            const res = await api.patch(`inventory/${selectedProductForUpdate.id}/update/`, data);
            console.log("Update response:", res.data);
            setProducts((prev) =>
                prev.map((p) => (p.id === selectedProductForUpdate.id ? res.data : p))
            );
            setOpenUpdateDialog(false);
            setSelectedProductForUpdate(null);
        } catch (err) {
            console.error("Update failed", err);
            if (err.response) {
                // The request was made and the server responded with a status code
                console.error("Response status:", err.response.status);
                console.error("Response data:", err.response.data);
            } else if (err.request) {
                // The request was made but no response was received
                console.error("No response received:", err.request);
            } else {
                // Something happened in setting up the request
                console.error("Error message:", err.message);
            }
        }
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await api.get("list-inventory-product/");
                setProducts(res.data);
            } catch (error) {
                console.error("Fetch failed", error);
            }
        };
        fetchProducts();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-24 px-4 sm:px-6 md:px-12 font-sans">
            {/* Header Section – fully responsive */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
                <div className="flex items-center gap-2">
                    <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        📦 Inventory
                    </h1>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <div className="relative w-full sm:w-auto">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search product..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition w-full sm:w-64"
                        />
                    </div>
                    <button
                        onClick={handleOpenCreateProduct}
                        className="inline-flex items-center justify-center gap-2 bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition shadow-sm hover:shadow-md"
                    >
                        <Plus className="w-4 h-4" />
                        Add Item
                    </button>
                </div>
            </div>

            {/* Dialogs (unchanged) */}
            {openCreateDialog && (
                <Dialog
                    isOpen={openCreateDialog}
                    onClose={() => setOpenCreateDialog(false)}
                    title="Create Product"
                >
                    <CreateProductForm onSubmit={handleCreateProduct} />
                </Dialog>
            )}
            {openUpdateDialog && selectedProductForUpdate && (
                <Dialog
                    isOpen={openUpdateDialog}
                    onClose={() => setOpenUpdateDialog(false)}
                    title="Update Product"
                >
                    <CreateProductForm
                        onSubmit={handleUpdateProduct}
                        initialData={selectedProductForUpdate}
                        isUpdate={true}
                    />
                </Dialog>
            )}
            {openDeleteDialog && (
                <Dialog
                    isOpen={openDeleteDialog}
                    onClose={() => setOpenDeleteDialog(false)}
                    title="Delete Product"
                >
                    <DeleteProductForm
                        onSubmit={handleDeleteProduct}
                        onCancel={() => setOpenDeleteDialog(false)}
                    />
                </Dialog>
            )}

            {/* Table – scrollable horizontally */}
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
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredInventory.length > 0 ? (
                                filteredInventory.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="hover:bg-gray-50/80 transition-colors duration-150"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                            {item.id}
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
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.quantity <= 5
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
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <button
                                                onClick={() => handleOpenUpdateProduct(item)}
                                                className="p-1 rounded-md hover:bg-green-50 transition mr-2"
                                                title="Edit product"
                                            >
                                                <Pencil className="w-4 h-4 text-gray-500 hover:text-green-600" />
                                            </button>
                                            <button
                                                onClick={() => handleOpenDeleteProduct(item.id)}
                                                className="p-1 rounded-md hover:bg-red-50 transition"
                                                title="Delete product"
                                            >
                                                <EllipsisVertical className="w-4 h-4 text-gray-500 hover:text-red-600" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="px-6 py-12 text-center text-gray-400">
                                        No products found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Footer Note */}
            <div className="text-center text-gray-500 mt-8 text-sm">
                Real‑time inventory powered by{" "}
                <span className="text-green-600 font-semibold">Auralyst AI</span>
            </div>
        </div>
    );
};

export default InventoryTable;