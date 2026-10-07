import {
  AlertCircle,
  CalendarSearch,
  LoaderCircle,
} from "lucide-react";

import {
  motion,
} from "motion/react";

interface PageLoaderProps {
  text?: string;
}

export function PageLoader({
  text = "Cargando...",
}: PageLoaderProps) {
  return (
    <div className="flex min-h-[45vh] items-center justify-center px-4">
      <div className="flex flex-col items-center text-center">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-600">
          <LoaderCircle
            size={26}
            className="animate-spin"
          />
        </div>

        <p className="mt-4 text-sm font-semibold text-slate-500">
          {text}
        </p>
      </div>
    </div>
  );
}

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Algo salió mal",
  description =
    "No pudimos cargar la información en este momento.",
  onRetry,
}: ErrorStateProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="rounded-3xl border border-red-100 bg-red-50/70 px-5 py-12 text-center sm:px-8"
    >
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-red-100 text-red-600">
        <AlertCircle size={25} />
      </div>

      <h3 className="mt-5 text-xl font-black text-slate-950">
        {title}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
        {description}
      </p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-6 rounded-xl bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
        >
          Intentar nuevamente
        </button>
      )}
    </motion.div>
  );
}

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export function EmptyState({
  title = "No hay eventos disponibles",
  description =
    "Cuando haya nuevos eventos publicados aparecerán aquí.",
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="rounded-3xl border border-dashed border-slate-300 bg-white px-5 py-16 text-center shadow-sm"
    >
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-brand-50 text-brand-600">
        <CalendarSearch size={28} />
      </div>

      <h3 className="mt-5 text-xl font-black text-slate-950">
        {title}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        {description}
      </p>
    </motion.div>
  );
}