import {
  useEffect,
  useState,
} from "react";

import EventCard from "../../components/EventCard";
import { getPublicEvents } from "../../services/eventService";
import type { Event } from "../../types/event";

function HomePage() {
  const [events, setEvents] =
    useState<Event[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    const loadEvents =
      async () => {
        try {
          setLoading(true);

          const data =
            await getPublicEvents();

          setEvents(data);
        } catch (error) {
          console.error(error);

          setError(
            "No fue posible cargar los eventos."
          );
        } finally {
          setLoading(false);
        }
      };

    loadEvents();
  }, []);

  return (
    <main>
      {/* HERO */}
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(113,113,122,0.12),transparent_40%)]" />

        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-zinc-500">
              Descubre · Conecta · Disfruta
            </span>

            <h1 className="mt-5 text-5xl font-black tracking-tight text-zinc-950 sm:text-6xl lg:text-7xl">
              Encuentra tu próximo
              evento.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-500">
              Descubre experiencias,
              actividades y eventos que
              valen la pena vivir.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href="#events"
                className="rounded-xl bg-zinc-950 px-6 py-3 text-sm font-bold text-white transition hover:bg-zinc-800"
              >
                Explorar eventos
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* EVENTS */}
      <section
        id="events"
        className="py-20 sm:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex items-end justify-between gap-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                Eventos
              </span>

              <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                Próximos eventos
              </h2>
            </div>
          </div>

          {loading && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map(
                (item) => (
                  <div
                    key={item}
                    className="animate-pulse overflow-hidden rounded-2xl border border-zinc-200 bg-white"
                  >
                    <div className="aspect-[16/10] bg-zinc-200" />

                    <div className="space-y-4 p-5">
                      <div className="h-5 w-24 rounded bg-zinc-200" />
                      <div className="h-7 w-3/4 rounded bg-zinc-200" />
                      <div className="h-4 w-1/2 rounded bg-zinc-200" />
                    </div>
                  </div>
                )
              )}
            </div>
          )}

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          {!loading &&
            !error &&
            events.length === 0 && (
              <div className="rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-16 text-center">
                <h3 className="text-xl font-bold">
                  No hay eventos
                  disponibles
                </h3>

                <p className="mt-2 text-zinc-500">
                  Próximamente encontrarás
                  nuevos eventos.
                </p>
              </div>
            )}

          {!loading &&
            !error &&
            events.length > 0 && (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {events
                  .slice(0, 6)
                  .map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                    />
                  ))}
              </div>
            )}
        </div>
      </section>
    </main>
  );
}

export default HomePage;