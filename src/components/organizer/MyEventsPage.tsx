import { useEffect, useState } from "react";

import { CalendarDays, CalendarPlus, Link, MapPin, Users } from "lucide-react";

import { motion } from "motion/react";

import { getMyEvents } from "../../services/eventService";

import type { Event } from "../../types/event";

import EventStatusBadge from "../../components/EventStatusBadge";

function MyEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await getMyEvents();

        setEvents(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{
            opacity: 0,
            y: 12,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end"
        >
          <div>
            <span className="text-xs font-black uppercase tracking-[0.2em] text-brand-600">
              Organización
            </span>

            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              Mis eventos
            </h1>

            <p className="mt-2 text-slate-500">
              Consulta y administra los eventos que has creado.
            </p>
          </div>

          <Link
            to="/organizer/events/create"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-brand-600/20 transition hover:-translate-y-0.5 hover:bg-brand-700"
          >
            <CalendarPlus size={18} />
            Crear evento
          </Link>
        </motion.div>

        {loading ? (
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-72 animate-pulse rounded-3xl bg-slate-200"
              />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-dashed border-slate-300 bg-white py-20 text-center">
            <CalendarDays className="mx-auto text-brand-500" size={34} />

            <h2 className="mt-5 text-xl font-black">No tienes eventos</h2>

            <p className="mt-2 text-slate-500">
              Muy pronto crearemos tu primer evento desde esta misma sección.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {events.map((event, index) => (
              <motion.article
                key={event.id}
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: index * 0.06,
                }}
                whileHover={{
                  y: -5,
                }}
                className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-xl"
              >
                <div className="relative aspect-16/8 overflow-hidden bg-slate-900">
                  {event.imageUrl ? (
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      className="h-full w-full object-cover transition duration-500 hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-linear-to-br from-brand-700 via-brand-800 to-slate-950">
                      <span className="font-black tracking-[0.2em] text-white">
                        EVENTLY
                      </span>
                    </div>
                  )}

                  <div className="absolute left-4 top-4">
                    <EventStatusBadge status={event.status} />
                  </div>
                </div>

                <div className="p-6">
                  <span className="text-xs font-black uppercase tracking-[0.15em] text-brand-600">
                    {event.categoryName}
                  </span>

                  <h2 className="mt-2 line-clamp-2 text-xl font-black text-slate-950">
                    {event.title}
                  </h2>

                  <div className="mt-5 space-y-3 text-sm text-slate-500">
                    <div className="flex items-center gap-2">
                      <CalendarDays size={16} className="text-brand-500" />

                      {new Date(event.date).toLocaleDateString("es-DO", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}

                      {" · "}

                      {event.startTime.slice(0, 5)}
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-brand-500" />

                      {event.location}
                    </div>

                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-brand-500" />
                      {event.capacity} personas
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyEventsPage;
