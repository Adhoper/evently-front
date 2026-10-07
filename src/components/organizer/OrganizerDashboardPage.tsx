import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Layers3,
  ArrowRight,
  Sparkles,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

import {
  motion,
} from "motion/react";

import {
  getMyEvents,
} from "../../services/eventService";

import {
  useAuth,
} from "../../hooks/useAuth";

import type {
  Event,
} from "../../types/event";

import StatCard from "../../components/organizer/StatCard";
import EventStatusBadge from "../../components/EventStatusBadge";

function OrganizerDashboardPage() {
  const {
    user,
  } = useAuth();

  const [
    events,
    setEvents,
  ] = useState<Event[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState<string | null>(
    null
  );

  useEffect(() => {
    const loadEvents =
      async () => {
        try {
          const data =
            await getMyEvents();

          setEvents(data);
        } catch (error) {
          console.error(
            error
          );

          setError(
            "No fue posible cargar tus eventos."
          );
        } finally {
          setLoading(false);
        }
      };

    loadEvents();
  }, []);

  const stats =
    useMemo(() => {
      return {
        total:
          events.length,

        published:
          events.filter(
            (event) =>
              event.status ===
              "Published"
          ).length,

        draft:
          events.filter(
            (event) =>
              event.status ===
              "Draft"
          ).length,

        cancelled:
          events.filter(
            (event) =>
              event.status ===
              "Cancelled"
          ).length,
      };
    }, [events]);

  if (loading) {
    return (
      <DashboardSkeleton />
    );
  }

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}

        <motion.div
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end"
        >
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 dark:bg-brand-900/25 px-3 py-1.5 text-xs font-bold text-brand-700 dark:text-brand-300">
              <Sparkles
                size={14}
              />

              Panel del organizador
            </div>

            <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950 dark:text-slate-50 sm:text-4xl">
              Hola,{" "}
              {
                user?.firstName
              }
              .
            </h1>

            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Aquí tienes un
              resumen de tus
              eventos.
            </p>
          </div>

          <Link
            to="/organizer/events"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-brand-600/20 transition hover:-translate-y-0.5 hover:bg-brand-700"
          >
            Ver mis eventos

            <ArrowRight
              size={17}
            />
          </Link>
        </motion.div>

        {error && (
          <div className="mt-8 rounded-2xl border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 p-5 text-sm font-semibold text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        {/* STATISTICS */}

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren:
                  0.07,
              },
            },
          }}
          className="mt-9 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          <motion.div
            variants={{
              hidden: {
                opacity: 0,
                y: 15,
              },
              visible: {
                opacity: 1,
                y: 0,
              },
            }}
          >
            <StatCard
              title="Total de eventos"
              value={
                stats.total
              }
              icon={
                Layers3
              }
              description="Todos tus eventos creados"
              variant="slate"
            />
          </motion.div>

          <motion.div
            variants={{
              hidden: {
                opacity: 0,
                y: 15,
              },
              visible: {
                opacity: 1,
                y: 0,
              },
            }}
          >
            <StatCard
              title="Publicados"
              value={
                stats.published
              }
              icon={
                CheckCircle2
              }
              description="Visibles actualmente al público"
              variant="blue"
            />
          </motion.div>

          <motion.div
            variants={{
              hidden: {
                opacity: 0,
                y: 15,
              },
              visible: {
                opacity: 1,
                y: 0,
              },
            }}
          >
            <StatCard
              title="Borradores"
              value={
                stats.draft
              }
              icon={
                Clock3
              }
              description="Eventos pendientes de publicar"
              variant="yellow"
            />
          </motion.div>

          <motion.div
            variants={{
              hidden: {
                opacity: 0,
                y: 15,
              },
              visible: {
                opacity: 1,
                y: 0,
              },
            }}
          >
            <StatCard
              title="Cancelados"
              value={
                stats.cancelled
              }
              icon={
                CalendarDays
              }
              description="Eventos que fueron cancelados"
              variant="green"
            />
          </motion.div>
        </motion.div>

        {/* RECENT EVENTS */}

        <section className="mt-10 overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
            <div>
              <h2 className="text-lg font-black text-slate-950 dark:text-slate-50">
                Eventos recientes
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Tus últimos
                eventos creados.
              </p>
            </div>

            <Link
              to="/organizer/events"
              className="text-sm font-bold text-brand-600 transition hover:text-brand-700"
            >
              Ver todos
            </Link>
          </div>

          {events.length ===
          0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 dark:bg-brand-900/25 text-brand-600">
                <CalendarDays
                  size={24}
                />
              </div>

              <h3 className="mt-5 text-lg font-black">
                Todavía no tienes
                eventos
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
                Cuando crees tu
                primer evento,
                aparecerá aquí.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {events
                .slice(0, 5)
                .map(
                  (
                    event,
                    index
                  ) => (
                    <motion.div
                      key={
                        event.id
                      }
                      initial={{
                        opacity: 0,
                        x: -10,
                      }}
                      animate={{
                        opacity: 1,
                        x: 0,
                      }}
                      transition={{
                        delay:
                          index *
                          0.05,
                      }}
                      className="flex flex-col gap-4 px-6 py-5 transition hover:bg-slate-50 dark:hover:bg-slate-800/70 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex min-w-0 items-center gap-4">
                        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand-50 dark:bg-brand-900/25 text-brand-600">
                          <CalendarDays
                            size={
                              20
                            }
                          />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate font-bold text-slate-950 dark:text-slate-50">
                            {
                              event.title
                            }
                          </p>

                          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            {
                              event.categoryName
                            }{" "}
                            ·{" "}
                            {new Date(
                              event.date
                            ).toLocaleDateString(
                              "es-DO"
                            )}
                          </p>
                        </div>
                      </div>

                      <EventStatusBadge
                        status={
                          event.status
                        }
                      />
                    </motion.div>
                  )
                )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-7xl animate-pulse">
        <div className="h-8 w-56 rounded-lg bg-slate-200 dark:bg-slate-700" />

        <div className="mt-4 h-4 w-80 max-w-full rounded bg-slate-200 dark:bg-slate-700" />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map(
            (item) => (
              <div
                key={item}
                className="h-40 rounded-2xl bg-slate-200 dark:bg-slate-700"
              />
            )
          )}
        </div>

        <div className="mt-10 h-80 rounded-3xl bg-slate-200 dark:bg-slate-700" />
      </div>
    </div>
  );
}

export default OrganizerDashboardPage;