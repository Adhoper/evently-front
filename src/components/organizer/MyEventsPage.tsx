import {
  useEffect,
  useState,
} from "react";

import {
  CalendarDays,
  CalendarPlus,
  Edit3,
  ExternalLink,
  MapPin,
  Rocket,
  Trash2,
  Users,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

import {
  motion,
} from "motion/react";

import {
  toast,
} from "sonner";

import axios from "axios";

import {
  cancelEvent,
  getMyEvents,
  publishEvent,
} from "../../services/eventService";

import type {
  Event,
} from "../../types/event";

import EventStatusBadge from "../../components/EventStatusBadge";
import ConfirmModal from "../../components/ui/ConfirmModal";

function MyEventsPage() {
  const [
    events,
    setEvents,
  ] = useState<Event[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    selectedEvent,
    setSelectedEvent,
  ] = useState<Event | null>(
    null
  );

  const [
    modalAction,
    setModalAction,
  ] =
    useState<
      "publish" |
      "cancel" |
      null
    >(null);

  const [
    processing,
    setProcessing,
  ] = useState(false);

// ============================================================
// LOAD EVENTS
// ============================================================

const loadEvents = async () => {
  try {
    const data = await getMyEvents();

    setEvents(data);
  } catch (error) {
    console.error(error);

    toast.error(
      "No fue posible cargar tus eventos."
    );
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  let isMounted = true;

  getMyEvents()
    .then((data) => {
      if (isMounted) {
        setEvents(data);
      }
    })
    .catch((error) => {
      console.error(error);

      if (isMounted) {
        toast.error(
          "No fue posible cargar tus eventos."
        );
      }
    })
    .finally(() => {
      if (isMounted) {
        setLoading(false);
      }
    });

  return () => {
    isMounted = false;
  };
}, []);

  // ============================================================
  // MODAL
  // ============================================================

  const openPublishModal = (
    event: Event
  ) => {
    setSelectedEvent(event);
    setModalAction(
      "publish"
    );
  };

  const openCancelModal = (
    event: Event
  ) => {
    setSelectedEvent(event);
    setModalAction(
      "cancel"
    );
  };

  const closeModal = () => {
    if (processing) {
      return;
    }

    setSelectedEvent(null);
    setModalAction(null);
  };

  // ============================================================
  // PUBLISH / CANCEL
  // ============================================================

  const handleConfirmAction =
    async () => {
      if (
        !selectedEvent ||
        !modalAction
      ) {
        return;
      }

      try {
        setProcessing(true);

        if (
          modalAction ===
          "publish"
        ) {
          await publishEvent(
            selectedEvent.id
          );

          toast.success(
            "Evento publicado correctamente.",
            {
              description:
                "Ya está visible para los usuarios.",
            }
          );
        }

        if (
          modalAction ===
          "cancel"
        ) {
          await cancelEvent(
            selectedEvent.id
          );

          toast.warning(
            "Evento cancelado.",
            {
              description:
                "Ya no aparecerá en el catálogo público.",
            }
          );
        }

        await loadEvents();

        setSelectedEvent(null);
        setModalAction(null);
      } catch (error) {
        console.error(
          error
        );

        if (
          axios.isAxiosError(
            error
          )
        ) {
          toast.error(
            "No fue posible completar la acción.",
            {
              description:
                error.response
                  ?.data
                  ?.message,
            }
          );

          return;
        }

        toast.error(
          "Ocurrió un error inesperado."
        );
      } finally {
        setProcessing(false);
      }
    };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <>
      <div className="px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
        <div className="mx-auto max-w-7xl">
          {/* HEADER */}

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

              <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                Mis eventos
              </h1>

              <p className="mt-2 text-slate-500">
                Consulta y administra
                los eventos que has
                creado.
              </p>
            </div>

            <Link
              to="/organizer/events/create"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-brand-600/20 transition hover:-translate-y-0.5 hover:bg-brand-700"
            >
              <CalendarPlus
                size={18}
              />

              Crear evento
            </Link>
          </motion.div>

          {/* LOADING */}

          {loading ? (
            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3].map(
                (item) => (
                  <div
                    key={item}
                    className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
                  >
                    <div className="aspect-[16/8] animate-pulse bg-slate-200" />

                    <div className="space-y-4 p-6">
                      <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />

                      <div className="h-7 w-3/4 animate-pulse rounded bg-slate-200" />

                      <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200" />

                      <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />
                    </div>
                  </div>
                )
              )}
            </div>
          ) : events.length ===
            0 ? (
            // =================================================
            // EMPTY STATE
            // =================================================

            <motion.div
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="mt-10 rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center shadow-sm"
            >
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-brand-50 text-brand-600">
                <CalendarDays
                  size={28}
                />
              </div>

              <h2 className="mt-5 text-xl font-black text-slate-950">
                Todavía no tienes
                eventos
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Crea tu primer evento
                y comienza a
                administrarlo desde
                Evently.
              </p>

              <Link
                to="/organizer/events/create"
                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-brand-600/20 transition hover:-translate-y-0.5 hover:bg-brand-700"
              >
                <CalendarPlus
                  size={18}
                />

                Crear mi primer evento
              </Link>
            </motion.div>
          ) : (
            // =================================================
            // EVENTS GRID
            // =================================================

            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {events.map(
                (
                  event,
                  index
                ) => (
                  <motion.article
                    key={
                      event.id
                    }
                    initial={{
                      opacity: 0,
                      y: 20,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay:
                        index *
                        0.05,
                    }}
                    whileHover={{
                      y: -5,
                    }}
                    className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl"
                  >
                    {/* IMAGE */}

                    <div className="relative aspect-[16/8] overflow-hidden bg-slate-900">
                      {event.imageUrl ? (
                        <img
                          src={
                            event.imageUrl
                          }
                          alt={
                            event.title
                          }
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-brand-600 via-brand-800 to-slate-950">
                          <div className="text-center">
                            <span className="text-lg font-black tracking-[0.2em] text-white">
                              EVENTLY
                            </span>

                            <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-accent-400" />
                          </div>
                        </div>
                      )}

                      {/* STATUS */}

                      <div className="absolute left-4 top-4">
                        <EventStatusBadge
                          status={
                            event.status
                          }
                        />
                      </div>
                    </div>

                    {/* CONTENT */}

                    <div className="p-6">
                      <span className="text-xs font-black uppercase tracking-[0.15em] text-brand-600">
                        {
                          event.categoryName
                        }
                      </span>

                      <h2 className="mt-2 line-clamp-2 min-h-[56px] text-xl font-black leading-7 text-slate-950">
                        {
                          event.title
                        }
                      </h2>

                      {/* DETAILS */}

                      <div className="mt-5 space-y-3 text-sm text-slate-500">
                        <div className="flex items-center gap-2.5">
                          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600">
                            <CalendarDays
                              size={
                                15
                              }
                            />
                          </div>

                          <span>
                            {new Date(
                              event.date
                            ).toLocaleDateString(
                              "es-DO",
                              {
                                day: "2-digit",
                                month:
                                  "short",
                                year: "numeric",
                              }
                            )}

                            {" · "}

                            {event.startTime.slice(
                              0,
                              5
                            )}
                          </span>
                        </div>

                        <div className="flex items-center gap-2.5">
                          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600">
                            <MapPin
                              size={
                                15
                              }
                            />
                          </div>

                          <span className="line-clamp-1">
                            {
                              event.location
                            }
                          </span>
                        </div>

                        <div className="flex items-center gap-2.5">
                          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600">
                            <Users
                              size={
                                15
                              }
                            />
                          </div>

                          <span>
                            {
                              event.capacity
                            }{" "}
                            personas
                          </span>
                        </div>
                      </div>

                      {/* ACTIONS */}

                      <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-100 pt-5">
                        {/* DRAFT */}

                        {event.status ===
                          "Draft" && (
                          <>
                            <Link
                              to={`/organizer/events/${event.id}/edit`}
                              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-bold text-slate-700 transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
                            >
                              <Edit3
                                size={
                                  15
                                }
                              />

                              Editar
                            </Link>

                            <button
                              type="button"
                              onClick={() =>
                                openPublishModal(
                                  event
                                )
                              }
                              className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-3.5 py-2.5 text-xs font-black text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-brand-700"
                            >
                              <Rocket
                                size={
                                  15
                                }
                              />

                              Publicar
                            </button>
                          </>
                        )}

                        {/* PUBLISHED */}

                        {event.status ===
                          "Published" && (
                          <>
                            <Link
                              to={`/organizer/events/${event.id}/edit`}
                              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-bold text-slate-700 transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
                            >
                              <Edit3
                                size={
                                  15
                                }
                              />

                              Editar
                            </Link>

                            <Link
                              to={`/events/${event.id}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
                            >
                              <ExternalLink
                                size={
                                  15
                                }
                              />

                              Ver público
                            </Link>

                            <button
                              type="button"
                              onClick={() =>
                                openCancelModal(
                                  event
                                )
                              }
                              className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs font-bold text-red-600 transition hover:bg-red-100"
                            >
                              <Trash2
                                size={
                                  15
                                }
                              />

                              Cancelar
                            </button>
                          </>
                        )}

                        {/* CANCELLED */}

                        {event.status ===
                          "Cancelled" && (
                          <div className="w-full rounded-xl bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-500">
                            Este evento fue
                            cancelado y ya no
                            admite acciones.
                          </div>
                        )}

                        {/* FINISHED */}

                        {event.status ===
                          "Finished" && (
                          <div className="w-full rounded-xl bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-500">
                            Este evento ya
                            finalizó.
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.article>
                )
              )}
            </div>
          )}
        </div>
      </div>

      {/* ======================================================
          CONFIRMATION MODAL
          ====================================================== */}

      <ConfirmModal
        open={
          selectedEvent !==
            null &&
          modalAction !==
            null
        }
        title={
          modalAction ===
          "publish"
            ? "¿Publicar este evento?"
            : "¿Cancelar este evento?"
        }
        description={
          modalAction ===
          "publish"
            ? `“${selectedEvent?.title ?? ""}” quedará visible en el catálogo público de Evently.`
            : `“${selectedEvent?.title ?? ""}” dejará de estar disponible públicamente. Después de cancelarlo no podrás continuar editándolo.`
        }
        confirmText={
          modalAction ===
          "publish"
            ? "Publicar evento"
            : "Cancelar evento"
        }
        variant={
          modalAction ===
          "cancel"
            ? "danger"
            : "primary"
        }
        loading={
          processing
        }
        onConfirm={
          handleConfirmAction
        }
        onClose={
          closeModal
        }
      />
    </>
  );
}

export default MyEventsPage;