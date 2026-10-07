import {
  ArrowLeft,
  Compass,
  Sparkles,
} from "lucide-react";

import {
  motion,
} from "motion/react";

import {
  Link,
} from "react-router-dom";

function NotFoundPage() {
  return (
    <main className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-950 px-4 py-16">
      <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-200/40 blur-3xl" />

      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="relative max-w-xl text-center"
      >
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-brand-600 text-white shadow-xl shadow-brand-600/20">
          <Compass
            size={28}
          />
        </div>

        <p className="mt-7 text-sm font-black uppercase tracking-[0.25em] text-brand-600">
          Error 404
        </p>

        <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 dark:text-slate-50 sm:text-5xl">
          Parece que este evento no
          existe.
        </h1>

        <p className="mx-auto mt-5 max-w-md leading-7 text-slate-500 dark:text-slate-400">
          La página que intentas visitar
          pudo cambiar de dirección o
          simplemente nunca estuvo aquí.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3.5 text-sm font-black text-white shadow-lg shadow-brand-600/20"
          >
            <ArrowLeft
              size={17}
            />

            Volver al inicio
          </Link>

          <Link
            to="/events"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-5 py-3.5 text-sm font-black text-slate-700 dark:text-slate-200"
          >
            <Sparkles
              size={17}
            />

            Explorar eventos
          </Link>
        </div>
      </motion.div>
    </main>
  );
}

export default NotFoundPage;