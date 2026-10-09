import type { SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  wrapperClassName?: string;
}

function Select({ className = "", wrapperClassName = "", children, ...props }: SelectProps) {
  return (
    <div className={`relative ${wrapperClassName}`}>
      <select
        {...props}
        className={`h-12 w-full appearance-none rounded-xl border border-slate-300 bg-slate-100 px-4 pr-11 text-sm font-semibold text-slate-800 outline-none transition hover:border-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-slate-600 ${className}`}
      >
        {children}
      </select>
      <ChevronDown
        size={17}
        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400"
      />
    </div>
  );
}

export default Select;
