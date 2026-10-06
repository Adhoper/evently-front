import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router-dom";


import type { EventDetail } from "../../types/event";
import { getPublicEventById  } from "../../services/eventService";

function EventDetailPage() {
  const { id } = useParams();

  const [event, setEvent] =
    useState<EventDetail | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  const [notFound, setNotFound] =
    useState(false);

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
      <main className="min-h-screen bg-zinc-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="aspect-16/6 rounded-3xl bg-zinc-200" />

            <div className="mt-10 h-12 w-2/3 rounded bg-zinc-200" />
          </div>
        </div>
      </main>
    );
  }

  if (notFound || !event) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center px-4 text-center">
        <div>
          <span className="text-sm font-bold uppercase tracking-widest text-zinc-400">
            404
          </span>

          <h1 className="mt-3 text-3xl font-black">
            Evento no encontrado
          </h1>

          <p className="mt-3 text-zinc-500">
            Este evento no existe o ya
            no está disponible.
          </p>

          <Link
            to="/events"
            className="mt-7 inline-flex rounded-xl bg-zinc-950 px-5 py-3 text-sm font-bold text-white"
          >
            Volver a eventos
          </Link>
        </div>
      </main>
    );
  }

  const formattedDate =
    new Date(
      event.date
    ).toLocaleDateString(
      "es-DO",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    );

  return (
    <main className="pb-24 pt-10 sm:pt-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link
          to="/events"
          className="mb-6 inline-flex text-sm font-semibold text-zinc-500 transition hover:text-zinc-950"
        >
          ← Volver a eventos
        </Link>

        <div className="aspect-16/7 overflow-hidden rounded-3xl bg-zinc-900 shadow-sm">
          {event.imageUrl ? (
            <img
              src={event.imageUrl}
              alt={event.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-linear-to-br from-zinc-700 via-zinc-900 to-black">
              <span className="text-2xl font-black tracking-[0.25em] text-white sm:text-4xl">
                EVENTLY
              </span>
            </div>
          )}
        </div>

        <div className="mx-auto mt-10 max-w-4xl">
          <span className="inline-flex rounded-full bg-zinc-200 px-3 py-1 text-xs font-bold uppercase tracking-wide text-zinc-600">
            {event.categoryName}
          </span>

          <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
            {event.title}
          </h1>

          <div className="mt-8 grid gap-4 border-y border-zinc-200 py-7 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wide text-zinc-400">
                Fecha
              </span>

              <p className="mt-1 font-semibold">
                {formattedDate}
              </p>
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wide text-zinc-400">
                Hora
              </span>

              <p className="mt-1 font-semibold">
                {event.startTime.slice(
                  0,
                  5
                )}
              </p>
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wide text-zinc-400">
                Lugar
              </span>

              <p className="mt-1 font-semibold">
                {event.location}
              </p>
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wide text-zinc-400">
                Capacidad
              </span>

              <p className="mt-1 font-semibold">
                {event.capacity} personas
              </p>
            </div>
          </div>

          <section className="mt-10">
            <h2 className="text-2xl font-black">
              Sobre el evento
            </h2>

            <p className="mt-4 whitespace-pre-line text-base leading-8 text-zinc-600">
              {event.description}
            </p>
          </section>

          <section className="mt-12 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-black">
              ¿Quieres asistir?
            </h2>

            <p className="mt-2 text-zinc-500">
              Inicia sesión para obtener
              tu entrada.
            </p>

            <button className="mt-6 rounded-xl bg-zinc-950 px-6 py-3 text-sm font-bold text-white transition hover:bg-zinc-800">
              Obtener entrada
            </button>
          </section>
        </div>
      </div>
    </main>
  );
}

export default EventDetailPage;