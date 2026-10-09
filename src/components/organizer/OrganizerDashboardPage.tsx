import {
  useEffect,
  useState,
} from "react";

import type {
  ElementType,
} from "react";

import {
  ArrowRight,
  CalendarDays,
  CalendarPlus,
  CheckCircle2,
  ClipboardCheck,
  LoaderCircle,
  Percent,
  Sparkles,
  Ticket,
  Trophy,
  Users,
} from "lucide-react";

import {
  motion,
} from "motion/react";

import {
  Link,
} from "react-router-dom";

import {
  getOrganizerDashboard,
} from "../../services/organizerService";

import type {
  OrganizerDashboard,
} from "../../types/organizer";

function OrganizerDashboardPage() {
  const [
    dashboard,
    setDashboard,
  ] =
    useState<OrganizerDashboard | null>(
      null
    );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState(false);

  // ============================================================
  // LOAD
  // ============================================================

  useEffect(() => {
    let cancelled = false;

    getOrganizerDashboard()
      .then((data) => {
        if (cancelled) {
          return;
        }

        setDashboard(data);
        setError(false);
      })
      .catch((requestError) => {
        console.error(
          requestError
        );

        if (!cancelled) {
          setError(true);
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
  }, []);

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="text-center">
          <LoaderCircle
            size={30}
            className="mx-auto animate-spin text-brand-600"
          />

          <p className="mt-4 text-sm font-semibold text-slate-500 dark:text-slate-400">
            Preparando tu dashboard...
          </p>
        </div>
      </div>
    );
  }

  // ============================================================
  // ERROR
  // ============================================================

  if (
    error ||
    !dashboard
  ) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400">
            <Users
              size={24}
            />
          </div>

          <h1 className="mt-5 text-2xl font-black text-slate-950 dark:text-white">
            No pudimos cargar el dashboard
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
            Intenta actualizar la página
            para consultar nuevamente la
            información.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-7xl">
        {/* ====================================================
            HEADER
            ==================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <span className="text-xs font-black uppercase tracking-[0.2em] text-brand-600 dark:text-brand-400">
              Organizer
            </span>

            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl">
              Resumen
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
              Consulta el rendimiento de
              tus eventos, reservas y
              asistencia.
            </p>
          </div>

          <Link
            to="/organizer/events/create"
            className="inline-flex w-fit items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-brand-600/20 transition hover:-translate-y-0.5 hover:bg-brand-700"
          >
            <CalendarPlus
              size={17}
            />

            Crear evento
          </Link>
        </motion.div>

        {/* ====================================================
            MAIN STATS
            ==================================================== */}

        <div className="mt-9 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <DashboardCard
            icon={Ticket}
            label="Reservas"
            value={
              dashboard.totalReservations
            }
            description="Entradas activas"
            variant="blue"
          />

          <DashboardCard
            icon={ClipboardCheck}
            label="Check-ins"
            value={
              dashboard.totalCheckIns
            }
            description="Asistentes registrados"
            variant="green"
          />

          <DashboardCard
            icon={Percent}
            label="Asistencia"
            value={`${dashboard.attendanceRate}%`}
            description="Check-ins / reservas"
            variant="yellow"
          />

          <DashboardCard
            icon={Users}
            label="Ocupación"
            value={`${dashboard.occupancyRate}%`}
            description="Reservas / capacidad"
            variant="slate"
          />
        </div>

        {/* ====================================================
            EVENT STATUS
            ==================================================== */}

        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-950 dark:text-white">
                Tus eventos
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Estado general de tus
                publicaciones.
              </p>
            </div>

            <Link
              to="/organizer/events"
              className="inline-flex items-center gap-2 text-sm font-black text-brand-600 transition hover:gap-3 dark:text-brand-400"
            >
              Ver eventos

              <ArrowRight
                size={16}
              />
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-5">
            <EventCounter
              label="Total"
              value={
                dashboard.totalEvents
              }
            />

            <EventCounter
              label="Publicados"
              value={
                dashboard.publishedEvents
              }
              dotClass="bg-emerald-500"
            />

            <EventCounter
              label="Borradores"
              value={
                dashboard.draftEvents
              }
              dotClass="bg-amber-400"
            />

            <EventCounter
              label="Cancelados"
              value={
                dashboard.cancelledEvents
              }
              dotClass="bg-red-500"
            />

            <EventCounter
              label="Finalizados"
              value={
                dashboard.finishedEvents
              }
              dotClass="bg-slate-400"
            />
          </div>
        </section>

        {/* ====================================================
            OCCUPANCY + TOP EVENT
            ==================================================== */}

        <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_.9fr]">
          {/* OCCUPANCY */}

          <motion.section
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.1,
            }}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-7"
          >
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950/40 dark:text-brand-400">
                <Users
                  size={20}
                />
              </div>

              <div>
                <h2 className="font-black text-slate-950 dark:text-white">
                  Ocupación general
                </h2>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Capacidad de tus eventos
                  activos y finalizados.
                </p>
              </div>
            </div>

            <div className="mt-8 flex items-end justify-between gap-4">
              <div>
                <p className="text-4xl font-black text-slate-950 dark:text-white sm:text-5xl">
                  {
                    dashboard.occupancyRate
                  }
                  %
                </p>

                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  {
                    dashboard.totalReservations
                  }{" "}
                  reservas de{" "}
                  {
                    dashboard.totalCapacity
                  }{" "}
                  lugares
                </p>
              </div>
            </div>

            <ProgressBar
              value={
                dashboard.occupancyRate
              }
              className="mt-7"
            />

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <MiniMetric
                title="Reservas"
                value={
                  dashboard.totalReservations
                }
              />

              <MiniMetric
                title="Check-ins"
                value={
                  dashboard.totalCheckIns
                }
              />
            </div>
          </motion.section>

          {/* TOP EVENT */}

          <motion.section
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.15,
            }}
            className="relative overflow-hidden rounded-3xl bg-slate-950 p-6 text-white shadow-xl sm:p-7"
          >
            <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-brand-600/30 blur-3xl" />

            <div className="absolute -bottom-20 left-8 h-44 w-44 rounded-full bg-accent-400/10 blur-3xl" />

            <div className="relative">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-accent-400 text-slate-950">
                  <Trophy
                    size={20}
                  />
                </div>

                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                    Evento destacado
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Mayor cantidad de
                    reservas
                  </p>
                </div>
              </div>

              {dashboard.topEvent ? (
                <>
                  <h2 className="mt-8 text-2xl font-black leading-tight sm:text-3xl">
                    {
                      dashboard.topEvent
                        .title
                    }
                  </h2>

                  <div className="mt-7 grid grid-cols-3 gap-3">
                    <DarkMetric
                      label="Reservas"
                      value={
                        dashboard.topEvent
                          .reservations
                      }
                    />

                    <DarkMetric
                      label="Check-in"
                      value={
                        dashboard.topEvent
                          .checkIns
                      }
                    />

                    <DarkMetric
                      label="Capacidad"
                      value={
                        dashboard.topEvent
                          .capacity
                      }
                    />
                  </div>

                  <div className="mt-7">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-400">
                        Ocupación
                      </span>

                      <span className="font-black text-white">
                        {
                          dashboard.topEvent
                            .occupancyRate
                        }
                        %
                      </span>
                    </div>

                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                      <motion.div
                        initial={{
                          width: 0,
                        }}
                        animate={{
                          width: `${Math.min(
                            100,
                            dashboard.topEvent
                              .occupancyRate
                          )}%`,
                        }}
                        transition={{
                          duration: 0.7,
                        }}
                        className="h-full rounded-full bg-accent-400"
                      />
                    </div>
                  </div>

                  <Link
                    to={`/organizer/events/${dashboard.topEvent.id}/attendees`}
                    className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-brand-50"
                  >
                    Ver asistentes

                    <ArrowRight
                      size={16}
                    />
                  </Link>
                </>
              ) : (
                <div className="mt-12 py-8 text-center">
                  <Sparkles
                    size={32}
                    className="mx-auto text-brand-400"
                  />

                  <h2 className="mt-5 text-xl font-black">
                    Aún no hay reservas
                  </h2>

                  <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-slate-400">
                    Cuando tus eventos
                    comiencen a recibir
                    entradas, destacaremos
                    aquí el de mejor
                    rendimiento.
                  </p>
                </div>
              )}
            </div>
          </motion.section>
        </div>

        {/* ====================================================
            QUICK ACTIONS
            ==================================================== */}

        <section className="mt-6 grid gap-4 sm:grid-cols-2">
          <QuickAction
            to="/organizer/events"
            icon={CalendarDays}
            title="Administrar eventos"
            description="Edita, publica y consulta la asistencia de tus eventos."
          />

          <QuickAction
            to="/organizer/check-in"
            icon={CheckCircle2}
            title="Abrir check-in"
            description="Escanea códigos QR y registra asistentes."
          />
        </section>
      </div>
    </div>
  );
}

