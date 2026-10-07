import {
  useState,
} from "react";

import {
  AnimatePresence,
  motion,
} from "motion/react";

import {
  CalendarDays,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  Sparkles,
  User,
  UserPlus,
  X,
} from "lucide-react";

import {
  Link,
  NavLink,
  useNavigate,
} from "react-router-dom";

import {
  useAuth,
} from "../hooks/useAuth";

import ThemeToggle from "./ui/ThemeToggle";

function Navbar() {
  const {
    user,
    logout,
    loading,
  } = useAuth();

  const navigate =
    useNavigate();

  const [
    mobileOpen,
    setMobileOpen,
  ] = useState(false);

  const closeMobile = () => {
    setMobileOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMobile();
    navigate("/");
  };

  const navLinkClasses = ({
    isActive,
  }: {
    isActive: boolean;
  }) =>
    `relative text-sm font-bold transition ${
      isActive
        ? "text-brand-600 dark:text-brand-400"
        : "text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
    }`;

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/90">
        <div className="mx-auto flex h-18 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          {/* BRAND */}

          <Link
            to="/"
            className="group flex items-center gap-2.5"
          >
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 text-white shadow-lg shadow-brand-600/20 transition group-hover:-rotate-3 group-hover:scale-105">
              <Sparkles
                size={17}
              />
            </div>

            <div className="leading-none">
              <p className="text-lg font-black tracking-tight text-slate-950 dark:text-white">
                EVENTLY
              </p>

              <div className="mt-1 h-1 w-7 rounded-full bg-accent-400" />
            </div>
          </Link>

          {/* DESKTOP NAV */}

          <nav className="ml-12 hidden items-center gap-8 md:flex">
            <NavLink
              to="/"
              end
              className={navLinkClasses}
            >
              Inicio
            </NavLink>

            <NavLink
              to="/events"
              className={navLinkClasses}
            >
              Eventos
            </NavLink>
          </nav>

          {/* DESKTOP ACTIONS */}

          <div className="ml-auto hidden items-center gap-2 sm:flex">
            <ThemeToggle />

            {!loading &&
              !user && (
                <>
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                  >
                    <LogIn
                      size={16}
                    />

                    Iniciar sesión
                  </Link>

                  <Link
                    to="/register"
                    className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-black text-white shadow-md shadow-brand-600/20 transition hover:-translate-y-0.5 hover:bg-brand-700"
                  >
                    <UserPlus
                      size={16}
                    />

                    Crear cuenta
                  </Link>
                </>
              )}

            {!loading &&
              user && (
                <>
                  {user.role ===
                    "Organizer" && (
                    <Link
                      to="/organizer"
                      className="inline-flex items-center gap-2 rounded-xl bg-brand-50 px-4 py-2.5 text-sm font-black text-brand-700 transition hover:bg-brand-100 dark:bg-brand-900/25 dark:text-brand-300 dark:hover:bg-brand-900/40"
                    >
                      <LayoutDashboard
                        size={16}
                      />

                      Panel
                    </Link>
                  )}

                  <Link
                    to="/account"
                    className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    <div className="grid h-7 w-7 place-items-center rounded-lg bg-slate-950 text-xs font-black text-white dark:bg-brand-600">
                      {user.firstName
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <span className="hidden lg:inline">
                      {user.firstName}
                    </span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="grid h-10 w-10 place-items-center rounded-xl text-slate-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                    aria-label="Cerrar sesión"
                  >
                    <LogOut
                      size={17}
                    />
                  </button>
                </>
              )}
          </div>

          {/* MOBILE ACTIONS */}

          <div className="ml-auto flex items-center gap-2 sm:hidden">
            <ThemeToggle />

            <button
              type="button"
              onClick={() =>
                setMobileOpen(true)
              }
              className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              aria-label="Abrir menú"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE MENU */}

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              onClick={closeMobile}
              className="fixed inset-0 z-70 bg-slate-950/55 backdrop-blur-sm sm:hidden"
            />

            <motion.div
              initial={{
                x: "100%",
              }}
              animate={{
                x: 0,
              }}
              exit={{
                x: "100%",
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
              className="fixed inset-y-0 right-0 z-80 flex w-[min(88vw,350px)] flex-col bg-white shadow-2xl dark:bg-slate-900"
            >
              <div className="flex h-18 items-center justify-between border-b border-slate-200 px-5 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 text-white">
                    <Sparkles
                      size={17}
                    />
                  </div>

                  <span className="font-black text-slate-950 dark:text-white">
                    EVENTLY
                  </span>
                </div>

                <button
                  onClick={closeMobile}
                  className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-600 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  aria-label="Cerrar menú"
                >
                  <X size={19} />
                </button>
              </div>

              <div className="flex flex-1 flex-col overflow-y-auto p-5">
                {user && (
                  <div className="mb-6 rounded-2xl bg-slate-950 p-5 text-white dark:bg-slate-800">
                    <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand-600 text-sm font-black">
                      {user.firstName
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <p className="mt-4 font-black">
                      {user.firstName}{" "}
                      {user.lastName}
                    </p>

                    <p className="mt-1 truncate text-xs text-slate-400">
                      {user.email}
                    </p>
                  </div>
                )}

                <nav className="space-y-2">
                  <MobileLink
                    to="/"
                    icon={Sparkles}
                    label="Inicio"
                    onClick={closeMobile}
                  />

                  <MobileLink
                    to="/events"
                    icon={CalendarDays}
                    label="Eventos"
                    onClick={closeMobile}
                  />

                  {user && (
                    <MobileLink
                      to="/account"
                      icon={User}
                      label="Mi cuenta"
                      onClick={closeMobile}
                    />
                  )}

                  {user?.role ===
                    "Organizer" && (
                    <MobileLink
                      to="/organizer"
                      icon={LayoutDashboard}
                      label="Panel de organizador"
                      onClick={closeMobile}
                    />
                  )}
                </nav>

                <div className="mt-auto border-t border-slate-200 pt-5 dark:border-slate-800">
                  {!user ? (
                    <div className="space-y-3">
                      <Link
                        to="/login"
                        onClick={closeMobile}
                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                      >
                        <LogIn
                          size={17}
                        />

                        Iniciar sesión
                      </Link>

                      <Link
                        to="/register"
                        onClick={closeMobile}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3.5 text-sm font-black text-white"
                      >
                        <UserPlus
                          size={17}
                        />

                        Crear cuenta
                      </Link>
                    </div>
                  ) : (
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-3.5 text-sm font-black text-red-600 dark:bg-red-500/10 dark:text-red-400"
                    >
                      <LogOut
                        size={17}
                      />

                      Cerrar sesión
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

interface MobileLinkProps {
  to: string;
  label: string;
  icon: React.ElementType;
  onClick: () => void;
}

function MobileLink({
  to,
  label,
  icon: Icon,
  onClick,
}: MobileLinkProps) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({
        isActive,
      }) =>
        `flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-bold transition ${
          isActive
            ? "bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300"
            : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
        }`
      }
    >
      <Icon size={18} />

      {label}
    </NavLink>
  );
}

export default Navbar;
