import {
  useEffect,
  useState,
} from "react";

import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  LoaderCircle,
  MapPin,
  Sparkles,
  Ticket as TicketIcon,
  Users,
} from "lucide-react";

import {
  motion,
} from "motion/react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  toast,
} from "sonner";

import axios from "axios";

import {
  getPublicEventById,
} from "../../services/eventService";

import {
  getMyTickets,
  reserveTicket,
} from "../../services/ticketService";

import {
  useAuth,
} from "../../hooks/useAuth";

import type {
  EventDetail,
} from "../../types/event";

import type {
  Ticket,
} from "../../types/ticket";

import {
  PageLoader,
} from "../../components/ui/PageState";

import {
  formatEventDate,
} from "../../utils/date";

import {
  resolveImageUrl,
} from "../../utils/image";

function EventDetailPage() {
  const { id } =
    useParams();

  const navigate =
    useNavigate();

  const {
    user,
  } = useAuth();

  const [
    event,
    setEvent,
  ] =
    useState<EventDetail | null>(
      null
    );

  const [
    existingTicket,
    setExistingTicket,
  ] =
    useState<Ticket | null>(
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

  const [
    reserving,
    setReserving,
  ] = useState(false);

  useEffect(() => {
    if (!id) {
      return;
    }

    let cancelled = false;

    getPublicEventById(
      Number(id)
    )
      .then((data) => {
        if (cancelled) {
          return;
        }

        setEvent(data);

        if (user) {
          getMyTickets()
            .then(
              (tickets) => {
                if (
                  cancelled
                ) {
                  return;
                }

                const ticket =
                  tickets.find(
                    (item) =>
                      item.eventId ===
                        data.id &&
                      item.status !==
                        "Cancelled"
                  );

                setExistingTicket(
                  ticket ?? null
                );
              }
            )
            .catch(
              (error) => {
                console.error(
                  error
                );
              }
            );
        }
      })
      .catch((error) => {
        console.error(error);

        if (!cancelled) {
          setNotFound(true);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [
    id,
    user,
  ]);

  const handleReserve =
    async () => {
      if (!event) {
        return;
      }

      if (!user) {
        navigate(
          "/login",
          {
            state: {
              from:
                `/events/${event.id}`,
            },
          }
        );

        return;
      }

      try {
        setReserving(true);

        const ticket =
          await reserveTicket(
            event.id
          );

        setExistingTicket(
          ticket
        );

        const refreshedEvent =
          await getPublicEventById(
            event.id
          );

        setEvent(
          refreshedEvent
        );

        toast.success(
          "¡Entrada reservada!",
          {
            description:
              "Tu QR ya está disponible en Mis entradas.",
          }
        );
      } catch (error) {
        console.error(error);

        if (
          axios.isAxiosError(
            error
          )
        ) {
          toast.error(
            "No fue posible reservar.",
            {
              description:
                error.response
                  ?.data
                  ?.message,
            }
          );

          return;
        }

        toast.error(
          "Ocurrió un error inesperado."
        );
      } finally {
        setReserving(false);
      }
    };

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
      <main className="flex min-h-[65vh] items-center justify-center bg-slate-100 px-4 py-16 dark:bg-[#0b1120]">
        <div className="max-w-lg text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-950/40 dark:text-brand-400">
            <CalendarDays
              size={28}
            />
          </div>

          <h1 className="mt-6 text-3xl font-black text-slate-950 dark:text-white">
            Evento no disponible
          </h1>

          <p className="mt-3 leading-7 text-slate-500 dark:text-slate-400">
            Puede que el evento no
            exista, todavía no esté
            publicado o haya sido
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

  const availabilityPercent =
    event.capacity > 0
      ? Math.min(
          100,
          Math.max(
            0,
            (event.reservedCount /
              event.capacity) *
              100
          )
        )
      : 0;

  const almostSoldOut =
    !event.isSoldOut &&
    event.availableSpots <= 10;

  return (
    <main className="bg-slate-100 pb-20 dark:bg-[#0b1120]">
      

      <section className="bg-slate-50 pt-5 dark:bg-slate-950 sm:pt-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link
            to="/events"
            className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-brand-600 dark:text-slate-400"
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
            className="relative aspect-16/10 overflow-hidden rounded-3xl bg-slate-900 shadow-xl sm:aspect-16/7 lg:rounded-4xl"
          >
            {event.imageUrl ? (
              <>
                <img
                  src={
                    resolveImageUrl(event.imageUrl) ?? ""
                  }
                  alt={
                    event.title
                  }
                  className="h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-linear-to-t from-slate-950/55 via-transparent to-transparent" />
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

      

      <section className="bg-slate-50 pb-12 pt-8 dark:bg-slate-950 sm:pt-10">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8">
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
            <span className="inline-flex rounded-full bg-brand-50 px-3 py-1.5 text-xs font-black uppercase tracking-wide text-brand-700 dark:bg-brand-950/40 dark:text-brand-300">
              {
                event.categoryName
              }
            </span>

            <h1 className="mt-5 max-w-4xl text-4xl font-black leading-[1.05] tracking-tight text-slate-950 dark:text-white sm:text-5xl lg:text-6xl">
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
                    month:
                      "long",
                    year:
                      "numeric",
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

            <div className="mt-10 border-t border-slate-200 pt-9 dark:border-slate-800">
              <h2 className="text-2xl font-black text-slate-950 dark:text-white">
                Sobre el evento
              </h2>

              <p className="mt-4 whitespace-pre-line text-base leading-8 text-slate-600 dark:text-slate-300">
                {
                  event.description
                }
              </p>
            </div>
          </motion.div>

          

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
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 shadow-[0_20px_60px_rgba(15,23,42,.1)] dark:border-slate-800 dark:bg-slate-900">
              <div className="bg-slate-950 p-6 text-white">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-accent-400 text-slate-950">
                  <TicketIcon
                    size={20}
                  />
                </div>

                <h2 className="mt-5 text-xl font-black">
                  Tu entrada
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Reserva tu lugar y
                  recibe un código QR
                  único para ingresar.
                </p>
              </div>

              <div className="p-6">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                      Precio
                    </p>

                    <p className="mt-1 text-2xl font-black text-slate-950 dark:text-white">
                      Gratis
                    </p>
                  </div>

                  <AvailabilityBadge
                    event={event}
                  />
                </div>

                

                <div className="mt-6">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-500 dark:text-slate-400">
                      Disponibilidad
                    </span>

                    <span
                      className={
                        almostSoldOut
                          ? "text-amber-600"
                          : event.isSoldOut
                            ? "text-red-600"
                            : "text-brand-600"
                      }
                    >
                      {
                        event.availableSpots
                      }{" "}
                      disponibles
                    </span>
                  </div>

                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <motion.div
                      initial={{
                        width: 0,
                      }}
                      animate={{
                        width:
                          `${availabilityPercent}%`,
                      }}
                      className={`h-full rounded-full ${
                        event.isSoldOut
                          ? "bg-red-500"
                          : almostSoldOut
                            ? "bg-amber-400"
                            : "bg-brand-600"
                      }`}
                    />
                  </div>
                </div>

                

                {existingTicket ? (
                  <Link
                    to="/tickets"
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3.5 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-emerald-700"
                  >
                    <CheckCircle2
                      size={18}
                    />

                    Ver mi entrada
                  </Link>
                ) : (
                  <button
                    type="button"
                    disabled={
                      reserving ||
                      event.isSoldOut
                    }
                    onClick={
                      handleReserve
                    }
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3.5 text-sm font-black text-white shadow-lg shadow-brand-600/20 transition hover:-translate-y-0.5 hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {reserving ? (
                      <>
                        <LoaderCircle
                          size={18}
                          className="animate-spin"
                        />

                        Reservando...
                      </>
                    ) : event.isSoldOut ? (
                      "Entradas agotadas"
                    ) : user ? (
                      "Obtener entrada"
                    ) : (
                      "Iniciar sesión para reservar"
                    )}
                  </button>
                )}

                <p className="mt-4 text-center text-xs leading-5 text-slate-400">
                  Una entrada por
                  persona y evento.
                </p>
              </div>
            </div>
          </motion.aside>
        </div>
      </section>
    </main>
  );
}

function AvailabilityBadge({
  event,
}: {
  event: EventDetail;
}) {
  if (event.isSoldOut) {
    return (
      <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-black text-red-700 dark:bg-red-950/40 dark:text-red-300">
        Agotado
      </span>
    );
  }

  if (
    event.availableSpots <= 10
  ) {
    return (
      <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-black text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
        Últimos lugares
      </span>
    );
  }

  return (
    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
      Disponible
    </span>
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
    <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4 dark:bg-slate-900">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950/40 dark:text-brand-400">
        <Icon size={18} />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p className="mt-1 wrap-break-word text-sm font-black text-slate-800 dark:text-slate-100">
          {value}
        </p>
      </div>
    </div>
  );
}

export default EventDetailPage;