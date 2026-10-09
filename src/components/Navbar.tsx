import { useState } from "react";
import type { ElementType } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  CalendarDays,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  ShieldCheck,
  Sparkles,
  Ticket,
  User,
  UserPlus,
  X,
} from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import ThemeToggle from "./ui/ThemeToggle";

function Navbar() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = () => setMobileOpen(false);
  const handleLogout = () => {
    logout();
    closeMobile();
    navigate("/");
  };

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-bold transition ${
      isActive
        ? "text-brand-700 dark:text-brand-300"
        : "text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-slate-100"
    }`;

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-200/90 bg-slate-50/95 backdrop-blur-xl dark:border-slate-800 dark:bg-[#0b1120]/95">
        <div className="mx-auto flex h-18 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <Link to="/" className="group flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 text-white shadow-lg shadow-brand-600/20 transition group-hover:-rotate-3 group-hover:scale-105">
              <Sparkles size={17} />
            </div>
            <div className="leading-none">
              <p className="text-lg font-black tracking-tight text-slate-950 dark:text-slate-50">EVENTLY</p>
              <div className="mt-1 h-1 w-7 rounded-full bg-accent-400" />
            </div>
          </Link>

          <nav className="ml-12 hidden items-center gap-8 md:flex">
            <NavLink to="/" end className={navLinkClasses}>Inicio</NavLink>
            <NavLink to="/events" className={navLinkClasses}>Eventos</NavLink>
          </nav>

          <div className="ml-auto hidden items-center gap-2 sm:flex">
            <ThemeToggle />

            {!loading && !user && (
              <>
                <Link to="/login" className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-200/80 dark:text-slate-300 dark:hover:bg-slate-800">
                  <LogIn size={16} />
                  <span className="hidden md:inline">Iniciar sesión</span>
                </Link>
                <Link to="/register" className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-black text-white shadow-md shadow-brand-600/20 transition hover:-translate-y-0.5 hover:bg-brand-700">
                  <UserPlus size={16} />
                  <span className="hidden md:inline">Crear cuenta</span>
                </Link>
              </>
            )}

            {!loading && user && (
              <>
                <Link to="/tickets" className="inline-flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-brand-100 hover:text-brand-800 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-brand-300 lg:px-4">
                  <Ticket size={16} />
                  <span className="hidden lg:inline">Mis entradas</span>
                </Link>

                {user.role === "Organizer" && (
                  <Link to="/organizer" className="inline-flex items-center gap-2 rounded-xl bg-brand-100 px-3 py-2.5 text-sm font-black text-brand-800 transition hover:bg-brand-200 dark:bg-brand-950/50 dark:text-brand-300 dark:hover:bg-brand-950/80 lg:px-4">
                    <LayoutDashboard size={16} />
                    <span className="hidden lg:inline">Panel</span>
                  </Link>
                )}

                {user.role === "Admin" && (
                  <Link to="/admin" className="inline-flex items-center gap-2 rounded-xl bg-violet-100 px-3 py-2.5 text-sm font-black text-violet-800 transition hover:bg-violet-200 dark:bg-violet-950/50 dark:text-violet-300 dark:hover:bg-violet-950/80 lg:px-4">
                    <ShieldCheck size={16} />
                    <span className="hidden lg:inline">Admin</span>
                  </Link>
                )}

                <Link to="/account" className="inline-flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-200/80 dark:text-slate-300 dark:hover:bg-slate-800 lg:px-4">
                  <div className="grid h-7 w-7 place-items-center rounded-lg bg-slate-800 text-xs font-black text-white dark:bg-brand-600">
                    {user.firstName.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden xl:inline">{user.firstName}</span>
                </Link>

                <button type="button" onClick={handleLogout} className="grid h-10 w-10 place-items-center rounded-xl text-slate-500 transition hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-950/40 dark:hover:text-red-300" aria-label="Cerrar sesión" title="Cerrar sesión">
                  <LogOut size={17} />
                </button>
              </>
            )}
          </div>

          <div className="ml-auto flex items-center gap-2 sm:hidden">
            <ThemeToggle />
            <button type="button" onClick={() => setMobileOpen(true)} className="grid h-10 w-10 place-items-center rounded-xl border border-slate-300 bg-slate-100 text-slate-700 transition hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200" aria-label="Abrir menú">
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeMobile} className="fixed inset-0 z-70 bg-slate-950/60 backdrop-blur-sm sm:hidden" />
            <motion.aside initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 300, damping: 30 }} className="fixed inset-y-0 right-0 z-80 flex w-[min(88vw,350px)] flex-col bg-slate-50 shadow-2xl dark:bg-[#0b1120] sm:hidden">
              <div className="flex h-18 items-center justify-between border-b border-slate-200 px-5 dark:border-slate-800">
                <Link to="/" onClick={closeMobile} className="flex items-center gap-2.5">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 text-white"><Sparkles size={17} /></div>
                  <span className="font-black text-slate-950 dark:text-slate-50">EVENTLY</span>
                </Link>
                <button type="button" onClick={closeMobile} className="grid h-10 w-10 place-items-center rounded-xl bg-slate-200 text-slate-700 transition hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-300" aria-label="Cerrar menú"><X size={19} /></button>
              </div>

              <div className="flex flex-1 flex-col overflow-y-auto p-5">
                {user && (
                  <div className="mb-6 rounded-2xl bg-[#0d1526] p-5 text-white">
                    <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand-600 text-sm font-black">{user.firstName.charAt(0).toUpperCase()}</div>
                    <p className="mt-4 font-black">{user.firstName} {user.lastName}</p>
                    <p className="mt-1 truncate text-xs text-slate-400">{user.email}</p>
                    <span className="mt-3 inline-flex rounded-full bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-wide text-brand-200">{user.role === "Organizer" ? "Organizador" : user.role === "Admin" ? "Administrador" : "Usuario"}</span>
                  </div>
                )}

                <nav className="space-y-2">
                  <MobileLink to="/" icon={Sparkles} label="Inicio" onClick={closeMobile} />
                  <MobileLink to="/events" icon={CalendarDays} label="Eventos" onClick={closeMobile} />
                  {user && <MobileLink to="/tickets" icon={Ticket} label="Mis entradas" onClick={closeMobile} />}
                  {user && <MobileLink to="/account" icon={User} label="Mi cuenta" onClick={closeMobile} />}
                  {user?.role === "Organizer" && <MobileLink to="/organizer" icon={LayoutDashboard} label="Panel de organizador" onClick={closeMobile} />}
                  {user?.role === "Admin" && <MobileLink to="/admin" icon={ShieldCheck} label="Panel administrativo" onClick={closeMobile} />}
                </nav>

                <div className="mt-auto border-t border-slate-200 pt-5 dark:border-slate-800">
                  {!user ? (
                    <div className="space-y-3">
                      <Link to="/login" onClick={closeMobile} className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-slate-100 px-4 py-3.5 text-sm font-bold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"><LogIn size={17} />Iniciar sesión</Link>
                      <Link to="/register" onClick={closeMobile} className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3.5 text-sm font-black text-white"><UserPlus size={17} />Crear cuenta</Link>
                    </div>
                  ) : (
                    <button type="button" onClick={handleLogout} className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-100 px-4 py-3.5 text-sm font-black text-red-700 dark:bg-red-950/40 dark:text-red-300"><LogOut size={17} />Cerrar sesión</button>
                  )}
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

interface MobileLinkProps {
  to: string;
  label: string;
  icon: ElementType;
  onClick: () => void;
}

function MobileLink({ to, label, icon: Icon, onClick }: MobileLinkProps) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-bold transition ${
          isActive
            ? "bg-brand-100 text-brand-800 dark:bg-brand-950/50 dark:text-brand-300"
            : "text-slate-700 hover:bg-slate-200/80 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
        }`
      }
    >
      <Icon size={18} />
      {label}
    </NavLink>
  );
}

export default Navbar;
