import { Link, NavLink } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-18 max-w-7xl items-center gap-10 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-xl font-black tracking-tight">
          EVENTLY
        </Link>

        <nav className="hidden flex-1 items-center gap-7 md:flex">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "text-sm font-semibold text-zinc-950"
                : "text-sm font-medium text-zinc-500 hover:text-zinc-950"
            }
          >
            Inicio
          </NavLink>

          <NavLink
            to="/events"
            className={({ isActive }) =>
              isActive
                ? "text-sm font-semibold text-zinc-950"
                : "text-sm font-medium text-zinc-500 hover:text-zinc-950"
            }
          >
            Eventos
          </NavLink>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {!user ? (
            <>
              <Link
                to="/login"
                className="hidden rounded-xl border border-zinc-200 px-4 py-2.5 text-sm font-semibold hover:bg-zinc-50 sm:inline-flex"
              >
                Iniciar sesión
              </Link>

              <Link
                to="/register"
                className="rounded-xl bg-zinc-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800"
              >
                Registrarse
              </Link>
            </>
          ) : (
            <>
              {user.role === "Organizer" && (
                <Link
                  to="/organizer"
                  className="hidden rounded-xl bg-brand-50 px-4 py-2.5 text-sm font-bold text-brand-700 transition hover:bg-brand-100 sm:inline-flex"
                >
                  Panel
                </Link>
              )}

              <Link
                to="/account"
                className="rounded-xl px-4 py-2.5 text-sm font-semibold hover:bg-zinc-100"
              >
                {user.firstName}
              </Link>

              <button
                onClick={logout}
                className="rounded-xl border border-zinc-200 px-4 py-2.5 text-sm font-semibold hover:bg-zinc-50"
              >
                Salir
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
