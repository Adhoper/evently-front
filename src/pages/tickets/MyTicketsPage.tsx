import {
  useEffect,
  useState,
} from "react";

import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Copy,
  MapPin,
  QrCode,
  Ticket as TicketIcon,
  Trash2,
} from "lucide-react";

import {
  motion,
} from "motion/react";

import {
  QRCodeSVG,
} from "qrcode.react";

import {
  Link,
} from "react-router-dom";

import {
  toast,
} from "sonner";

import axios from "axios";

import {
  cancelTicket,
  getMyTickets,
} from "../../services/ticketService";

import type {
  Ticket,
} from "../../types/ticket";

import ConfirmModal from "../../components/ui/ConfirmModal";

import {
  EmptyState,
} from "../../components/ui/PageState";

import {
  formatEventDate,
} from "../../utils/date";

import {
  resolveImageUrl,
} from "../../utils/image";

function MyTicketsPage() {
  const [
    tickets,
    setTickets,
  ] = useState<Ticket[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    selectedTicket,
    setSelectedTicket,
  ] =
    useState<Ticket | null>(
      null
    );

  const [
    cancelling,
    setCancelling,
  ] = useState(false);

  // ============================================================
  // LOAD
  // ============================================================

  useEffect(() => {
    let cancelled = false;

    getMyTickets()
      .then((data) => {
        if (!cancelled) {
          setTickets(data);
        }
      })
      .catch((error) => {
        console.error(error);

        if (!cancelled) {
          toast.error(
            "No fue posible cargar tus entradas."
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // ============================================================
  // CANCEL
  // ============================================================

  const handleCancel =
    async () => {
      if (!selectedTicket) {
        return;
      }

      try {
        setCancelling(true);

        const updatedTicket =
          await cancelTicket(
            selectedTicket.id
          );

        setTickets(
          (current) =>
            current.map(
              (ticket) =>
                ticket.id ===
                updatedTicket.id
                  ? updatedTicket
                  : ticket
            )
        );

        setSelectedTicket(
          null
        );

        toast.success(
          "Reserva cancelada.",
          {
            description:
              "El cupo volvió a estar disponible.",
          }
        );
      } catch (error) {
        console.error(error);

        if (
          axios.isAxiosError(
            error
          )
        ) {
          toast.error(
            "No fue posible cancelar la entrada.",
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
        setCancelling(false);
      }
    };

  const copyCode =
    async (
      code: string
    ) => {
      await navigator.clipboard.writeText(
        code
      );

      toast.success(
        "Código copiado."
      );
    };

  return (
    <>
      <main className="min-h-[70vh] bg-slate-50 py-10 dark:bg-slate-950 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
          >
            <span className="text-xs font-black uppercase tracking-[0.2em] text-brand-600 dark:text-brand-400">
              Tus experiencias
            </span>

            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl">
              Mis entradas
            </h1>

            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Guarda tus códigos QR y
              tenlos listos cuando
              llegues al evento.
            </p>
          </motion.div>

          {loading ? (
            <TicketsSkeleton />
          ) : tickets.length ===
            0 ? (
            <div className="mt-10">
              <EmptyState
                title="Todavía no tienes entradas"
                description="Explora Evently y reserva tu primera experiencia."
              />

              <div className="mt-6 text-center">
                <Link
                  to="/events"
                  className="inline-flex rounded-xl bg-brand-600 px-5 py-3 text-sm font-black text-white"
                >
                  Explorar eventos
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-10 space-y-6">
              {tickets.map(
                (
                  ticket,
                  index
                ) => (
                  <motion.article
                    key={
                      ticket.id
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
                            0.05,
                          0.3
                        ),
                    }}
                    className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
                  >
                    <div className="grid lg:grid-cols-[220px_minmax(0,1fr)_260px]">
                      {/* IMAGE */}

                      <div className="aspect-16/9 overflow-hidden bg-slate-900 lg:aspect-auto lg:min-h-64">
                        {ticket.eventImageUrl ? (
                          <img
                            src={
                              resolveImageUrl(ticket.eventImageUrl) ?? ""
                            }
                            alt={
                              ticket.eventTitle
                            }
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center bg-linear-to-br from-brand-600 via-brand-800 to-slate-950">
                            <TicketIcon
                              size={40}
                              className="text-white"
                            />
                          </div>
                        )}
                      </div>

                      {/* INFO */}

                      <div className="p-6 sm:p-7">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-black uppercase tracking-[0.16em] text-brand-600 dark:text-brand-400">
                            {
                              ticket.categoryName
                            }
                          </span>

                          <TicketStatusBadge
                            status={
                              ticket.status
                            }
                          />
                        </div>

                        <h2 className="mt-3 text-2xl font-black text-slate-950 dark:text-white">
                          {
                            ticket.eventTitle
                          }
                        </h2>

                        <div className="mt-6 grid gap-3 text-sm text-slate-500 dark:text-slate-400 sm:grid-cols-2">
                          <TicketInfo
                            icon={
                              CalendarDays
                            }
                          >
                            {formatEventDate(
                              ticket.eventDate,
                              {
                                day: "2-digit",
                                month:
                                  "long",
                                year:
                                  "numeric",
                              }
                            )}
                          </TicketInfo>

                          <TicketInfo
                            icon={
                              Clock3
                            }
                          >
                            {ticket.eventStartTime.slice(
                              0,
                              5
                            )}
                          </TicketInfo>

                          <TicketInfo
                            icon={
                              MapPin
                            }
                          >
                            {
                              ticket.eventLocation
                            }
                          </TicketInfo>
                        </div>

                        <div className="mt-7 flex flex-wrap gap-2">
                          <Link
                            to={`/events/${ticket.eventId}`}
                            className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-black text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                          >
                            Ver evento
                          </Link>

                          {ticket.status ===
                            "Reserved" && (
                            <button
                              type="button"
                              onClick={() =>
                                setSelectedTicket(
                                  ticket
                                )
                              }
                              className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-black text-red-600 transition hover:bg-red-100 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400"
                            >
                              <Trash2
                                size={15}
                              />

                              Cancelar reserva
                            </button>
                          )}
                        </div>
                      </div>

                      {/* QR */}

                      <div className="relative border-t border-dashed border-slate-300 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-950 lg:border-l lg:border-t-0">
                        {ticket.status ===
                        "Reserved" ? (
                          <div className="flex h-full flex-col items-center justify-center text-center">
                            <div className="rounded-2xl bg-white p-4 shadow-sm">
                              <QRCodeSVG
                                value={
                                  ticket.code
                                }
                                size={
                                  150
                                }
                                level="H"
                                includeMargin={
                                  false
                                }
                              />
                            </div>

                            <div className="mt-5 flex items-center gap-2 text-slate-500 dark:text-slate-400">
                              <QrCode
                                size={15}
                              />

                              <span className="text-xs font-bold">
                                Código de entrada
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                copyCode(
                                  ticket.code
                                )
                              }
                              className="mt-2 inline-flex max-w-full items-center gap-2 rounded-lg px-2 py-1 font-mono text-[10px] font-bold text-slate-500 transition hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-800"
                            >
                              <span className="truncate">
                                {
                                  ticket.code
                                }
                              </span>

                              <Copy
                                size={
                                  13
                                }
                              />
                            </button>
                          </div>
                        ) : (
                          <div className="flex h-full min-h-48 flex-col items-center justify-center text-center">
                            <div
                              className={`grid h-14 w-14 place-items-center rounded-2xl ${
                                ticket.status ===
                                "CheckedIn"
                                  ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400"
                                  : "bg-slate-200 text-slate-500 dark:bg-slate-800"
                              }`}
                            >
                              <CheckCircle2
                                size={25}
                              />
                            </div>

                            <p className="mt-4 text-sm font-black text-slate-800 dark:text-slate-200">
                              {ticket.status ===
                              "CheckedIn"
                                ? "Entrada utilizada"
                                : "Entrada cancelada"}
                            </p>
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
      </main>

      <ConfirmModal
        open={
          selectedTicket !==
          null
        }
        title="¿Cancelar esta entrada?"
        description={`La reserva para “${selectedTicket?.eventTitle ?? ""}” será cancelada y el código QR dejará de ser válido.`}
        confirmText="Cancelar reserva"
        variant="danger"
        loading={
          cancelling
        }
        onConfirm={
          handleCancel
        }
        onClose={() =>
          !cancelling &&
          setSelectedTicket(
            null
          )
        }
      />
    </>
  );
}

function TicketStatusBadge({
  status,
}: {
  status:
    Ticket["status"];
}) {
  if (
    status ===
    "CheckedIn"
  ) {
    return (
      <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-black uppercase text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
        Utilizada
      </span>
    );
  }

  if (
    status ===
    "Cancelled"
  ) {
    return (
      <span className="rounded-full bg-red-50 px-3 py-1 text-[10px] font-black uppercase text-red-700 dark:bg-red-950/30 dark:text-red-400">
        Cancelada
      </span>
    );
  }

  return (
    <span className="rounded-full bg-brand-50 px-3 py-1 text-[10px] font-black uppercase text-brand-700 dark:bg-brand-950/30 dark:text-brand-400">
      Activa
    </span>
  );
}

function TicketInfo({
  icon: Icon,
  children,
}: {
  icon: React.ElementType;
  children:
    React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon
        size={15}
        className="shrink-0 text-brand-500"
      />

      <span>
        {children}
      </span>
    </div>
  );
}

function TicketsSkeleton() {
  return (
    <div className="mt-10 space-y-6">
      {[1, 2].map(
        (item) => (
          <div
            key={item}
            className="h-72 animate-pulse rounded-3xl bg-slate-200 dark:bg-slate-800"
          />
        )
      )}
    </div>
  );
}

export default MyTicketsPage;