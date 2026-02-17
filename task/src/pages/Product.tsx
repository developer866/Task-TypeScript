import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

// ✅ Form interface (strings for input binding)
interface ProductFormType {
  name: string;
  price: string;
  description: string;
  category: string;
  stock: string;
  available: boolean;
}

// ✅ Separate interface for fetched products (matches MongoDB response)
interface ProductType {
  _id: string;
  name: string;
  price: number;       // ✅ Number (matches schema)
  description: string;
  category: string;
  stock: number;       // ✅ Number (matches schema)
  available: boolean;
}

const INITIAL_FORM: ProductFormType = {
  name: "",
  price: "",
  description: "",
  category: "",
  stock: "",
  available: true,
};

function Product() {
  const [product, setProduct] = useState<ProductFormType>(INITIAL_FORM);
  const [allProducts, setAllProducts] = useState<ProductType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Reusable fetch function
  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/product");
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      setAllProducts(data.products);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    setProduct({
      ...product,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !product.name ||
      !product.price ||
      !product.description ||
      !product.category ||
      !product.stock
    ) {
      toast.error("All fields are required");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/product/addproduct",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...product,
            price: Number(product.price),
            stock: Number(product.stock),
          }),
        },
      );

      if (!response.ok) throw new Error("Failed to add product");

      toast.success("Product added successfully!");
      setProduct(INITIAL_FORM);         // ✅ Reset form
      await fetchProducts();            // ✅ Reuse fetch function

    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Delete handler
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/product/${id}`,
        { method: "DELETE" }
      );

      if (!response.ok) throw new Error("Failed to delete product");

      toast.success("Product deleted!");
      await fetchProducts();            // ✅ Refresh product list after deletion

    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };
  // Edit Handler (placeholder - implement as needed)
  const handleEdit = (id: string) => {
    toast.info(`Edit functionality for product ID: ${id} is not implemented yet.`);
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* ✅ Products Table */}
        {allProducts.length > 0 && (
          <div className="w-full">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Existing Products ({allProducts.length})
            </h2>
            <div className="bg-white rounded-lg shadow overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    {["Name", "Price", "Description", "Category", "Stock", "Available", "Actions"].map(
                      (header) => (
                        <th
                          key={header}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {header}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {allProducts.map((prod) => (
                    // ✅ Using _id as key instead of index
                    <tr key={prod._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {prod.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        ${prod.price}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">
                        {prod.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs capitalize">
                          {prod.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {prod.stock}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          prod.available
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}>
                          {prod.available ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm gap-4 flex">
                        <button
                          onClick={() => handleEdit(prod._id)}
                          className="text-red-600 hover:text-red-800 font-medium transition-colors"
                        >
                         Edit
                        </button>
                        <button
                          onClick={() => handleDelete(prod._id)}
                          className="text-red-600 hover:text-red-800 font-medium transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Add Product Form */}
        <div className="w-full max-w-lg mx-auto bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Add Product
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Fill in the details to add a new product
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Product Name */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">
                Product Name
              </label>
              <input
                type="text"
                name="name"
                value={product.name}
                onChange={handleChange}
                placeholder="e.g. Wireless Headphones"
                className="w-full px-4 py-2.5 text-sm text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 transition-all duration-200"
              />
            </div>

            {/* Product Price */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">
                Product Price
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">
                  $
                </span>
                <input
                  type="number"
                  name="price"
                  value={product.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  min="0"
                  className="w-full pl-7 pr-4 py-2.5 text-sm text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 transition-all duration-200"
                />
              </div>
            </div>

            {/* Product Description */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">
                Product Description
              </label>
              <input
                type="text"
                name="description"
                value={product.description}
                onChange={handleChange}
                placeholder="Brief description of the product"
                className="w-full px-4 py-2.5 text-sm text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 transition-all duration-200"
              />
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                name="category"
                value={product.category}
                onChange={handleChange}
                className="w-full px-4 py-2.5 text-sm text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">Select a category</option>
                <option value="electronics">Electronics</option>
                <option value="clothing">Clothing</option>
                <option value="food">Food</option>
                <option value="furniture">Furniture</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Stock */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">
                Stock Quantity
              </label>
              <input
                type="number"
                name="stock"
                value={product.stock}
                onChange={handleChange}
                placeholder="e.g. 100"
                min="0"
                className="w-full px-4 py-2.5 text-sm text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 transition-all duration-200"
              />
            </div>

            {/* Available Toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div>
                <p className="text-sm font-medium text-gray-700">Available</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Is this product available for purchase?
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="available"
                  checked={product.available}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:bg-blue-600 transition-all duration-200 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
              </label>
            </div>

            <div className="border-t border-gray-100 pt-2" />

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-3 bg-blue-600 text-white text-sm sm:text-base font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Adding..." : "Add Product"}
            </button>

          </form>
        </div>
      </div>
    </main>
  );
}

export default Product;