// ============================================================
// DASHBOARD CARD
// ============================================================

interface DashboardCardProps {
  icon: ElementType;
  label: string;
  value:
    | number
    | string;
  description: string;

  variant:
    | "blue"
    | "green"
    | "yellow"
    | "slate";
}

function DashboardCard({
  icon: Icon,
  label,
  value,
  description,
  variant,
}: DashboardCardProps) {
  const variants = {
    blue: {
      icon:
        "bg-brand-50 text-brand-600 dark:bg-brand-950/40 dark:text-brand-400",
    },

    green: {
      icon:
        "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400",
    },

    yellow: {
      icon:
        "bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400",
    },

    slate: {
      icon:
        "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
    },
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 sm:p-6"
    >
      <div
        className={`grid h-11 w-11 place-items-center rounded-xl ${variants[variant].icon}`}
      >
        <Icon
          size={20}
        />
      </div>

      <p className="mt-6 text-3xl font-black text-slate-950 dark:text-white">
        {value}
      </p>

      <p className="mt-1 text-sm font-black text-slate-700 dark:text-slate-200">
        {label}
      </p>

      <p className="mt-1 text-xs text-slate-400">
        {description}
      </p>
    </motion.div>
  );
}

// ============================================================
// EVENT COUNTER
// ============================================================

