// import { toast } from "react-toastify";

import { useEffect, useState } from "react";
interface ProductType {
  _id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  stock: number;
  available: boolean;
}

function ProductClients() {
  const [produt, setProducts] = useState<ProductType[]>([]);
  const fetchProduct = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/product");
      if (!response.ok) {
        throw new Error("Failed to fextch Products");
      }
      const data = await response.json();
      setProducts(data.product);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error.message);
      }
    }
  };
  useEffect(() => {
    fetchProduct();
  });
  return (
    <section>
      <div className="text-3xl text-center">ProductClients</div>
      <p className="text-3xl text-center">
        display client shopping page under construction
      </p>
      {produt.filter().map((key )=> {
        <div></div>
      })}
    </section>
  );
}

export default ProductClients;
