import { NavLink } from "react-router-dom";

function Navbar() {
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
      <section className="flex gap-2">
        <NavLink to={"/Login"}>Login</NavLink>
        <NavLink to={"/Register"}>Register</NavLink>
      </section>
    </main>
  );
}

export default Navbar;
