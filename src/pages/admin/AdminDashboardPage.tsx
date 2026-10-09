import { useEffect, useState } from "react";
import type { ElementType } from "react";
import { CalendarDays, CheckCircle2, LoaderCircle, ShieldCheck, Tags, Ticket, UserCheck, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { getAdminDashboard } from "../../services/adminService";
import type { AdminDashboard } from "../../types/admin";

function AdminDashboardPage() {
  const [data, setData] = useState<AdminDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getAdminDashboard()
      .then((response) => {
        if (!cancelled) {
          setData(response);
          setError(false);
        }
      })
      .catch((requestError) => {
        console.error(requestError);
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <CenteredState icon={LoaderCircle} title="Cargando administración..." spinning />;
  }

  if (error || !data) {
    return <CenteredState icon={ShieldCheck} title="No fue posible cargar el panel administrativo." />;
  }

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
          <span className="text-xs font-black uppercase tracking-[0.2em] text-brand-600 dark:text-brand-400">Administración</span>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 dark:text-slate-50 sm:text-4xl">Vista general</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400 sm:text-base">
            Supervisa usuarios, eventos, categorías y actividad general de Evently.
          </p>
        </motion.div>

        <div className="mt-9 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Metric icon={Users} label="Usuarios" value={data.totalUsers} detail={`${data.activeUsers} activos`} />
          <Metric icon={UserCheck} label="Organizadores" value={data.organizers} detail="Cuentas activas" />
          <Metric icon={CalendarDays} label="Eventos" value={data.totalEvents} detail={`${data.publishedEvents} publicados`} />
          <Metric icon={Tags} label="Categorías" value={data.totalCategories} detail="Categorías activas" />
          <Metric icon={Ticket} label="Reservas" value={data.totalReservations} detail="Entradas activas" />
          <Metric icon={CheckCircle2} label="Check-ins" value={data.totalCheckIns} detail="Entradas utilizadas" />
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          <ActionCard to="/admin/users" icon={Users} title="Gestionar usuarios" text="Consulta cuentas, activa o desactiva accesos y administra roles." />
          <ActionCard to="/admin/events" icon={CalendarDays} title="Supervisar eventos" text="Revisa todos los eventos registrados y cancela publicaciones cuando sea necesario." />
          <ActionCard to="/admin/categories" icon={Tags} title="Administrar categorías" text="Crea, edita, activa y desactiva las categorías disponibles." />
        </div>
      </div>
    </div>
  );
}

function Metric({ icon: Icon, label, value, detail }: { icon: ElementType; label: string; value: number; detail: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6"
    >
      <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand-100 text-brand-700 dark:bg-brand-950/50 dark:text-brand-300">
        <Icon size={20} />
      </div>
      <p className="mt-6 text-3xl font-black text-slate-950 dark:text-slate-50">{value}</p>
      <p className="mt-1 text-sm font-black text-slate-700 dark:text-slate-200">{label}</p>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{detail}</p>
    </motion.div>
  );
}

function ActionCard({ to, icon: Icon, title, text }: { to: string; icon: ElementType; title: string; text: string }) {
  return (
    <Link
      to={to}
      className="group rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm transition hover:-translate-y-1 hover:border-brand-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-brand-800"
    >
      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-200 text-slate-700 transition group-hover:bg-brand-600 group-hover:text-white dark:bg-slate-800 dark:text-slate-300">
        <Icon size={21} />
      </div>
      <h2 className="mt-5 text-lg font-black text-slate-950 dark:text-slate-50">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{text}</p>
    </Link>
  );
}

function CenteredState({ icon: Icon, title, spinning = false }: { icon: ElementType; title: string; spinning?: boolean }) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="text-center">
        <Icon size={30} className={`mx-auto text-brand-600 ${spinning ? "animate-spin" : ""}`} />
        <p className="mt-4 text-sm font-semibold text-slate-600 dark:text-slate-400">{title}</p>
      </div>
    </div>
  );
}

export default AdminDashboardPage;
