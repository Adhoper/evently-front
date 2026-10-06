import { Link } from "react-router-dom";
import type { Event } from "../types/event";

interface EventCardProps {
  event: Event;
}

function EventCard({
  event,
}: EventCardProps) {
  const eventDate =
    new Date(event.date);

  const formattedDate =
    eventDate.toLocaleDateString(
      "es-DO",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );

  return (
    <article className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="aspect-[16/10] overflow-hidden bg-zinc-900">
        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={event.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-950">
            <span className="text-lg font-black tracking-[0.2em] text-white">
              EVENTLY
            </span>
          </div>
        )}
      </div>

      <div className="p-5">
        <span className="inline-flex rounded-full bg-zinc-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-zinc-600">
          {event.categoryName}
        </span>

        <h3 className="mt-4 text-xl font-bold text-zinc-950">
          {event.title}
        </h3>

        <div className="mt-4 space-y-2 text-sm text-zinc-500">
          <p>
            {formattedDate} ·{" "}
            {event.startTime.slice(
              0,
              5
            )}
          </p>

          <p>{event.location}</p>
        </div>

        <Link
          to={`/events/${event.id}`}
          className="mt-6 inline-flex items-center text-sm font-bold text-zinc-950 transition hover:gap-2"
        >
          Ver evento
          <span className="ml-2">
            →
          </span>
        </Link>
      </div>
    </article>
  );
}

export default EventCard;