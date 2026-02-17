import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface ProductType {
  name: string;
  price: string;
  description: string;
}

function Product() {
  const [allProducts, setAllProducts] = useState<ProductType[]>([]);
  const [product, setProduct] = useState<ProductType>({
    name: "",
    price: "",
    description: "",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/product");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setAllProducts(data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(error.message);
        }
      }
    };
    fetchProduct();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(product);
  };

  return (
    <section className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-6 sm:p-8">
        {/* Header */}
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
                type="text"
                name="price"
                value={product.price}
                onChange={handleChange}
                placeholder="0.00"
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

          {/* Divider */}
          <div className="border-t border-gray-100 pt-2" />

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full px-6 py-3 bg-blue-600 text-white text-sm sm:text-base font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Add Product
          </button>
        </form>
      </div>
    </section>
  );
}

export default Product;
