import { useEffect, useMemo, useState } from "react";
import { CalendarDays, CheckCircle2, ExternalLink, LoaderCircle, MapPin, Search, Ticket, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { cancelAdminEvent, getAdminEvents } from "../../services/adminService";
import type { AdminEvent } from "../../types/admin";
import Select from "../../components/ui/Select";
import ConfirmModal from "../../components/ui/ConfirmModal";
import EventStatusBadge from "../../components/EventStatusBadge";
import { formatEventDate } from "../../utils/date";

function AdminEventsPage() {
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [selected, setSelected] = useState<AdminEvent | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getAdminEvents()
      .then((data) => {
        if (!cancelled) setEvents(data);
      })
      .catch((error) => {
        console.error(error);
        if (!cancelled) toast.error("No fue posible cargar los eventos.");
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
    return events.filter((item) => {
      const matchesSearch = !q || item.title.toLowerCase().includes(q) || item.organizerName.toLowerCase().includes(q) || item.organizerEmail.toLowerCase().includes(q);
      const matchesStatus = status === "all" || item.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [events, search, status]);

  const handleCancel = async () => {
    if (!selected) return;
    try {
      setProcessing(true);
      const updated = await cancelAdminEvent(selected.id);
      setEvents((current) => current.map((item) => (item.id === updated.id ? updated : item)));
      setSelected(null);
      toast.success("Evento cancelado correctamente.");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error("No fue posible cancelar el evento.", { description: error.response?.data?.message });
      } else {
        toast.error("No fue posible cancelar el evento.");
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <>
      <div className="px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
        <div className="mx-auto max-w-7xl">
          <span className="text-xs font-black uppercase tracking-[0.2em] text-brand-600 dark:text-brand-400">Administración</span>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 dark:text-slate-50 sm:text-4xl">Eventos</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Consulta todas las publicaciones del sistema y actúa sobre eventos publicados.</p>

          <section className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
            <div className="grid gap-3 lg:grid-cols-[1fr_240px]">
              <div className="relative">
                <Search size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Buscar evento u organizador..."
                  className="h-12 w-full rounded-xl border border-slate-300 bg-slate-100 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>
              <Select value={status} onChange={(event) => setStatus(event.target.value)}>
                <option value="all">Todos los estados</option>
                <option value="Draft">Borradores</option>
                <option value="Published">Publicados</option>
                <option value="Cancelled">Cancelados</option>
                <option value="Finished">Finalizados</option>
              </Select>
            </div>
            <p className="mt-4 text-sm font-semibold text-slate-500 dark:text-slate-400">{filtered.length} resultado{filtered.length === 1 ? "" : "s"}</p>
          </section>

          {loading ? (
            <div className="flex min-h-72 items-center justify-center"><LoaderCircle className="animate-spin text-brand-600" /></div>
          ) : filtered.length === 0 ? (
            <div className="mt-5 rounded-3xl border border-dashed border-slate-300 bg-slate-50 py-16 text-center dark:border-slate-700 dark:bg-slate-900"><CalendarDays className="mx-auto text-slate-400" /><p className="mt-4 font-black text-slate-900 dark:text-slate-100">No hay eventos para mostrar.</p></div>
          ) : (
            <div className="mt-5 grid gap-4 xl:grid-cols-2">
              {filtered.map((item) => (
                <article key={item.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <EventStatusBadge status={item.status} />
                        <span className="rounded-full bg-slate-200 px-3 py-1 text-[10px] font-black uppercase text-slate-600 dark:bg-slate-800 dark:text-slate-300">{item.categoryName}</span>
                      </div>
                      <h2 className="mt-4 text-xl font-black text-slate-950 dark:text-slate-50">{item.title}</h2>
                      <p className="mt-2 text-sm font-semibold text-slate-600 dark:text-slate-300">{item.organizerName}</p>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{item.organizerEmail}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 sm:w-44">
                      <Metric icon={Ticket} value={item.reservations} label="Reservas" />
                      <Metric icon={CheckCircle2} value={item.checkIns} label="Check-ins" />
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 text-sm text-slate-600 dark:text-slate-400 sm:grid-cols-2">
                    <div className="flex items-center gap-2"><CalendarDays size={15} className="text-brand-500" />{formatEventDate(item.date, { day: "2-digit", month: "short", year: "numeric" })} · {item.startTime.slice(0, 5)}</div>
                    <div className="flex items-center gap-2"><MapPin size={15} className="text-brand-500" />{item.location}</div>
                    <div className="flex items-center gap-2"><Users size={15} className="text-brand-500" />Capacidad: {item.capacity}</div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-200 pt-5 dark:border-slate-800">
                    {item.status === "Published" && (
                      <Link to={`/events/${item.id}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-slate-100 px-3.5 py-2.5 text-xs font-black text-slate-700 transition hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"><ExternalLink size={15} />Ver público</Link>
                    )}
                    {item.status === "Published" && (
                      <button type="button" onClick={() => setSelected(item)} className="rounded-xl bg-red-100 px-3.5 py-2.5 text-xs font-black text-red-700 transition hover:bg-red-200 dark:bg-red-950/40 dark:text-red-300 dark:hover:bg-red-950/60">Cancelar evento</button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        open={selected !== null}
        title="¿Cancelar este evento?"
        description={`“${selected?.title ?? ""}” dejará de estar disponible y las reservas activas se invalidarán.`}
        confirmText="Cancelar evento"
        variant="danger"
        loading={processing}
        onConfirm={handleCancel}
        onClose={() => !processing && setSelected(null)}
      />
    </>
  );
}

function Metric({ icon: Icon, value, label }: { icon: typeof Ticket; value: number; label: string }) {
  return <div className="rounded-xl bg-slate-100 p-3 dark:bg-slate-800"><div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400"><Icon size={13} /><span className="text-[9px] font-black uppercase">{label}</span></div><p className="mt-1 text-lg font-black text-slate-900 dark:text-slate-100">{value}</p></div>;
}

export default AdminEventsPage;
