import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  LoaderCircle,
  Mail,
  MapPin,
  Search,
  Ticket,
  Users,
  X,
} from "lucide-react";

import {
  motion,
} from "motion/react";

import {
  Link,
  useParams,
} from "react-router-dom";

import {
  getEventAttendees,
} from "../../services/organizerService";

import type {
  Attendee,
  AttendeeStatus,
  EventAttendees,
} from "../../types/organizer";

import {
  formatEventDate,
} from "../../utils/date";

type StatusFilter =
  | "all"
  | AttendeeStatus;

function EventAttendeesPage() {
  const { id } =
    useParams();

  const [
    data,
    setData,
  ] =
    useState<EventAttendees | null>(
      null
    );

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
    statusFilter,
    setStatusFilter,
  ] =
    useState<StatusFilter>(
      "all"
    );

  // ============================================================
  // LOAD
  // ============================================================

  useEffect(() => {
    if (!id) {
      return;
    }

    let cancelled = false;

    getEventAttendees(
      Number(id)
    )
      .then((response) => {
        if (cancelled) {
          return;
        }

        setData(response);
        setError(false);
      })
      .catch((requestError) => {
        console.error(
          requestError
        );

        if (!cancelled) {
          setError(true);
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
  }, [id]);

  // ============================================================
  // FILTER
  // ============================================================

  const filteredAttendees =
    useMemo(() => {
      if (!data) {
        return [];
      }

      const normalizedSearch =
        search
          .trim()
          .toLowerCase();

      return data.attendees.filter(
        (attendee) => {
          const matchesSearch =
            !normalizedSearch ||
            attendee.fullName
              .toLowerCase()
              .includes(
                normalizedSearch
              ) ||
            attendee.email
              .toLowerCase()
              .includes(
                normalizedSearch
              );

          const matchesStatus =
            statusFilter === "all" ||
            attendee.status ===
              statusFilter;

          return (
            matchesSearch &&
            matchesStatus
          );
        }
      );
    }, [
      data,
      search,
      statusFilter,
    ]);

  const clearFilters = () => {
    setSearch("");
    setStatusFilter(
      "all"
    );
  };

  const hasFilters =
    search.trim().length > 0 ||
    statusFilter !== "all";

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <LoaderCircle
            size={30}
            className="mx-auto animate-spin text-brand-600"
          />

          <p className="mt-4 text-sm font-semibold text-slate-500 dark:text-slate-400">
            Cargando asistentes...
          </p>
        </div>
      </div>
    );
  }

  // ============================================================
  // ERROR
  // ============================================================

  if (
    error ||
    !data
  ) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="max-w-md text-center">
          <Users
            size={34}
            className="mx-auto text-slate-300"
          />

          <h1 className="mt-5 text-2xl font-black text-slate-950 dark:text-white">
            Evento no disponible
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
            El evento no existe o no
            pertenece a tu cuenta.
          </p>

          <Link
            to="/organizer/events"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-black text-white"
          >
            <ArrowLeft
              size={16}
            />

            Mis eventos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-7xl">
        {/* ====================================================
            BACK
            ==================================================== */}

        <Link
          to="/organizer/events"
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400"
        >
          <ArrowLeft
            size={16}
          />

          Volver a mis eventos
        </Link>

        {/* ====================================================
            HEADER
            ==================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="mt-6"
        >
          <span className="text-xs font-black uppercase tracking-[0.2em] text-brand-600 dark:text-brand-400">
            Asistentes
          </span>

          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl">
            {data.title}
          </h1>

          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <CalendarDays
                size={15}
                className="text-brand-500"
              />

              {formatEventDate(
                data.date,
                {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                }
              )}
            </div>

            <div className="flex items-center gap-2">
              <Clock3
                size={15}
                className="text-brand-500"
              />

              {data.startTime.slice(
                0,
                5
              )}
            </div>

            <div className="flex items-center gap-2">
              <MapPin
                size={15}
                className="text-brand-500"
              />

              {data.location}
            </div>
          </div>
        </motion.div>

        {/* ====================================================
            STATS
            ==================================================== */}

        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
          <StatBox
            label="Capacidad"
            value={
              data.capacity
            }
          />

          <StatBox
            label="Reservas"
            value={
              data.reservedCount
            }
            variant="blue"
          />

          <StatBox
            label="Check-ins"
            value={
              data.checkedInCount
            }
            variant="green"
          />

          <StatBox
            label="Disponibles"
            value={
              data.availableSpots
            }
          />

          <StatBox
            label="Ocupación"
            value={`${data.occupancyRate}%`}
            variant="yellow"
          />

          <StatBox
            label="Asistencia"
            value={`${data.attendanceRate}%`}
            variant="green"
          />
        </div>

        {/* ====================================================
            PROGRESS
            ==================================================== */}

        <section className="mt-6 grid gap-4 md:grid-cols-2">
          <RateCard
            title="Ocupación"
            description={`${data.reservedCount} de ${data.capacity} lugares ocupados`}
            value={
              data.occupancyRate
            }
          />

          <RateCard
            title="Asistencia"
            description={`${data.checkedInCount} de ${data.reservedCount} reservas utilizadas`}
            value={
              data.attendanceRate
            }
            green
          />
        </section>

        {/* ====================================================
            FILTERS
            ==================================================== */}

        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
          <div className="grid gap-3 lg:grid-cols-[1fr_240px]">
            <div className="relative">
              <Search
                size={17}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Buscar por nombre o correo..."
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-950 outline-none transition focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:bg-slate-950"
              />
            </div>

            <select
              value={
                statusFilter
              }
              onChange={(event) =>
                setStatusFilter(
                  event.target
                    .value as StatusFilter
                )
              }
              className="h-12 cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-700 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300"
            >
              <option value="all">
                Todos los estados
              </option>

              <option value="Reserved">
                Reservada
              </option>

              <option value="CheckedIn">
                Utilizada
              </option>

              <option value="Cancelled">
                Cancelada
              </option>
            </select>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              <strong className="text-slate-950 dark:text-white">
                {
                  filteredAttendees.length
                }
              </strong>{" "}
              resultado
              {filteredAttendees.length !==
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
                className="inline-flex w-fit items-center gap-2 text-sm font-black text-brand-600 dark:text-brand-400"
              >
                <X
                  size={15}
                />

                Limpiar filtros
              </button>
            )}
          </div>
        </section>

        {/* ====================================================
            ATTENDEES
            ==================================================== */}

        <section className="mt-5">
          {filteredAttendees.length ===
          0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900">
              <Users
                size={35}
                className="mx-auto text-slate-300 dark:text-slate-600"
              />

              <h2 className="mt-5 text-lg font-black text-slate-950 dark:text-white">
                No hay asistentes para mostrar
              </h2>

              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                {hasFilters
                  ? "Prueba utilizando otros filtros."
                  : "Cuando alguien reserve una entrada aparecerá aquí."}
              </p>
            </div>
          ) : (
            <>
              {/* ================================================
                  MOBILE CARDS
                  ================================================ */}

              <div className="space-y-3 md:hidden">
                {filteredAttendees.map(
                  (attendee) => (
                    <AttendeeMobileCard
                      key={
                        attendee.ticketId
                      }
                      attendee={
                        attendee
                      }
                    />
                  )
                )}
              </div>

              {/* ================================================
                  DESKTOP TABLE
                  ================================================ */}

              <div className="hidden overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 md:block">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[850px]">
                    <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
                      <tr>
                        <TableHeader>
                          Asistente
                        </TableHeader>

                        <TableHeader>
                          Estado
                        </TableHeader>

                        <TableHeader>
                          Reserva
                        </TableHeader>

                        <TableHeader>
                          Check-in
                        </TableHeader>

                        <TableHeader>
                          Ticket
                        </TableHeader>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {filteredAttendees.map(
                        (
                          attendee
                        ) => (
                          <AttendeeRow
                            key={
                              attendee.ticketId
                            }
                            attendee={
                              attendee
                            }
                          />
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}

// ============================================================
// STAT BOX
// ============================================================

function StatBox({
  label,
  value,
  variant = "default",
}: {
  label: string;
  value:
    | number
    | string;
  variant?:
    | "default"
    | "blue"
    | "green"
    | "yellow";
}) {
  const classes = {
    default:
      "text-slate-950 dark:text-white",

    blue:
      "text-brand-600 dark:text-brand-400",

    green:
      "text-emerald-600 dark:text-emerald-400",

    yellow:
      "text-amber-600 dark:text-amber-400",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p
        className={`mt-2 text-2xl font-black ${classes[variant]}`}
      >
        {value}
      </p>
    </div>
  );
}

// ============================================================
// RATE CARD
// ============================================================

function RateCard({
  title,
  description,
  value,
  green = false,
}: {
  title: string;
  description: string;
  value: number;
  green?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-black text-slate-950 dark:text-white">
            {title}
          </p>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {description}
          </p>
        </div>

        <span
          className={`text-xl font-black ${
            green
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-brand-600 dark:text-brand-400"
          }`}
        >
          {value}%
        </span>
      </div>

      <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <motion.div
          initial={{
            width: 0,
          }}
          animate={{
            width: `${Math.min(
              100,
              value
            )}%`,
          }}
          className={`h-full rounded-full ${
            green
              ? "bg-emerald-500"
              : "bg-brand-600"
          }`}
        />
      </div>
    </div>
  );
}

// ============================================================
// STATUS
// ============================================================

function AttendeeStatusBadge({
  status,
}: {
  status: AttendeeStatus;
}) {
  if (
    status ===
    "CheckedIn"
  ) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-black uppercase text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
        <CheckCircle2
          size={12}
        />

        Utilizada
      </span>
    );
  }

  if (
    status ===
    "Cancelled"
  ) {
    return (
      <span className="inline-flex rounded-full bg-red-50 px-3 py-1.5 text-[10px] font-black uppercase text-red-700 dark:bg-red-950/30 dark:text-red-400">
        Cancelada
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1.5 text-[10px] font-black uppercase text-brand-700 dark:bg-brand-950/30 dark:text-brand-400">
      <Ticket
        size={12}
      />

      Reservada
    </span>
  );
}

// ============================================================
// MOBILE CARD
// ============================================================

function AttendeeMobileCard({
  attendee,
}: {
  attendee: Attendee;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 font-black text-brand-600 dark:bg-brand-950/40 dark:text-brand-400">
          {attendee.fullName
            .charAt(0)
            .toUpperCase()}
        </div>

        <AttendeeStatusBadge
          status={
            attendee.status
          }
        />
      </div>

      <h3 className="mt-4 font-black text-slate-950 dark:text-white">
        {
          attendee.fullName
        }
      </h3>

      <div className="mt-2 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
        <Mail
          size={14}
        />

        <span className="break-all">
          {attendee.email}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <DateInfo
          label="Reserva"
          value={formatDateTime(
            attendee.reservedAt
          )}
        />

        <DateInfo
          label="Check-in"
          value={
            attendee.checkedInAt
              ? formatDateTime(
                  attendee.checkedInAt
                )
              : "—"
          }
        />
      </div>
    </article>
  );
}

// ============================================================
// DESKTOP ROW
// ============================================================

function AttendeeRow({
  attendee,
}: {
  attendee: Attendee;
}) {
  return (
    <tr className="transition hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-50 text-xs font-black text-brand-600 dark:bg-brand-950/40 dark:text-brand-400">
            {attendee.fullName
              .charAt(0)
              .toUpperCase()}
          </div>

          <div className="min-w-0">
            <p className="font-black text-slate-800 dark:text-slate-100">
              {
                attendee.fullName
              }
            </p>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {attendee.email}
            </p>
          </div>
        </div>
      </td>

      <td className="px-6 py-4">
        <AttendeeStatusBadge
          status={
            attendee.status
          }
        />
      </td>

      <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
        {formatDateTime(
          attendee.reservedAt
        )}
      </td>

      <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
        {attendee.checkedInAt
          ? formatDateTime(
              attendee.checkedInAt
            )
          : "—"}
      </td>

      <td className="px-6 py-4">
        <span className="font-mono text-xs font-bold text-slate-400">
          #
          {
            attendee.ticketId
          }
        </span>
      </td>
    </tr>
  );
}

// ============================================================
// TABLE HEADER
// ============================================================

function TableHeader({
  children,
}: {
  children:
    React.ReactNode;
}) {
  return (
    <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
      {children}
    </th>
  );
}

// ============================================================
// DATE INFO
// ============================================================

function DateInfo({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-950">
      <p className="text-[10px] font-black uppercase text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-xs font-bold text-slate-700 dark:text-slate-300">
        {value}
      </p>
    </div>
  );
}

// ============================================================
// FORMAT DATETIME
// ============================================================

function formatDateTime(
  value: string
) {
  return new Date(
    value
  ).toLocaleString(
    "es-DO",
    {
      day: "2-digit",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
    }
  );
}

export default EventAttendeesPage;