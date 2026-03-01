import ProductAdmin from "./ProductAdmin";
import { useNavigate } from "react-router-dom";

function Admin() {
  const navigate = useNavigate()
  return (
    <main className="min-h-screen bg-gray-100 p-6">
      
      {/* Header */}
      <h1 className="text-3xl font-bold text-center mb-8">
        Admin Dashboard
      </h1>

      {/* Layout */}
      <section className="flex flex-col md:flex-row gap-6">
        
        {/* Sidebar */}
        <aside className="md:w-1/4 bg-white shadow-lg rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Admin Panel</h2>

          <ul className="space-y-4">
            <li>
              <button onClick={()=>navigate('/admin/orders')} className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-200 transition">
                Order History
              </button>
            </li>

            <li>
              <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-200 transition">
                Add Product
              </button>
            </li>
          </ul>
        </aside>

        {/* Main Content */}
        <section className="md:w-3/4 bg-white shadow-lg rounded-xl p-6">
          <ProductAdmin />
        </section>

      </section>
    </main>
  );
}

export default Admin;