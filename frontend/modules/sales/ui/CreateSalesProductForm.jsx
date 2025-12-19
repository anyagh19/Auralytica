import React, { useEffect, useState } from 'react'
import api from '../../../src/api'

function CreateSalesProductForm({ onSubmit }) {
    const [products, setProducts] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [quantity, setQuantity] = useState("")
    const [selectedProduct, setSelectedProduct] = useState(null)


    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await api.get('list-inventory-product/')
                setProducts(res.data)
            } catch (error) {
                console.error("Failed to fetch products", error)
            }
        }
        fetchProducts()
    }, [])

    const filteredInventory = products.filter(item =>
        item.product_name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!selectedProduct) {
            alert("Please select a product")
            return
        }

        onSubmit({
            product_id: selectedProduct.id,
            quantity,
            price: selectedProduct.price,
            product_name: selectedProduct.product_name,
            brand_name: selectedProduct.brand_name,
            category: selectedProduct.category
        })
    }


    return (
        <form onSubmit={handleSubmit}>

            {/* Search */}
            <div className="flex space-x-3 mt-4">
                <input
                    type="text"
                    placeholder="Search item..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500"
                />
            </div>

            {/* Table */}
            <div className="overflow-x-auto bg-white shadow-md rounded-xl border border-gray-100 mt-4">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left">#</th>
                            <th className="px-6 py-3 text-left">Category</th>
                            <th className="px-6 py-3 text-left">Product</th>
                            <th className="px-6 py-3 text-left">Brand</th>
                            <th className="px-6 py-3 text-left">Price (₹)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {filteredInventory.length ? (
                            filteredInventory.map(item => (
                                <tr
                                    key={item.id}
                                    onClick={() => setSelectedProduct(item)}
                                    className={`cursor-pointer hover:bg-gray-50
          ${selectedProduct?.id === item.id ? "bg-green-100" : ""}`}
                                >
                                    <td className="px-6 py-4">{item.id}</td>
                                    <td className="px-6 py-4">{item.category}</td>
                                    <td className="px-6 py-4 font-medium">{item.product_name}</td>
                                    <td className="px-6 py-4">{item.brand_name}</td>
                                    <td className="px-6 py-4">₹{item.price}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center py-6 text-gray-500">
                                    No items found
                                </td>
                            </tr>
                        )}
                    </tbody>

                </table>
            </div>

            {/* Quantity */}
            <div className="flex space-x-3 mt-4">
                <input
                    type="number"
                    placeholder="Quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500"
                />
            </div>
            <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
                Add Product
            </button>
        </form>
    )
}

export default CreateSalesProductForm