function EventCounter({
  label,
  value,
  dotClass = "bg-brand-500",
}: {
  label: string;
  value: number;
  dotClass?: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
      <div className="flex items-center gap-2">
        <span
          className={`h-2 w-2 rounded-full ${dotClass}`}
        />

        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
          {label}
        </span>
      </div>

      <p className="mt-3 text-2xl font-black text-slate-950 dark:text-white">
        {value}
      </p>
    </div>
  );
}

// ============================================================
// PROGRESS
// ============================================================

function ProgressBar({
  value,
  className = "",
}: {
  value: number;
  className?: string;
}) {
  return (
    <div
      className={`h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800 ${className}`}
    >
      <motion.div
        initial={{
          width: 0,
        }}
        animate={{
          width: `${Math.min(
            100,
            Math.max(
              0,
              value
            )
          )}%`,
        }}
        transition={{
          duration: 0.75,
        }}
        className="h-full rounded-full bg-linear-to-r from-brand-600 to-brand-400"
      />
    </div>
  );
}

// ============================================================
// MINI METRIC
// ============================================================

function MiniMetric({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
      <p className="text-xs font-bold text-slate-400">
        {title}
      </p>

      <p className="mt-2 text-xl font-black text-slate-950 dark:text-white">
        {value}
      </p>
    </div>
  );
}

// ============================================================
// DARK METRIC
// ============================================================

function DarkMetric({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl bg-white/10 p-3">
      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-2 text-xl font-black text-white">
        {value}
      </p>
    </div>
  );
}

// ============================================================
// QUICK ACTION
// ============================================================

function QuickAction({
  to,
  icon: Icon,
  title,
  description,
}: {
  to: string;
  icon: ElementType;
  title: string;
  description: string;
}) {
  return (
    <Link
      to={to}
      className="group flex items-center gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-brand-200 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-brand-900 sm:p-6"
    >
      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white dark:bg-brand-950/40 dark:text-brand-400">
        <Icon
          size={21}
        />
      </div>

      <div className="min-w-0">
        <p className="font-black text-slate-950 dark:text-white">
          {title}
        </p>

        <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </div>

      <ArrowRight
        size={18}
        className="ml-auto shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-brand-500"
      />
    </Link>
  );
}

export default OrganizerDashboardPage;