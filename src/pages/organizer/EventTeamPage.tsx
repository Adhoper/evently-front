import { useEffect, useState } from "react";
import { ArrowLeft, Crown, LoaderCircle, Mail, QrCode, ShieldCheck, Trash2, UserPlus, UsersRound } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { motion } from "motion/react";
import axios from "axios";
import { toast } from "sonner";
import { useAuth } from "../../hooks/useAuth";
import { getMyEventById } from "../../services/eventService";
import { addEventStaff, getEventStaff, removeEventStaff } from "../../services/staffService";
import type { EventDetail } from "../../types/event";
import type { EventStaffMember } from "../../types/staff";

function EventTeamPage() {
  const { id } = useParams();
  const eventId = Number(id);
  const invalidEventId = !Number.isInteger(eventId) || eventId <= 0;
  const { user } = useAuth();

  const [eventItem, setEventItem] = useState<EventDetail | null>(null);
  const [staff, setStaff] = useState<EventStaffMember[]>([]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [removingUserId, setRemovingUserId] = useState<number | null>(null);

  useEffect(() => {
    if (invalidEventId) {
      return;
    }

    let active = true;

    Promise.all([getMyEventById(eventId), getEventStaff(eventId)])
      .then(([eventData, staffData]) => {
        if (!active) return;
        setEventItem(eventData);
        setStaff(staffData);
      })
      .catch((error) => {
        console.error(error);
        if (active) toast.error("No fue posible cargar el equipo del evento.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [eventId, invalidEventId]);

  const handleAdd = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      toast.error("Ingresa el correo de la persona que deseas agregar.");
      return;
    }

    try {
      setAdding(true);
      const member = await addEventStaff(eventId, { email: normalizedEmail });
      setStaff((current) => [...current, member].sort((a, b) => a.fullName.localeCompare(b.fullName)));
      setEmail("");
      toast.success("Miembro agregado al equipo.", {
        description: `${member.fullName} ya puede realizar check-in para este evento.`,
      });
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message ?? "No fue posible agregar al miembro."
        : "Ocurrió un error inesperado.";
      toast.error("No fue posible agregar al miembro.", { description: message });
    } finally {
      setAdding(false);
    }
  };

  const handleRemove = async (member: EventStaffMember) => {
    try {
      setRemovingUserId(member.userId);
      await removeEventStaff(eventId, member.userId);
      setStaff((current) => current.filter((item) => item.userId !== member.userId));
      toast.success("Miembro eliminado del equipo.");
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message ?? "No fue posible quitar al miembro."
        : "Ocurrió un error inesperado.";
      toast.error("No fue posible quitar al miembro.", { description: message });
    } finally {
      setRemovingUserId(null);
    }
  };

  if (invalidEventId) {
    return (
      <div className="px-4 py-10 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center dark:border-slate-800 dark:bg-slate-900">
          <h1 className="text-2xl font-black text-slate-950 dark:text-white">Evento no disponible</h1>
          <Link to="/organizer/events" className="mt-5 inline-flex items-center gap-2 font-bold text-brand-600 dark:text-brand-400">
            <ArrowLeft size={17} /> Volver a mis eventos
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoaderCircle className="animate-spin text-brand-600" size={32} />
      </div>
    );
  }

  if (!eventItem) {
    return (
      <div className="px-4 py-10 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center dark:border-slate-800 dark:bg-slate-900">
          <h1 className="text-2xl font-black text-slate-950 dark:text-white">Evento no disponible</h1>
          <Link to="/organizer/events" className="mt-5 inline-flex items-center gap-2 font-bold text-brand-600 dark:text-brand-400">
            <ArrowLeft size={17} /> Volver a mis eventos
          </Link>
        </div>
      </div>
    );
  }

  const locked = eventItem.status === "Cancelled" || eventItem.status === "Finished";

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-6xl">
        <Link to="/organizer/events" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400">
          <ArrowLeft size={16} /> Volver a mis eventos
        </Link>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="text-xs font-black uppercase tracking-[0.2em] text-brand-600 dark:text-brand-400">Equipo del evento</span>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 dark:text-slate-50 sm:text-4xl">{eventItem.title}</h1>
            <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-400">Agrega personas que puedan ayudarte a validar entradas. Los miembros del equipo solo reciben permiso de check-in para este evento.</p>
          </div>
          <div className="inline-flex w-fit items-center gap-2 rounded-2xl border border-brand-200 bg-brand-100 px-4 py-3 text-sm font-bold text-brand-800 dark:border-brand-900 dark:bg-brand-950/40 dark:text-brand-300">
            <QrCode size={18} /> {staff.length} {staff.length === 1 ? "miembro" : "miembros"}
          </div>
        </motion.div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[.8fr_1.2fr]">
          <section className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
            <div className="flex items-center gap-4">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-100 text-brand-700 dark:bg-brand-950/50 dark:text-brand-300">
                <UserPlus size={21} />
              </div>
              <div>
                <h2 className="font-black text-slate-950 dark:text-slate-50">Agregar miembro</h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">La persona debe tener una cuenta activa en Evently.</p>
              </div>
            </div>

            <form onSubmit={handleAdd} className="mt-6">
              <label htmlFor="staff-email" className="text-sm font-black text-slate-700 dark:text-slate-300">Correo electrónico</label>
              <div className="relative mt-2">
                <Mail size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input id="staff-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} disabled={locked || adding} placeholder="persona@correo.com" className="h-12 w-full rounded-xl border border-slate-300 bg-white pl-11 pr-4 text-sm text-slate-950 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
              </div>
              <button type="submit" disabled={locked || adding || !email.trim()} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3.5 text-sm font-black text-white shadow-lg shadow-brand-600/20 transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50">
                {adding ? <><LoaderCircle size={17} className="animate-spin" />Agregando...</> : <><UserPlus size={17} />Agregar al equipo</>}
              </button>
            </form>

            {locked && (
              <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-xs font-semibold text-amber-700 dark:bg-amber-950/30 dark:text-amber-300">El equipo de un evento cancelado o finalizado ya no puede modificarse.</p>
            )}

            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-100 p-4 dark:border-slate-800 dark:bg-slate-950">
              <div className="flex gap-3">
                <ShieldCheck size={19} className="mt-0.5 shrink-0 text-brand-600 dark:text-brand-400" />
                <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">El miembro puede escanear y validar QR de este evento, pero no puede editarlo, publicarlo, cancelarlo ni administrar asistentes.</p>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300"><UsersRound size={21} /></div>
                <div><h2 className="font-black text-slate-950 dark:text-slate-50">Personas con acceso</h2><p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Propietario y colaboradores de check-in.</p></div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex flex-col gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-950/20 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-amber-200 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200"><Crown size={19} /></div>
                  <div className="min-w-0"><p className="truncate font-black text-slate-900 dark:text-slate-100">{user?.firstName} {user?.lastName}</p><p className="truncate text-xs text-slate-500 dark:text-slate-400">{user?.email}</p></div>
                </div>
                <span className="inline-flex w-fit rounded-full bg-amber-200 px-3 py-1 text-[10px] font-black uppercase tracking-wide text-amber-800 dark:bg-amber-900/50 dark:text-amber-200">Propietario</span>
              </div>

              {staff.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 px-5 py-10 text-center dark:border-slate-700">
                  <UsersRound className="mx-auto text-slate-400" size={28} />
                  <p className="mt-3 font-black text-slate-800 dark:text-slate-200">Aún no hay colaboradores</p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Agrega una cuenta de Evently para compartir el check-in.</p>
                </div>
              ) : (
                staff.map((member) => (
                  <div key={member.id} className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-100 font-black text-brand-700 dark:bg-brand-950/50 dark:text-brand-300">{member.fullName.charAt(0).toUpperCase()}</div>
                      <div className="min-w-0"><p className="truncate font-black text-slate-900 dark:text-slate-100">{member.fullName}</p><p className="truncate text-xs text-slate-500 dark:text-slate-400">{member.email}</p><span className="mt-2 inline-flex rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">Check-in</span></div>
                    </div>
                    <button type="button" disabled={locked || removingUserId === member.userId} onClick={() => void handleRemove(member)} className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs font-black text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
                      {removingUserId === member.userId ? <LoaderCircle size={15} className="animate-spin" /> : <Trash2 size={15} />} Quitar
                    </button>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default EventTeamPage;
