import {
  useEffect,
  useState,
} from "react";

import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  MapPin,
  Sparkles,
  Ticket,
  Users,
} from "lucide-react";

import {
  motion,
} from "motion/react";

import {
  Link,
  useParams,
} from "react-router-dom";

import {
  getPublicEventById,
} from "../../services/eventService";

import type {
  EventDetail,
} from "../../types/event";

import {
  PageLoader,
} from "../../components/ui/PageState";

import {
  formatEventDate,
} from "../../utils/date";

function EventDetailPage() {
  const { id } =
    useParams();

  const [
    event,
    setEvent,
  ] =
    useState<EventDetail | null>(
      null
    );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    notFound,
    setNotFound,
  ] = useState(false);

  useEffect(() => {
    const loadEvent =
      async () => {
        if (!id) {
          setNotFound(true);
          setLoading(false);
          return;
        }

        try {
          const data =
            await getPublicEventById(
              Number(id)
            );

          setEvent(data);
        } catch (error) {
          console.error(error);
          setNotFound(true);
        } finally {
          setLoading(false);
        }
      };

    loadEvent();
  }, [id]);

  if (loading) {
    return (
      <PageLoader text="Preparando el evento..." />
    );
  }

  if (
    notFound ||
    !event
  ) {
    return (
      <main className="flex min-h-[65vh] items-center justify-center px-4 py-16">
        <div className="max-w-lg text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-brand-50 text-brand-600">
            <CalendarDays
              size={28}
            />
          </div>

          <h1 className="mt-6 text-3xl font-black">
            Evento no disponible
          </h1>

          <p className="mt-3 leading-7 text-slate-500">
            Puede que el evento no
            exista, todavía no esté
            publicado o ya haya sido
            retirado.
          </p>

          <Link
            to="/events"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-black text-white"
          >
            <ArrowLeft
              size={17}
            />

            Explorar eventos
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-slate-50 pb-20">
      {/* HERO IMAGE */}

      <section className="bg-white pt-5 sm:pt-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link
            to="/events"
            className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-brand-600"
          >
            <ArrowLeft
              size={17}
            />

            Volver a eventos
          </Link>

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.985,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            className="relative aspect-16/10 overflow-hidden rounded-[28px] bg-slate-900 shadow-xl sm:aspect-16/7 lg:rounded-[36px]"
          >
            {event.imageUrl ? (
              <>
                <img
                  src={
                    event.imageUrl
                  }
                  alt={
                    event.title
                  }
                  className="h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-linear-to-t from-slate-950/50 via-transparent to-transparent" />
              </>
            ) : (
              <div className="flex h-full items-center justify-center bg-linear-to-br from-brand-500 via-brand-700 to-slate-950">
                <div className="text-center">
                  <Sparkles
                    size={36}
                    className="mx-auto text-accent-400"
                  />

                  <p className="mt-4 text-2xl font-black tracking-[0.2em] text-white sm:text-4xl">
                    EVENTLY
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* CONTENT */}

      <section className="bg-white pb-12 pt-8 sm:pt-10">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:px-8">
          <motion.div
            initial={{
              opacity: 0,
              y: 18,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
          >
            <span className="inline-flex rounded-full bg-brand-50 px-3 py-1.5 text-xs font-black uppercase tracking-wide text-brand-700">
              {event.categoryName}
            </span>

            <h1 className="mt-5 max-w-4xl text-4xl font-black leading-[1.05] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              {event.title}
            </h1>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <InfoItem
                icon={
                  CalendarDays
                }
                label="Fecha"
                value={formatEventDate(
                  event.date,
                  {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  }
                )}
              />

              <InfoItem
                icon={Clock3}
                label="Hora"
                value={event.startTime.slice(
                  0,
                  5
                )}
              />

              <InfoItem
                icon={MapPin}
                label="Lugar"
                value={
                  event.location
                }
              />

              <InfoItem
                icon={Users}
                label="Capacidad"
                value={`${event.capacity} personas`}
              />
            </div>

            <div className="mt-10 border-t border-slate-200 pt-9">
              <h2 className="text-2xl font-black">
                Sobre el evento
              </h2>

              <p className="mt-4 whitespace-pre-line text-base leading-8 text-slate-600">
                {
                  event.description
                }
              </p>
            </div>
          </motion.div>

          {/* TICKET CARD */}

          <motion.aside
            initial={{
              opacity: 0,
              x: 15,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            className="lg:sticky lg:top-24 lg:self-start"
          >
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,.1)]">
              <div className="bg-slate-950 p-6 text-white">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-accent-400 text-slate-950">
                  <Ticket
                    size={20}
                  />
                </div>

                <h2 className="mt-5 text-xl font-black">
                  ¿Quieres asistir?
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Obtén una entrada para
                  este evento desde tu
                  cuenta.
                </p>
              </div>

              <div className="p-6">
                <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                  Entrada
                </p>

                <div className="mt-2 flex items-end justify-between gap-4">
                  <p className="text-2xl font-black">
                    Gratis
                  </p>

                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                    Disponible
                  </span>
                </div>

                <button
                  type="button"
                  className="mt-6 w-full rounded-xl bg-brand-600 px-5 py-3.5 text-sm font-black text-white shadow-lg shadow-brand-600/20 transition hover:-translate-y-0.5 hover:bg-brand-700"
                >
                  Obtener entrada
                </button>

                <p className="mt-4 text-center text-xs leading-5 text-slate-400">
                  Próximamente conectaremos
                  este botón con el sistema
                  de entradas y QR.
                </p>
              </div>
            </div>
          </motion.aside>
        </div>
      </section>
    </main>
  );
}

interface InfoItemProps {
  icon: React.ElementType;
  label: string;
  value: string;
}

function InfoItem({
  icon: Icon,
  label,
  value,
}: InfoItemProps) {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
        <Icon size={18} />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p className="mt-1 wrap-break-word text-sm font-black text-slate-800">
          {value}
        </p>
      </div>
    </div>
  );
}

export default EventDetailPage;