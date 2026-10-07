import {
  useEffect,
  useState,
} from "react";

import type {
  ElementType,
} from "react";

import {
  ArrowRight,
  CalendarCheck,
  CalendarDays,
  Search,
  Sparkles,
  TicketCheck,
} from "lucide-react";

import {
  motion,
} from "motion/react";

import {
  Link,
} from "react-router-dom";

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

function HomePage() {
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
  // RENDER
  // ============================================================

  return (
    <main className="overflow-hidden">
      {/* ======================================================
          HERO
          ====================================================== */}

      <section className="relative bg-white">
        {/* DECORATIVE BLUE LIGHT */}

        <motion.div
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="pointer-events-none absolute -right-32 top-10 h-[420px] w-[420px] rounded-full bg-brand-200/50 blur-3xl"
        />

        {/* DECORATIVE YELLOW LIGHT */}

        <motion.div
          animate={{
            x: [0, -25, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="pointer-events-none absolute -left-40 bottom-0 h-[350px] w-[350px] rounded-full bg-accent-300/20 blur-3xl"
        />

        <div className="relative mx-auto grid min-h-[calc(100vh-72px)] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.1fr_.9fr] lg:px-8 lg:py-24">
          {/* HERO CONTENT */}

          <motion.div
            initial={{
              opacity: 0,
              y: 25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.55,
            }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-brand-50 px-3 py-1.5 text-xs font-black text-brand-700">
              <Sparkles
                size={14}
              />

              Encuentra algo que valga
              la pena vivir
            </div>

            <h1 className="mt-6 max-w-3xl text-[clamp(3rem,8vw,6.3rem)] font-black leading-[0.94] tracking-[-0.055em] text-slate-950">
              Tu próximo

              <span className="relative ml-3 inline-block text-brand-600">
                evento

                <span className="absolute -bottom-2 left-1/2 h-2 w-[70%] -translate-x-1/2 rounded-full bg-accent-400/80" />
              </span>

              <br />

              empieza aquí.
            </h1>

            <p className="mt-8 max-w-xl text-base leading-7 text-slate-500 sm:text-lg sm:leading-8">
              Descubre experiencias,
              actividades y encuentros,
              y lleva tus entradas
              contigo desde un solo
              lugar.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/events"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-black text-white shadow-xl shadow-brand-600/20 transition hover:-translate-y-0.5 hover:bg-brand-700"
              >
                Explorar eventos

                <ArrowRight
                  size={17}
                />
              </Link>

              <a
                href="#featured"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-black text-slate-700 transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
              >
                <Search
                  size={17}
                />

                Ver destacados
              </a>
            </div>
          </motion.div>

          {/* ==================================================
              HERO VISUAL
              ================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.95,
              x: 20,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              x: 0,
            }}
            transition={{
              delay: 0.15,
              duration: 0.6,
            }}
            className="relative mx-auto hidden w-full max-w-lg lg:block"
          >
            <div className="rotate-2 rounded-[32px] border border-white/60 bg-gradient-to-br from-brand-500 via-brand-700 to-slate-950 p-7 shadow-[0_40px_100px_rgba(37,99,235,.22)]">
              <div className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-xl">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-brand-100">
                  Próxima experiencia
                </p>

                <div className="mt-14">
                  <p className="text-4xl font-black leading-tight text-white">
                    Descubre.

                    <br />

                    Conecta.

                    <br />

                    Disfruta.
                  </p>
                </div>

                <div className="mt-14 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-white/10 p-4 text-white">
                    <CalendarDays
                      size={21}
                    />

                    <p className="mt-3 text-xs text-brand-100">
                      Eventos
                    </p>

                    <p className="mt-1 font-black">
                      Encuentra
                    </p>
                  </div>

                  <div className="rounded-2xl bg-accent-400 p-4 text-slate-950">
                    <TicketCheck
                      size={21}
                    />

                    <p className="mt-3 text-xs font-bold text-slate-700">
                      Entradas
                    </p>

                    <p className="mt-1 font-black">
                      Disfruta
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ======================================================
          BENEFITS
          ====================================================== */}

      <section className="border-y border-slate-200 bg-slate-950 py-7">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 px-4 sm:grid-cols-3 sm:px-6 lg:px-8">
          <Feature
            icon={Search}
            title="Descubre"
            text="Encuentra experiencias nuevas."
          />

          <Feature
            icon={
              TicketCheck
            }
            title="Participa"
            text="Gestiona tus entradas fácilmente."
          />

          <Feature
            icon={
              CalendarCheck
            }
            title="Organiza"
            text="Publica tus propios eventos."
          />
        </div>
      </section>

      {/* ======================================================
          FEATURED EVENTS
          ====================================================== */}

      <section
        id="featured"
        className="bg-slate-50 py-20 sm:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <span className="text-xs font-black uppercase tracking-[0.2em] text-brand-600">
                Descubre
              </span>

              <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                Próximos eventos
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
                Explora algunos de los
                eventos disponibles en
                Evently.
              </p>
            </div>

            <Link
              to="/events"
              className="inline-flex items-center gap-2 text-sm font-black text-brand-600 transition hover:gap-3"
            >
              Ver todos

              <ArrowRight
                size={17}
              />
            </Link>
          </div>

          <div className="mt-10">
            {loading ? (
              <EventsSkeleton />
            ) : error ? (
              <ErrorState
                onRetry={
                  handleRetry
                }
              />
            ) : events.length ===
              0 ? (
              <EmptyState />
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {events
                  .slice(0, 6)
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
                          y: 20,
                        }}
                        whileInView={{
                          opacity: 1,
                          y: 0,
                        }}
                        viewport={{
                          once: true,
                          amount:
                            0.2,
                        }}
                        transition={{
                          delay:
                            index *
                            0.05,
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
        </div>
      </section>

      {/* ======================================================
          CTA
          ====================================================== */}

      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[32px] bg-slate-950 px-6 py-12 text-white sm:px-10 sm:py-16 lg:px-16">
            <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-brand-600/40 blur-3xl" />

            <div className="absolute -bottom-32 left-10 h-60 w-60 rounded-full bg-accent-400/20 blur-3xl" />

            <div className="relative max-w-2xl">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-accent-400 text-slate-950">
                <Sparkles
                  size={21}
                />
              </div>

              <h2 className="mt-6 text-3xl font-black tracking-tight sm:text-4xl">
                ¿Tienes algo que reunir
                personas?
              </h2>

              <p className="mt-4 max-w-xl leading-7 text-slate-300">
                Convierte tu cuenta en
                organizador y crea tus
                propios eventos desde
                Evently.
              </p>

              <Link
                to="/account"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-black text-slate-950 transition hover:-translate-y-0.5 hover:bg-brand-50"
              >
                Comenzar

                <ArrowRight
                  size={17}
                />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

// ============================================================
// FEATURE
// ============================================================

interface FeatureProps {
  icon: ElementType;
  title: string;
  text: string;
}

function Feature({
  icon: Icon,
  title,
  text,
}: FeatureProps) {
  return (
    <div className="flex items-center gap-4 py-2">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-600 text-white">
        <Icon size={18} />
      </div>

      <div>
        <p className="text-sm font-black text-white">
          {title}
        </p>

        <p className="mt-0.5 text-xs text-slate-400">
          {text}
        </p>
      </div>
    </div>
  );
}

// ============================================================
// SKELETON
// ============================================================

function EventsSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {[1, 2, 3].map(
        (item) => (
          <div
            key={item}
            className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
          >
            <div className="aspect-[16/10] animate-pulse bg-slate-200" />

            <div className="space-y-4 p-6">
              <div className="h-6 w-2/3 animate-pulse rounded bg-slate-200" />

              <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200" />

              <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />

              <div className="h-11 w-full animate-pulse rounded-xl bg-slate-200" />
            </div>
          </div>
        )
      )}
    </div>
  );
}

export default HomePage;