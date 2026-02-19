import ProductAdmin from "./ProductAdmin";
function Admin() {
  return (
    <main>
      <h1 className="text-3xl text-center">Admin Dash board</h1>
      <section className="flex justify-between border-2">
        <section className="border-2 flex-1">
          Aside(Links to other Admin functionality)
          <ul>
            <li>
              <button>Order history</button>
            </li>
            <li>
              <button>Set order status</button>
            </li>
          </ul>
        </section>
        <section className="border-2 flex-2">
          <ProductAdmin />
        </section>
      </section>
    </main>
  );
}

export default Admin;
