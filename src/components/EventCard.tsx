import {
  ArrowUpRight,
  CalendarDays,
  Clock3,
  MapPin,
} from "lucide-react";

import {
  motion,
} from "motion/react";

import {
  Link,
} from "react-router-dom";

import type {
  Event,
} from "../types/event";

import {
  formatEventDate,
} from "../utils/date";

interface EventCardProps {
  event: Event;
}

function EventCard({
  event,
}: EventCardProps) {
  return (
    <motion.article
      whileHover={{
        y: -6,
      }}
      transition={{
        duration: 0.2,
      }}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-shadow duration-300 hover:shadow-[0_22px_60px_rgba(15,23,42,0.12)]"
    >
      <Link
        to={`/events/${event.id}`}
        className="relative block aspect-16/10 overflow-hidden bg-slate-900"
      >
        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={event.title}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-linear-to-br from-brand-500 via-brand-700 to-slate-950">
            <div className="text-center">
              <span className="text-xl font-black tracking-[0.2em] text-white">
                EVENTLY
              </span>

              <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-accent-400" />
            </div>
          </div>
        )}

        <div className="absolute left-4 top-4 rounded-full border border-white/20 bg-white/90 dark:bg-slate-900/90 px-3 py-1.5 text-[11px] font-black uppercase tracking-wide text-brand-700 dark:text-brand-300 shadow-sm backdrop-blur">
          {event.categoryName}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h2 className="line-clamp-2 text-xl font-black leading-7 text-slate-950 dark:text-slate-50">
          {event.title}
        </h2>

        <div className="mt-5 space-y-3 text-sm text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2.5">
            <CalendarDays
              size={16}
              className="shrink-0 text-brand-500"
            />

            <span>
              {formatEventDate(
                event.date,
                {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }
              )}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <Clock3
              size={16}
              className="shrink-0 text-brand-500"
            />

            <span>
              {event.startTime.slice(
                0,
                5
              )}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <MapPin
              size={16}
              className="shrink-0 text-brand-500"
            />

            <span className="line-clamp-1">
              {event.location}
            </span>
          </div>
        </div>

        <Link
          to={`/events/${event.id}`}
          className="mt-6 inline-flex items-center justify-between rounded-xl bg-slate-50 dark:bg-slate-950 px-4 py-3 text-sm font-black text-slate-700 dark:text-slate-200 transition group-hover:bg-brand-50 group-hover:text-brand-700"
        >
          Ver evento

          <ArrowUpRight
            size={17}
          />
        </Link>
      </div>
    </motion.article>
  );
}

export default EventCard;