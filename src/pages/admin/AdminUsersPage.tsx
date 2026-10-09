import { useEffect, useMemo, useState } from "react";
import { Ban, CheckCircle2, LoaderCircle, Search, ShieldCheck, Users } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { getAdminUsers, updateAdminUserRole, updateAdminUserStatus } from "../../services/adminService";
import type { AdminUser } from "../../types/admin";
import Select from "../../components/ui/Select";
import { useAuth } from "../../hooks/useAuth";

function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [processingId, setProcessingId] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    getAdminUsers()
      .then((data) => {
        if (!cancelled) setUsers(data);
      })
      .catch((error) => {
        console.error(error);
        if (!cancelled) toast.error("No fue posible cargar los usuarios.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return users.filter((item) => {
      const matchesSearch = !q || `${item.firstName} ${item.lastName}`.toLowerCase().includes(q) || item.email.toLowerCase().includes(q);
      const matchesRole = roleFilter === "all" || item.role === roleFilter;
      const matchesStatus = statusFilter === "all" || (statusFilter === "active" ? item.isActive : !item.isActive);
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const applyUser = (updated: AdminUser) => {
    setUsers((current) => current.map((item) => (item.id === updated.id ? updated : item)));
  };

  const handleRole = async (target: AdminUser, role: "User" | "Organizer") => {
    try {
      setProcessingId(target.id);
      applyUser(await updateAdminUserRole(target.id, role));
      toast.success("Rol actualizado.");
    } catch (error) {
      showError(error, "No fue posible actualizar el rol.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleStatus = async (target: AdminUser) => {
    try {
      setProcessingId(target.id);
      applyUser(await updateAdminUserStatus(target.id, !target.isActive));
      toast.success(target.isActive ? "Cuenta desactivada." : "Cuenta activada.");
    } catch (error) {
      showError(error, "No fue posible actualizar la cuenta.");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-7xl">
        <span className="text-xs font-black uppercase tracking-[0.2em] text-brand-600 dark:text-brand-400">Administración</span>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 dark:text-slate-50 sm:text-4xl">Usuarios</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Gestiona acceso y roles sin permitir promociones a administrador desde la interfaz.</p>

        <section className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
          <div className="grid gap-3 lg:grid-cols-[1fr_220px_220px]">
            <div className="relative">
              <Search size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar por nombre o correo..."
                className="h-12 w-full rounded-xl border border-slate-300 bg-slate-100 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>
            <Select value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)}>
              <option value="all">Todos los roles</option>
              <option value="User">Usuarios</option>
              <option value="Organizer">Organizadores</option>
              <option value="Admin">Administradores</option>
            </Select>
            <Select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option value="all">Todos los estados</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
            </Select>
          </div>
          <p className="mt-4 text-sm font-semibold text-slate-500 dark:text-slate-400">{filtered.length} resultado{filtered.length === 1 ? "" : "s"}</p>
        </section>

        {loading ? (
          <div className="flex min-h-72 items-center justify-center"><LoaderCircle className="animate-spin text-brand-600" /></div>
        ) : filtered.length === 0 ? (
          <EmptyUsers />
        ) : (
          <>
            <div className="mt-5 space-y-3 md:hidden">
              {filtered.map((item) => (
                <UserCard key={item.id} item={item} currentUserId={currentUser?.id} processing={processingId === item.id} onRole={handleRole} onStatus={handleStatus} />
              ))}
            </div>
            <div className="mt-5 hidden overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:block">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[920px]">
                  <thead className="border-b border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-950/70">
                    <tr>{["Usuario", "Rol", "Estado", "Eventos", "Entradas", "Acciones"].map((label) => <th key={label} className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-[0.15em] text-slate-500">{label}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {filtered.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-100/70 dark:hover:bg-slate-800/50">
                        <td className="px-6 py-4"><Identity item={item} /></td>
                        <td className="px-6 py-4"><RoleControl item={item} currentUserId={currentUser?.id} processing={processingId === item.id} onRole={handleRole} /></td>
                        <td className="px-6 py-4"><StatusBadge active={item.isActive} /></td>
                        <td className="px-6 py-4 text-sm font-bold text-slate-700 dark:text-slate-300">{item.eventsCount}</td>
                        <td className="px-6 py-4 text-sm font-bold text-slate-700 dark:text-slate-300">{item.ticketsCount}</td>
                        <td className="px-6 py-4"><StatusButton item={item} currentUserId={currentUser?.id} processing={processingId === item.id} onStatus={handleStatus} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Identity({ item }: { item: AdminUser }) {
  return <div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-100 font-black text-brand-700 dark:bg-brand-950/50 dark:text-brand-300">{item.firstName.charAt(0).toUpperCase()}</div><div><p className="font-black text-slate-900 dark:text-slate-100">{item.firstName} {item.lastName}</p><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{item.email}</p></div></div>;
}

function RoleControl({ item, currentUserId, processing, onRole }: { item: AdminUser; currentUserId?: number; processing: boolean; onRole: (item: AdminUser, role: "User" | "Organizer") => void }) {
  if (item.role === "Admin") return <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-100 px-3 py-1.5 text-[10px] font-black uppercase text-violet-700 dark:bg-violet-950/40 dark:text-violet-300"><ShieldCheck size={12} /> Admin</span>;
  return <Select value={item.role} disabled={processing || item.id === currentUserId} onChange={(event) => onRole(item, event.target.value as "User" | "Organizer")} className="!h-10 min-w-36 py-0"><option value="User">Usuario</option><option value="Organizer">Organizador</option></Select>;
}

function StatusBadge({ active }: { active: boolean }) {
  return active ? <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1.5 text-[10px] font-black uppercase text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"><CheckCircle2 size={12} /> Activa</span> : <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1.5 text-[10px] font-black uppercase text-red-700 dark:bg-red-950/40 dark:text-red-300"><Ban size={12} /> Inactiva</span>;
}

function StatusButton({ item, currentUserId, processing, onStatus }: { item: AdminUser; currentUserId?: number; processing: boolean; onStatus: (item: AdminUser) => void }) {
  if (item.role === "Admin" || item.id === currentUserId) return <span className="text-xs font-semibold text-slate-400">Protegida</span>;
  return <button type="button" disabled={processing} onClick={() => onStatus(item)} className={`rounded-xl px-3.5 py-2 text-xs font-black transition disabled:opacity-50 ${item.isActive ? "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-950/40 dark:text-red-300" : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300"}`}>{item.isActive ? "Desactivar" : "Activar"}</button>;
}

function UserCard({ item, currentUserId, processing, onRole, onStatus }: { item: AdminUser; currentUserId?: number; processing: boolean; onRole: (item: AdminUser, role: "User" | "Organizer") => void; onStatus: (item: AdminUser) => void }) {
  return <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900"><div className="flex items-start justify-between gap-3"><Identity item={item} /><StatusBadge active={item.isActive} /></div><div className="mt-5 grid grid-cols-2 gap-3"><div className="rounded-xl bg-slate-100 p-3 dark:bg-slate-800"><p className="text-[10px] font-black uppercase text-slate-400">Eventos</p><p className="mt-1 font-black">{item.eventsCount}</p></div><div className="rounded-xl bg-slate-100 p-3 dark:bg-slate-800"><p className="text-[10px] font-black uppercase text-slate-400">Entradas</p><p className="mt-1 font-black">{item.ticketsCount}</p></div></div><div className="mt-4"><RoleControl item={item} currentUserId={currentUserId} processing={processing} onRole={onRole} /></div><div className="mt-3"><StatusButton item={item} currentUserId={currentUserId} processing={processing} onStatus={onStatus} /></div></article>;
}

function EmptyUsers() {
  return <div className="mt-5 rounded-3xl border border-dashed border-slate-300 bg-slate-50 py-16 text-center dark:border-slate-700 dark:bg-slate-900"><Users className="mx-auto text-slate-400" /><p className="mt-4 font-black text-slate-900 dark:text-slate-100">No hay usuarios que coincidan con los filtros.</p></div>;
}

function showError(error: unknown, fallback: string) {
  if (axios.isAxiosError(error)) {
    toast.error(fallback, { description: error.response?.data?.message });
  } else {
    toast.error(fallback);
  }
}

export default AdminUsersPage;
