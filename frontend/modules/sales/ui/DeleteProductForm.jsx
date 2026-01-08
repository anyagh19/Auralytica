

function DeleteProductForm({ onSubmit, onCancel }) {
    const handleDelete = () => {
        onSubmit()
    }
    return (
        <div className="flex flex-col gap-5">
            <h2 className="text-lg font-semibold">
                Are you sure you want to delete this product from Sales?
            </h2>

            <div className="flex gap-4">
                <button
                    onClick={handleDelete}
                    className="p-4 bg-green-400 rounded"
                >
                    Yes
                </button>

                <button
                    onClick={onCancel}
                    className="p-4 bg-red-400 rounded"
                >
                    No
                </button>
            </div>
        </div>
    )
}

export default DeleteProductForm