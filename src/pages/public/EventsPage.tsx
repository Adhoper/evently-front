import {
  useEffect,
  useState,
} from "react";

import EventCard from "../../components/EventCard";
import { getPublicEvents } from "../../services/eventService";
import type { Event } from "../../types/event";

function EventsPage() {
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
    <main className="min-h-[calc(100vh-72px)] py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
            Explora
          </span>

          <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">
            Eventos
          </h1>

          <p className="mt-4 text-lg text-zinc-500">
            Descubre todos los eventos
            disponibles en Evently.
          </p>
        </div>

        <div className="mt-12">
          {loading && (
            <p className="text-zinc-500">
              Cargando eventos...
            </p>
          )}

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
              {error}
            </div>
          )}

          {!loading &&
            !error &&
            events.length === 0 && (
              <div className="rounded-2xl border border-dashed border-zinc-300 bg-white py-16 text-center">
                <h2 className="text-xl font-bold">
                  No encontramos eventos
                </h2>

                <p className="mt-2 text-zinc-500">
                  Vuelve más adelante.
                </p>
              </div>
            )}

          {!loading &&
            !error &&
            events.length > 0 && (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {events.map(
                  (event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                    />
                  )
                )}
              </div>
            )}
        </div>
      </div>
    </main>
  );
}

export default EventsPage;