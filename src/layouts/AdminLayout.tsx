import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import {
  CalendarDays,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Menu,
  ShieldCheck,
  Sparkles,
  Tags,
  UserCircle,
  Users,
  X,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import ThemeToggle from "../components/ui/ThemeToggle";
import DashboardFooter from "../components/ui/DashboardFooter";

const navigation = [
  { label: "Resumen", to: "/admin", icon: LayoutDashboard, end: true },
  { label: "Usuarios", to: "/admin/users", icon: Users, end: true },
  { label: "Eventos", to: "/admin/events", icon: CalendarDays, end: true },
  { label: "Categorías", to: "/admin/categories", icon: Tags, end: true },
];

function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate("/");
  };

  const sidebar = (
    <>
      <div className="flex h-18 items-center border-b border-slate-800/80 px-6">
        <Link to="/" className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 text-white shadow-lg shadow-brand-500/20">
            <Sparkles size={17} />
          </div>
          <div>
            <p className="text-lg font-black tracking-tight text-slate-50">EVENTLY</p>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Admin</p>
          </div>
        </Link>
      </div>

      <div className="flex flex-1 flex-col overflow-y-auto px-4 py-6">
        <div className="mb-5 rounded-2xl border border-brand-500/20 bg-brand-500/10 p-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-500/20 text-brand-300">
              <ShieldCheck size={19} />
            </div>
            <div>
              <p className="text-xs font-black text-slate-100">Administración</p>
              <p className="mt-1 text-[11px] text-slate-500">Control general de Evently</p>
            </div>
          </div>
        </div>

        <p className="mb-3 px-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Gestión</p>
        <nav className="space-y-1.5">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `group flex items-center justify-between rounded-xl px-3 py-3 text-sm font-semibold transition ${
                    isActive
                      ? "bg-brand-600 text-white shadow-lg shadow-brand-950/30"
                      : "text-slate-400 hover:bg-slate-800/80 hover:text-slate-100"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <Icon size={18} />
                      {item.label}
                    </div>
                    <ChevronRight
                      size={15}
                      className={`transition ${
                        isActive
                          ? "translate-x-0 opacity-100"
                          : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                      }`}
                    />
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        <p className="mb-3 mt-8 px-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Cuenta</p>
        <NavLink
          to="/account"
          onClick={() => setMobileOpen(false)}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${
              isActive ? "bg-slate-800 text-slate-100" : "text-slate-400 hover:bg-slate-800/80 hover:text-slate-100"
            }`
          }
        >
          <UserCircle size={18} />
          Mi cuenta
        </NavLink>
      </div>

      <div className="border-t border-slate-800/80 p-4">
        <div className="mb-3 flex items-center justify-between rounded-xl bg-slate-800/70 px-3 py-2.5">
          <div>
            <p className="text-xs font-bold text-slate-300">Apariencia</p>
            <p className="mt-0.5 text-[10px] text-slate-500">Claro / oscuro</p>
          </div>
          <ThemeToggle />
        </div>

        <div className="mb-3 rounded-2xl bg-slate-800/70 p-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-500/15 font-black text-brand-300">
              {user?.firstName?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-slate-100">{user?.firstName} {user?.lastName}</p>
              <p className="truncate text-xs text-slate-500">{user?.email}</p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut size={18} />
          Cerrar sesión
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-slate-100 text-slate-950 dark:bg-[#0b1120] dark:text-slate-100">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[270px] flex-col bg-[#0d1526] lg:flex">
        {sidebar}
      </aside>

      <header className="sticky top-0 z-30 flex h-17 items-center justify-between border-b border-slate-200 bg-slate-50/95 px-4 backdrop-blur-xl dark:border-slate-800 dark:bg-[#0b1120]/95 lg:hidden">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 text-white">
            <Sparkles size={17} />
          </div>
          <div>
            <span className="block font-black tracking-tight text-slate-950 dark:text-slate-50">EVENTLY</span>
            <span className="block text-[9px] font-black uppercase tracking-[0.18em] text-slate-400">Admin</span>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="grid h-10 w-10 place-items-center rounded-xl border border-slate-300 bg-slate-100 text-slate-700 transition hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            aria-label="Abrir menú"
          >
            <Menu size={20} />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 z-50 flex w-[min(86vw,285px)] flex-col bg-[#0d1526] shadow-2xl lg:hidden"
            >
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="absolute right-4 top-5 z-10 grid h-9 w-9 place-items-center rounded-xl bg-slate-800 text-slate-300 transition hover:bg-slate-700 hover:text-white"
                aria-label="Cerrar menú"
              >
                <X size={18} />
              </button>
              {sidebar}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="lg:pl-[270px]">
        <main className="min-h-screen bg-slate-100 dark:bg-[#0b1120]">
          <Outlet />
        </main>
        <DashboardFooter />
      </div>
    </div>
  );
}

export default AdminLayout;
