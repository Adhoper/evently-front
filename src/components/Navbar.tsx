import {
  Link,
  NavLink,
} from "react-router-dom";

function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-18 max-w-7xl items-center gap-10 px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="text-xl font-black tracking-tight text-zinc-950"
        >
          EVENTLY
        </Link>

        <nav className="hidden flex-1 items-center gap-7 md:flex">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "text-sm font-semibold text-zinc-950"
                : "text-sm font-medium text-zinc-500 transition hover:text-zinc-950"
            }
          >
            Inicio
          </NavLink>

          <NavLink
            to="/events"
            className={({ isActive }) =>
              isActive
                ? "text-sm font-semibold text-zinc-950"
                : "text-sm font-medium text-zinc-500 transition hover:text-zinc-950"
            }
          >
            Eventos
          </NavLink>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button className="hidden rounded-xl border border-zinc-200 px-4 py-2.5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 sm:block">
            Iniciar sesión
          </button>

          <button className="rounded-xl bg-zinc-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800">
            Registrarse
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;