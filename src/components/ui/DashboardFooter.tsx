import { Heart } from "lucide-react";

function DashboardFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-slate-100 px-4 py-5 text-xs text-slate-500 dark:border-slate-800 dark:bg-[#0b1120] dark:text-slate-400 sm:px-6 lg:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p>© {year} Evently. Todos los derechos reservados.</p>
        <p className="inline-flex items-center gap-1.5">Hecho con <Heart size={13} className="fill-rose-500 text-rose-500" /> por Adhoper.</p>
      </div>
    </footer>
  );
}

export default DashboardFooter;
