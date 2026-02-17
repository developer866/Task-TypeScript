import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

function Product() {
  const [product, setProduct] = useState("");
  const [formData, SetFormData] = useState({
    name: "",
    price: "",
    description: "",
  });
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/product");
        if (!response.ok) {
          throw new Error("failed to fatch products");
        }
        const data = await response.json();
        setProduct(data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast(error.message);
        }
      }
    };
    fetchProduct();
  }, []);
  return (
    <>
      <div>{product.message}</div>;
      <section>
        <h1>Add Product</h1>
        <form action="submit">
          <div>
            <label htmlFor="Productname">product name</label>
            <input type="text" />
          </div>
          <div>
            <label htmlFor="ProductPrice">product price</label>
            <input type="text" />
          </div>
          <div>
            <label htmlFor="ProductDescription">product decription</label>
            <input type="text" />
          </div>
        </form>
      </section>
    </>
  );
}

export default Product;
