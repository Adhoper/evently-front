import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

import {
  motion,
} from "motion/react";

import EventCard from "../../components/EventCard";

import {
  EmptyState,
  ErrorState,
} from "../../components/ui/PageState";

import {
  getPublicEvents,
} from "../../services/eventService";

import type {
  Event,
} from "../../types/event";

function EventsPage() {
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
  ] = useState(false);

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    category,
    setCategory,
  ] = useState("all");

  // ============================================================
  // INITIAL LOAD
  // ============================================================

  useEffect(() => {
    let cancelled = false;

    getPublicEvents()
      .then((data) => {
        if (cancelled) {
          return;
        }

        setEvents(data);
        setError(false);
      })
      .catch((requestError) => {
        if (cancelled) {
          return;
        }

        console.error(
          requestError
        );

        setError(true);
      })
      .finally(() => {
        if (cancelled) {
          return;
        }

        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // ============================================================
  // RETRY
  // ============================================================

  const handleRetry =
    async () => {
      try {
        setLoading(true);
        setError(false);

        const data =
          await getPublicEvents();

        setEvents(data);
      } catch (
        requestError
      ) {
        console.error(
          requestError
        );

        setError(true);
      } finally {
        setLoading(false);
      }
    };

  // ============================================================
  // CATEGORIES
  // ============================================================

  const categories =
    useMemo(() => {
      return Array.from(
        new Set(
          events.map(
            (event) =>
              event.categoryName
          )
        )
      ).sort();
    }, [events]);

  // ============================================================
  // FILTER EVENTS
  // ============================================================

  const filteredEvents =
    useMemo(() => {
      const normalizedSearch =
        search
          .trim()
          .toLowerCase();

      return events.filter(
        (event) => {
          const matchesSearch =
            !normalizedSearch ||
            event.title
              .toLowerCase()
              .includes(
                normalizedSearch
              ) ||
            event.location
              .toLowerCase()
              .includes(
                normalizedSearch
              );

          const matchesCategory =
            category === "all" ||
            event.categoryName ===
              category;

          return (
            matchesSearch &&
            matchesCategory
          );
        }
      );
    }, [
      events,
      search,
      category,
    ]);

  const hasFilters =
    search.trim().length > 0 ||
    category !== "all";

  const clearFilters = () => {
    setSearch("");
    setCategory("all");
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* ======================================================
          HEADER
          ====================================================== */}

      <section className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-18 lg:px-8">
          <motion.div
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="max-w-2xl"
          >
            <span className="text-xs font-black uppercase tracking-[0.2em] text-brand-600">
              Explora
            </span>

            <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 dark:text-slate-50 sm:text-5xl">
              Encuentra tu próximo
              evento.
            </h1>

            <p className="mt-4 text-base leading-7 text-slate-500 dark:text-slate-400 sm:text-lg">
              Busca por nombre,
              ubicación o explora por
              categoría.
            </p>
          </motion.div>

          {/* ==================================================
              SEARCH / FILTERS
              ================================================== */}

          <div className="mt-9 grid gap-3 lg:grid-cols-[1fr_260px]">
            {/* SEARCH */}

            <div className="relative">
              <Search
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="search"
                value={search}
                onChange={(
                  event
                ) =>
                  setSearch(
                    event.target
                      .value
                  )
                }
                placeholder="Buscar evento o ubicación..."
                className="h-13 w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 pl-12 pr-4 text-sm font-medium text-slate-950 dark:text-slate-50 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-brand-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-brand-500/10"
              />
            </div>

            {/* CATEGORY */}

            <div className="relative">
              <SlidersHorizontal
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-brand-500"
              />

              <select
                value={
                  category
                }
                onChange={(
                  event
                ) =>
                  setCategory(
                    event.target
                      .value
                  )
                }
                className="h-13 w-full cursor-pointer appearance-none rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 pl-12 pr-10 text-sm font-bold text-slate-700 dark:text-slate-200 outline-none transition hover:border-slate-300 focus:border-brand-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-brand-500/10"
              >
                <option value="all">
                  Todas las categorías
                </option>

                {categories.map(
                  (item) => (
                    <option
                      key={
                        item
                      }
                      value={
                        item
                      }
                    >
                      {
                        item
                      }
                    </option>
                  )
                )}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
          EVENTS
          ====================================================== */}

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {!loading &&
            !error && (
              <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                  <strong className="text-slate-950 dark:text-slate-50">
                    {
                      filteredEvents.length
                    }
                  </strong>{" "}
                  evento
                  {filteredEvents.length !==
                  1
                    ? "s"
                    : ""}{" "}
                  encontrado
                  {filteredEvents.length !==
                  1
                    ? "s"
                    : ""}
                </p>

                {hasFilters && (
                  <button
                    type="button"
                    onClick={
                      clearFilters
                    }
                    className="inline-flex w-fit items-center gap-2 text-sm font-black text-brand-600 transition hover:text-brand-700"
                  >
                    <X
                      size={16}
                    />

                    Limpiar filtros
                  </button>
                )}
              </div>
            )}

          {loading ? (
            <EventsPageSkeleton />
          ) : error ? (
            <ErrorState
              onRetry={
                handleRetry
              }
            />
          ) : filteredEvents.length ===
            0 ? (
            <EmptyState
              title="No encontramos resultados"
              description={
                hasFilters
                  ? "Prueba cambiando los filtros o utilizando otra búsqueda."
                  : "Todavía no hay eventos publicados."
              }
            />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredEvents.map(
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
                      y: 18,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay:
                        Math.min(
                          index *
                            0.04,
                          0.28
                        ),
                    }}
                  >
                    <EventCard
                      event={
                        event
                      }
                    />
                  </motion.div>
                )
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

// ============================================================
// SKELETON
// ============================================================

function EventsPageSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {[
        1, 2, 3, 4, 5, 6,
      ].map((item) => (
        <div
          key={item}
          className="overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm"
        >
          <div className="aspect-16/10 animate-pulse bg-slate-200 dark:bg-slate-700" />

          <div className="space-y-4 p-6">
            <div className="h-6 w-2/3 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />

            <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />

            <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />

            <div className="h-11 w-full animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default EventsPage;