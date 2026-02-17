import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

function Product() {
  const [product, setProduct] = useState({
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
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
    console.log(FormData)
  };
const handleSubmit = (e: React.FormEvent<HTMLFormElement> )=>{
  e.preventDefault();

}
  return (
    <>
      <div>{product.message}</div>;
      <section>
        <h1>Add Product</h1>
        <form action="submit" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="Productname">product name</label>
            <input type="text" name="name" onChange={handleChange} className="w-full max-w-md mx-auto p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6" />
          </div>
          <div>
            <label htmlFor="ProductPrice">product price</label>
            <input type="text" name="price" onChange={handleChange} className="w-full max-w-md mx-auto p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6"/>
          </div>
          <div>
            <label htmlFor="ProductDescription">product decription</label>
            <input type="text" name="description" onChange={handleChange} className="w-full max-w-md mx-auto p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6" />
          </div>
          <button type="submit">Add product</button>
        </form>
      </section>
    </>
  );
}

export default Product;
