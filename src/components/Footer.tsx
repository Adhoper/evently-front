import {
  CalendarDays,
  Code2,
  Sparkles,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

function Footer() {
  const year =
    new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-[1.4fr_1fr_1fr]">
          {/* BRAND */}

          <div className="sm:col-span-2 md:col-span-1">
            <Link
              to="/"
              className="inline-flex items-center gap-2.5"
            >
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 text-white shadow-md shadow-brand-600/20">
                <Sparkles
                  size={17}
                />
              </div>

              <div>
                <span className="text-lg font-black tracking-tight text-slate-950 dark:text-slate-50">
                  EVENTLY
                </span>

                <div className="mt-1 h-1 w-7 rounded-full bg-accent-400" />
              </div>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
              Descubre eventos,
              guarda tus entradas y
              organiza experiencias
              desde un solo lugar.
            </p>
          </div>

          {/* EXPLORE */}

          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
              Explorar
            </p>

            <div className="mt-4 space-y-3 text-sm font-semibold text-slate-600 dark:text-slate-300">
              <Link
                to="/"
                className="block w-fit transition hover:translate-x-1 hover:text-brand-600"
              >
                Inicio
              </Link>

              <Link
                to="/events"
                className="block w-fit transition hover:translate-x-1 hover:text-brand-600"
              >
                Eventos
              </Link>

              <Link
                to="/account"
                className="block w-fit transition hover:translate-x-1 hover:text-brand-600"
              >
                Mi cuenta
              </Link>
            </div>
          </div>

          {/* PROJECT */}

          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
              Proyecto
            </p>

            <div className="mt-4 space-y-4 text-sm font-semibold text-slate-600 dark:text-slate-300">
              <div className="flex items-start gap-2.5">
                <CalendarDays
                  size={16}
                  className="mt-0.5 shrink-0 text-brand-500"
                />

                <span>
                  Gestión de eventos y
                  entradas
                </span>
              </div>

              <div className="flex items-start gap-2.5">
                <Code2
                  size={16}
                  className="mt-0.5 shrink-0 text-brand-500"
                />

                <span>
                  React + ASP.NET Core
                  + SQL Server
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM */}

        <div className="mt-10 flex flex-col gap-3 border-t border-slate-200 dark:border-slate-800 pt-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} Evently.
          </p>

          <p>
            Diseñado para conectar
            personas con experiencias.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;