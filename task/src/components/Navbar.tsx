import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../app/store";
import { logout } from "../features/auth/authSlice";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state: RootState) => state.auth.token);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/Login")
  };
  return (
    <main className="flex justify-between w-[90%] mx-auto">
      <section>
        <h1>Logo</h1>
      </section>
      <section>
        <ul className="flex justify-between gap-5">
          <NavLink to={"/"}>Home</NavLink>
          <NavLink to={"/taskpage"}> Project</NavLink>
          <NavLink to={"/taskpage"}> Section </NavLink>
          <NavLink to={"/taskpage"}> Taskpage</NavLink>
        </ul>
      </section>
      {/* button */}
      <section>
        {token ? (
          <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <section className="flex gap-2">
            <NavLink to={"/Login"}>Login</NavLink>
            <NavLink to={"/Register"}>Register</NavLink>
          </section>
        )}
      </section>
    </main>
  );
}

export default Navbar;
